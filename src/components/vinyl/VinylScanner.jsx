'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

const VinylScanner = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const startCamera = async () => {
    if (!isMobile) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  }, []);

  const processImage = async (blob) => {
    try {
      setIsProcessing(true);
      const formData = new FormData();
      formData.append('image', blob);

      const response = await fetch('/api/vinyl/scan', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Scan failed');
      
      const result = await response.json();
      setScanResult(result);
    } catch (err) {
      console.error('Error processing image:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    const blob = await new Promise(resolve => 
      canvas.toBlob(resolve, 'image/jpeg', 0.8)
    );

    await processImage(blob);
    stopCamera();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    await processImage(file);
  };

  const handleVinylSelect = (vinyl) => {
    router.push(`/vinyl/${vinyl.id}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
        {isMobile ? (
          !isCameraActive ? (
            <div className="space-y-4">
              <button 
                onClick={startCamera}
                className="w-full bg-[#6F4E37] hover:bg-[#5D3E27] text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <Camera className="w-4 h-4" />
                Démarrer la caméra
              </button>
              <div className="relative">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-[#6F4E37] hover:bg-[#6F4E37]/5 text-[#6F4E37] py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Upload className="w-4 h-4" />
                  Importer une image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={captureImage}
                  disabled={isProcessing}
                  className="flex-1 bg-[#6F4E37] hover:bg-[#5D3E27] disabled:bg-[#6F4E37]/50 text-white py-2 px-4 rounded-lg transition"
                >
                  {isProcessing ? 'Traitement...' : 'Capturer'}
                </button>
                <button 
                  onClick={stopCamera}
                  className="px-4 py-2 border border-[#6F4E37] text-[#6F4E37] hover:bg-[#6F4E37]/5 rounded-lg"
                >
                  Annuler
                </button>
              </div>
            </div>
          )
        ) : (
          // Desktop version
          <div className="space-y-4">
            <div className="relative">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-[#6F4E37] hover:bg-[#6F4E37]/5 text-[#6F4E37] py-8 px-4 rounded-lg flex flex-col items-center justify-center gap-4 transition"
              >
                <Upload className="w-8 h-8" />
                <div className="text-center">
                  <p className="font-medium">Cliquez ou glissez une image</p>
                  <p className="text-sm text-gray-500">JPG, PNG jusqu'à 10MB</p>
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6F4E37] mx-auto"></div>
            <div className="text-[#6F4E37] mt-2">Traitement de l'image...</div>
          </div>
        )}

        {scanResult && scanResult.discogs_matches?.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="font-semibold text-lg text-[#6F4E37] mb-4">Matches trouvés :</h3>
            <div className="space-y-2">
              {scanResult.discogs_matches.map((match) => (
                <button
                  key={match.id}
                  onClick={() => handleVinylSelect(match)}
                  className="w-full p-3 text-left hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    {match.thumb && (
                      <img 
                        src={match.thumb}
                        alt={match.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900 group-hover:text-[#6F4E37] transition-colors">
                        {match.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {match.year && `${match.year} • `}
                        {match.genre && match.genre.join(', ')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[#6F4E37] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Voir
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VinylScanner;