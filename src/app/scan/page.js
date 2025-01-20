'use client';

import { Info } from 'lucide-react';
import VinylScanner from '../../components/vinyl/VinylScanner';

export default function ScanPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scanner un vinyle</h1>
          <p className="text-gray-600">Ajoutez rapidement un vinyle à votre collection en le scannant</p>
        </div>

        {/* Instructions Alert */}
        <div className="mb-8 p-4 rounded-lg bg-[#6F4E37]/5 border border-[#6F4E37]/20">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-[#6F4E37] mt-0.5" />
            <div className="ml-3">
              <h3 className="text-[#6F4E37] font-semibold">Comment scanner un vinyle ?</h3>
              <div className="mt-2 text-gray-600">
                <div className="space-y-2">
                  <p className="text-sm">
                    📱 <span className="font-medium">Sur mobile :</span>
                    {' '}Utilisez votre appareil photo pour scanner la pochette du vinyle, ou importez une photo de votre galerie.
                  </p>
                  <p className="text-sm">
                    💻 <span className="font-medium">Sur ordinateur :</span>
                    {' '}Importez simplement une photo de la pochette de votre vinyle.
                  </p>
                  <p className="text-sm">
                    👉 <span className="font-medium">Conseils :</span>
                    {' '}Pour de meilleurs résultats, assurez-vous que :
                  </p>
                  <ul className="text-sm list-disc pl-6 space-y-1">
                    <li>La pochette est bien éclairée</li>
                    <li>L&apos;image est nette et sans reflets</li>
                    <li>La pochette occupe la majorité de l&apos;image</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scanner Component */}
        <div className="bg-white rounded-xl shadow-sm border">
          <VinylScanner />
        </div>
      </div>
    </div>
  );
}