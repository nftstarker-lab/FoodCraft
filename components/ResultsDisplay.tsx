import React from 'react';
import { BrandIdentity } from '../types';
import { ResultCard } from './ResultCard';
import { Lightbulb, Target, Eye, Diamond, Mic, Package, Share2, Sparkles } from 'lucide-react';

interface ResultsDisplayProps {
  data: BrandIdentity;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data }) => {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
          <Sparkles className="text-amber-500" />
          Sua Identidade Verbal
        </h2>
        <p className="text-slate-500">A essência da sua marca traduzida em palavras.</p>
      </div>

      {/* Slogans - Full Width */}
      <div className="w-full">
         <ResultCard
            title="Slogans de Impacto"
            content={data.slogans}
            icon={<Lightbulb size={20} />}
            colorClass="bg-amber-500"
          />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ResultCard
          title="Missão"
          content={data.mission}
          icon={<Target size={20} />}
          colorClass="bg-blue-500"
        />
        <ResultCard
          title="Visão"
          content={data.vision}
          icon={<Eye size={20} />}
          colorClass="bg-emerald-500"
        />
        <ResultCard
          title="Valores"
          content={data.values}
          icon={<Diamond size={20} />}
          colorClass="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ResultCard
          title="Tom de Voz"
          content={data.toneOfVoice}
          icon={<Mic size={20} />}
          colorClass="bg-rose-500"
        />
        <div className="space-y-6">
          <ResultCard
            title="Frases para Embalagens"
            content={data.packagingPhrases}
            icon={<Package size={20} />}
            colorClass="bg-indigo-500"
          />
          <ResultCard
            title="Frases para Redes Sociais"
            content={data.socialMediaPhrases}
            icon={<Share2 size={20} />}
            colorClass="bg-pink-500"
          />
        </div>
      </div>
    </div>
  );
};