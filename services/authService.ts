
import { supabase } from '../lib/supabaseClient';
import { User, PlanType } from '../types';

export const authService = {
  
  login: async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Usuário não encontrado.');

    // Buscar dados do perfil (créditos, plano) na tabela 'profiles'
    // Caso a tabela não exista ou o usuário não tenha perfil, usamos defaults.
    let profile = null;
    try {
        const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        profile = profileData;
    } catch (e) {
        console.warn("Perfil não encontrado, usando dados padrão.");
    }

    return {
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.user_metadata?.name || 'Chef',
      plan: profile?.plan || 'free',
      credits: profile?.credits ?? 3, // Default 3 credits if no profile
    };
  },

  register: async (name: string, email: string, password: string): Promise<void> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (error) throw new Error(error.message);

    // Criar perfil inicial na tabela 'profiles'
    if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
            { 
                id: data.user.id, 
                email: email, 
                name: name, // Salva o nome também na tabela para facilidade
                plan: 'free', 
                credits: 3 
            }
        ]);
        
        // Se der erro (ex: tabela não existe ou user já existe), apenas logamos
        if (profileError) {
            console.error("Erro ao criar perfil no banco (pode ser ignorado se houver triggers):", profileError);
        }
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  getCurrentUser: async (): Promise<User | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    let profile = null;
    try {
        const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        profile = profileData;
    } catch (e) {
        console.warn("Perfil não encontrado no refresh.");
    }

    return {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.user_metadata?.name || 'Chef',
      plan: profile?.plan || 'free',
      credits: profile?.credits ?? 3,
    };
  },

  updateUserData: async (userId: string, updates: { credits?: number, plan?: PlanType }) => {
    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

    if (error) {
        console.error("Erro ao atualizar perfil:", error);
        // Não lançamos erro aqui para não travar a UI se o banco falhar momentaneamente
    }
  }
};
