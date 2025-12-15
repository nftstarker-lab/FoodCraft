import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ResultCardProps {
  title: string;
  content: string | string[];
  icon: React.ReactNode;
  colorClass: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, content, icon, colorClass }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = Array.isArray(content) ? content.join('\n') : content;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300`}>
      <div className={`px-6 py-4 border-b border-slate-100 flex justify-between items-center ${colorClass} bg-opacity-10`}>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${colorClass} text-white shadow-sm`}>
            {icon}
          </div>
          <h3 className="font-bold text-slate-800">{title}</h3>
        </div>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
          title="Copiar conteúdo"
        >
          {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
        </button>
      </div>
      <div className="p-6">
        {Array.isArray(content) ? (
          <ul className="space-y-3">
            {content.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className={`inline-block w-2 h-2 mt-2 mr-3 rounded-full ${colorClass.replace('bg-', 'bg-')}`}></span>
                <span className="text-slate-600 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{content}</p>
        )}
      </div>
    </div>
  );
};