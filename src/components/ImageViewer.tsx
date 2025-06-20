
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';

interface SuspiciousArea {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  type: 'Maligno' | 'Suspeito';
}

interface ImageViewerProps {
  imageFile: File;
  prediction: 'Benigno' | 'Maligno' | 'Suspeito';
  confidence: number;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ imageFile, prediction, confidence }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [suspiciousAreas, setSuspiciousAreas] = useState<SuspiciousArea[]>([]);

  useEffect(() => {
    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);

    // Gerar áreas suspeitas simuladas baseadas na predição
    if (prediction === 'Maligno' || prediction === 'Suspeito') {
      const areas: SuspiciousArea[] = [];
      const numAreas = prediction === 'Maligno' ? Math.floor(Math.random() * 3) + 2 : Math.floor(Math.random() * 2) + 1;
      
      for (let i = 0; i < numAreas; i++) {
        areas.push({
          x: Math.random() * 60 + 10, // 10-70% da largura
          y: Math.random() * 60 + 10, // 10-70% da altura
          width: Math.random() * 15 + 10, // 10-25% da largura
          height: Math.random() * 15 + 10, // 10-25% da altura
          confidence: Math.random() * 40 + 60, // 60-100%
          type: prediction
        });
      }
      setSuspiciousAreas(areas);
    }

    return () => URL.revokeObjectURL(url);
  }, [imageFile, prediction]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.1));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `analyzed_${imageFile.name}`;
    link.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="hover-lift">
          <ZoomIn className="w-4 h-4 mr-2" />
          Visualizar Imagem
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Análise Detalhada - {imageFile.name}</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleRotate}>
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Imagem principal */}
            <div className="flex-1 overflow-auto bg-gray-100 rounded-lg relative">
              <div 
                className="relative inline-block min-w-full min-h-full"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center'
                }}
              >
                <img
                  src={imageUrl}
                  alt="Análise médica"
                  className="max-w-none"
                  style={{ minWidth: '100%', minHeight: '100%' }}
                />
                
                {/* Áreas marcadas */}
                {suspiciousAreas.map((area, index) => (
                  <div
                    key={index}
                    className={`absolute border-2 ${
                      area.type === 'Maligno' 
                        ? 'border-red-500 bg-red-500/20' 
                        : 'border-orange-500 bg-orange-500/20'
                    } rounded-lg`}
                    style={{
                      left: `${area.x}%`,
                      top: `${area.y}%`,
                      width: `${area.width}%`,
                      height: `${area.height}%`,
                    }}
                  >
                    <div className={`absolute -top-6 left-0 text-xs px-2 py-1 rounded ${
                      area.type === 'Maligno' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-orange-500 text-white'
                    }`}>
                      {area.confidence.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Painel lateral com informações */}
            <div className="w-80 ml-4 space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-3">Resultado da Análise</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Predição:</span>
                    <span className={`text-sm font-medium ${
                      prediction === 'Benigno' ? 'text-emerald-600' :
                      prediction === 'Maligno' ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {prediction}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Confiança:</span>
                    <span className="text-sm font-medium">{confidence.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {suspiciousAreas.length > 0 && (
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold text-gray-900 mb-3">Áreas Identificadas</h3>
                  <div className="space-y-3">
                    {suspiciousAreas.map((area, index) => (
                      <div key={index} className="border-l-4 border-red-500 pl-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Área {index + 1}</p>
                            <p className="text-xs text-gray-500">
                              Posição: {area.x.toFixed(0)}%, {area.y.toFixed(0)}%
                            </p>
                            <p className="text-xs text-gray-500">
                              Tamanho: {area.width.toFixed(0)}% × {area.height.toFixed(0)}%
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-2 py-1 rounded ${
                              area.type === 'Maligno' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {area.type}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {area.confidence.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">Legenda</h4>
                <div className="space-y-1 text-xs text-yellow-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-red-500 bg-red-500/20"></div>
                    <span>Área maligna suspeita</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 border-2 border-orange-500 bg-orange-500/20"></div>
                    <span>Área que requer atenção</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;
