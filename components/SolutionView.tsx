import React from 'react';
import ReactMarkdown from 'react-markdown';
import { ScanResult } from '../types';
import { ArrowLeft, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface SolutionViewProps {
  data: ScanResult;
  onBack: () => void;
  onDelete: (id: string) => void;
}

const SolutionView: React.FC<SolutionViewProps> = ({ data, onBack, onDelete }) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <header className="px-4 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <span className="font-semibold text-slate-800">Detail Jawaban</span>
        <button 
          onClick={() => onDelete(data.id)}
          className="p-2 -mr-2 text-red-500 hover:bg-red-50 rounded-full"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* Original Image */}
        <div className="w-full bg-slate-900 flex justify-center py-6">
          <img 
            src={data.imageData} 
            alt="Original Math Problem" 
            className="max-h-64 object-contain shadow-lg rounded-sm"
          />
        </div>

        <div className="p-6">
          {data.isPending ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-slate-600 font-medium animate-pulse">Sedang menganalisis gambar...</p>
              <p className="text-xs text-slate-400 text-center max-w-xs">
                AI Gemini sedang membaca soal dan menghitung jawabannya. Mohon tunggu sebentar.
              </p>
            </div>
          ) : data.error ? (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-700">Terjadi Kesalahan</h3>
                <p className="text-red-600 text-sm mt-1">{data.error}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* AI Result Area */}
              <div className="prose prose-indigo prose-sm sm:prose-base max-w-none">
                 <ReactMarkdown 
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-xl font-bold text-slate-900 mb-2" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-lg font-bold text-indigo-700 mt-6 mb-3 flex items-center gap-2" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 text-slate-700" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1 text-slate-700" {...props} />,
                      li: ({node, ...props}) => <li className="pl-1" {...props} />,
                      p: ({node, ...props}) => <p className="text-slate-700 leading-relaxed mb-4" {...props} />,
                    }}
                 >
                   {data.solution}
                 </ReactMarkdown>
              </div>

              {/* Confidence Badge (Static for now, implies success) */}
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-100 text-sm font-medium w-fit">
                <CheckCircle2 className="w-4 h-4" />
                Selesai Dikerjakan oleh AI
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SolutionView;
