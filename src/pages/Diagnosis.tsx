
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import FileUpload from '@/components/FileUpload';
import { useToast } from '@/hooks/use-toast';

interface DiagnosisResult {
  filename: string;
  prediction: 'Benigno' | 'Maligno' | 'Suspeito';
  confidence: number;
  details: {
    benign_probability: number;
    malignant_probability: number;
    suspicious_probability: number;
  };
  timestamp: string;
}

const Diagnosis = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [results, setResults] = useState<DiagnosisResult[]>([]);
  const { toast } = useToast();

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    console.log('Arquivos selecionados para análise:', files);
  };

  const analyzeImages = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, selecione pelo menos uma imagem para análise.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setResults([]);

    // Simulação da análise de IA
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Simular análise de cada imagem
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Gerar resultado simulado
      const benign_prob = Math.random() * 0.6 + 0.2; // 20-80%
      const malignant_prob = Math.random() * 0.4; // 0-40%
      const suspicious_prob = 1 - benign_prob - malignant_prob;
      
      const maxProb = Math.max(benign_prob, malignant_prob, suspicious_prob);
      let prediction: 'Benigno' | 'Maligno' | 'Suspeito';
      
      if (maxProb === benign_prob) prediction = 'Benigno';
      else if (maxProb === malignant_prob) prediction = 'Maligno';
      else prediction = 'Suspeito';

      const result: DiagnosisResult = {
        filename: file.name,
        prediction,
        confidence: maxProb * 100,
        details: {
          benign_probability: benign_prob * 100,
          malignant_probability: malignant_prob * 100,
          suspicious_probability: suspicious_prob * 100
        },
        timestamp: new Date().toLocaleString('pt-BR')
      };

      setResults(prev => [...prev, result]);
      setAnalysisProgress(((i + 1) / selectedFiles.length) * 100);
      
      console.log('Resultado da análise:', result);
    }

    setIsAnalyzing(false);
    toast({
      title: "Análise Concluída! 🔬",
      description: `${selectedFiles.length} imagem(ns) analisada(s) com sucesso.`
    });
  };

  const getResultColor = (prediction: string) => {
    switch (prediction) {
      case 'Benigno': return 'text-emerald-600 bg-emerald-50';
      case 'Maligno': return 'text-red-600 bg-red-50';
      case 'Suspeito': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getResultIcon = (prediction: string) => {
    switch (prediction) {
      case 'Benigno': return '✅';
      case 'Maligno': return '⚠️';
      case 'Suspeito': return '🔍';
      default: return '❓';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Diagnóstico por IA
        </h1>
        <p className="text-gray-600">Analise imagens médicas usando inteligência artificial</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload and Analysis */}
        <div className="lg:col-span-2">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🔬</span>
                <span>Análise de Imagens</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUpload
                onFilesSelected={handleFilesSelected}
                title="Imagens para Diagnóstico"
                description="Selecione imagens médicas para análise de IA"
                multiple={true}
              />

              {isAnalyzing && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Analisando imagens...</span>
                    <span className="text-sm text-gray-500">{Math.round(analysisProgress)}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-3" />
                  <p className="text-sm text-gray-600 text-center">
                    Processando com modelo de IA treinado
                  </p>
                </div>
              )}

              <Button
                onClick={analyzeImages}
                disabled={isAnalyzing || selectedFiles.length === 0}
                className="w-full medical-gradient text-white hover-lift shadow-lg disabled:opacity-50"
              >
                {isAnalyzing ? 'Analisando...' : 'Iniciar Análise'}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results.length > 0 && (
            <Card className="mt-8 hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>📊</span>
                  <span>Resultados da Análise</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getResultIcon(result.prediction)}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{result.filename}</h4>
                            <p className="text-sm text-gray-500">{result.timestamp}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getResultColor(result.prediction)}`}>
                            {result.prediction}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            {result.confidence.toFixed(1)}% confiança
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Benigno:</span>
                          <span className="text-sm font-medium text-emerald-600">
                            {result.details.benign_probability.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Maligno:</span>
                          <span className="text-sm font-medium text-red-600">
                            {result.details.malignant_probability.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Suspeito:</span>
                          <span className="text-sm font-medium text-orange-600">
                            {result.details.suspicious_probability.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-1">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>ℹ️</span>
                <span>Informações do Modelo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="medical-gradient-soft p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Modelo Ativo</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Nome:</span>
                    <span className="font-medium">CancerDetect v1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precisão:</span>
                    <span className="font-medium text-emerald-600">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Treino:</span>
                    <span>15/01/2024</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Interpretação dos Resultados</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span>✅</span>
                    <span><strong>Benigno:</strong> Baixo risco de malignidade</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>⚠️</span>
                    <span><strong>Maligno:</strong> Alta suspeita de câncer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>🔍</span>
                    <span><strong>Suspeito:</strong> Requer análise adicional</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Aviso:</strong> Este sistema é uma ferramenta de apoio. 
                  Sempre consulte um profissional médico qualificado.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;
