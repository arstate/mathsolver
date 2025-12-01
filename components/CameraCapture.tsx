import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, X, RefreshCw } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError('');
      // Prefer rear camera (environment)
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setError("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      // Cleanup stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the frame
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64 JPEG with quality compression (0.7) to save space
        const imageData = canvas.toDataURL('image/jpeg', 0.7);
        
        // Stop camera tracks before proceeding
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        
        onCapture(imageData);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      {/* Hidden Canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent z-10">
        <button onClick={onCancel} className="text-white p-2 rounded-full bg-white/20 backdrop-blur-sm">
          <X className="w-6 h-6" />
        </button>
        <span className="text-white font-semibold">Pindai Soal</span>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Video Preview */}
      <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
        {error ? (
          <div className="text-white text-center p-6">
            <p className="mb-4 text-red-400">{error}</p>
            <button 
              onClick={startCamera}
              className="px-4 py-2 bg-indigo-600 rounded-lg text-white"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Guide Box */}
        {!error && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-white/50 rounded-lg relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-indigo-500 -mt-1 -ml-1"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-indigo-500 -mt-1 -mr-1"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-indigo-500 -mb-1 -ml-1"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-indigo-500 -mb-1 -mr-1"></div>
            </div>
            <p className="absolute bottom-32 text-white/80 text-sm font-medium bg-black/40 px-3 py-1 rounded-full">
              Posisikan soal di dalam kotak
            </p>
          </div>
        )}
      </div>

      {/* Footer / Controls */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center pb-8">
        {!error && (
          <button 
            onClick={takePhoto}
            className="w-20 h-20 rounded-full bg-white border-4 border-indigo-500 flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          >
            <Camera className="w-10 h-10 text-indigo-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
