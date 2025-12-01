import React, { useState, useEffect } from 'react';
import { ScanResult, ViewState } from './types';
import HistoryList from './components/HistoryList';
import CameraCapture from './components/CameraCapture';
import SolutionView from './components/SolutionView';
import { solveMathProblem } from './services/geminiService';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'math-solver-history';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('list');
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [activeResultId, setActiveResultId] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleCapture = async (imageData: string) => {
    // Create a new pending record
    const newId = uuidv4();
    const newRecord: ScanResult = {
      id: newId,
      imageData: imageData,
      timestamp: Date.now(),
      question: 'Memproses gambar...',
      solution: '',
      isPending: true,
    };

    // Update state to show pending item immediately
    setHistory(prev => [newRecord, ...prev]); // Add to top
    setActiveResultId(newId);
    setView('detail');

    // Process with Gemini
    try {
      const result = await solveMathProblem(imageData);
      
      setHistory(prev => prev.map(item => {
        if (item.id === newId) {
          return {
            ...item,
            isPending: false,
            // Try to extract a brief title from the markdown if possible, else generic
            question: result.text.substring(0, 50).split('\n')[0].replace(/\*\*/g, '') + '...', 
            solution: result.text
          };
        }
        return item;
      }));
    } catch (error: any) {
      setHistory(prev => prev.map(item => {
        if (item.id === newId) {
          return {
            ...item,
            isPending: false,
            question: 'Gagal Memproses',
            error: error.message || "Gagal menghubungkan ke AI Gemini."
          };
        }
        return item;
      }));
    }
  };

  const deleteRecord = (id: string) => {
    if (confirm("Hapus riwayat ini?")) {
      setHistory(prev => prev.filter(item => item.id !== id));
      if (activeResultId === id) {
        setView('list');
        setActiveResultId(null);
      }
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'camera':
        return (
          <CameraCapture 
            onCapture={handleCapture}
            onCancel={() => setView('list')}
          />
        );
      case 'detail':
        const activeItem = history.find(h => h.id === activeResultId);
        if (!activeItem) return <div>Data tidak ditemukan</div>;
        return (
          <SolutionView 
            data={activeItem}
            onBack={() => setView('list')}
            onDelete={deleteRecord}
          />
        );
      case 'list':
      default:
        return (
          <HistoryList 
            items={history}
            onSelect={(item) => {
              setActiveResultId(item.id);
              setView('detail');
            }}
            onScanNew={() => setView('camera')}
          />
        );
    }
  };

  return (
    <div className="h-screen w-full bg-slate-100 flex justify-center">
      {/* Mobile container constraint */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl overflow-hidden relative">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
