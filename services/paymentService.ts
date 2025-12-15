
export interface PaymentResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export interface CustomerPaymentData {
  name: string;
  email: string;
  taxId: string;
  cellphone: string;
}

export const paymentService = {
  
  /**
   * Inicia um pagamento (Simulação Frontend)
   */
  initiatePayment: async (
      amount: number, 
      description: string, 
      customer: CustomerPaymentData, 
      planId?: string,
      isSubscription: boolean = false
  ): Promise<PaymentResponse> => {
    
    console.log(`[Pagamento Mock] Iniciando: R$ ${amount} - ${description}`);
    console.log(`[Pagamento Mock] Cliente:`, customer);

    // Simula tempo de processamento de rede
    await new Promise(resolve => setTimeout(resolve, 2000));

    const baseUrl = window.location.origin;
    // URL que simula o retorno de sucesso de um gateway de pagamento
    const returnUrl = `${baseUrl}/?payment_status=success`;

    return {
        success: true,
        // Redireciona para a própria aplicação com flag de sucesso
        url: `${returnUrl}&session_id=mock_session_${Date.now()}`
    };
  }
};
