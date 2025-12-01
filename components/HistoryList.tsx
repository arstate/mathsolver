import React from 'react';
import { ScanResult } from '../types';
import { ChevronRight, Clock, Plus, Calculator } from 'lucide-react';

interface HistoryListProps {
  items: ScanResult[];
  onSelect: (item: ScanResult) => void;
  onScanNew: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ items, onSelect, onScanNew }) => {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <header className="bg-white px-6 py-5 shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Matematika Solver</h1>
        </div>
        <p className="text-slate-500 text-sm mt-1">Riwayat Pengerjaan</p>
      </header>

      {/* List Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center mt-20 opacity-60">
            <div className="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              <Calculator className="w-16 h-16 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">Belum ada riwayat</h3>
            <p className="text-slate-500 max-w-xs mt-2">
              Tekan tombol + di bawah untuk memindai soal matematika pertamamu.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="w-full bg-white rounded-xl shadow-sm border border-slate-200 p-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 shrink-0 bg-slate-200 rounded-lg overflow-hidden border border-slate-100">
                  <img src={item.imageData} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 truncate">
                    {item.isPending ? 'Sedang Mengerjakan...' : (item.question || 'Soal Tanpa Teks')}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleString('id-ID')}</span>
                  </div>
                  {item.error && (
                    <span className="text-xs text-red-500 font-medium block mt-1">Gagal memproses</span>
                  )}
                </div>

                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={onScanNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white w-14 h-14 rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center transition-transform active:scale-95"
        >
          <Plus className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default HistoryList;
