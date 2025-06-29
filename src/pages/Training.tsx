
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import FileUpload from '@/components/FileUpload';

const Training = () => {
  const [modelName, setModelName] = useState('');
  const [trainingFiles, setTrainingFiles] = useState<File[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  // Dados simulados para teste
  const models = [
    {
      id: 1,
      name: 'CancerDetect v1.0',
      accuracy: 94.2,
      trained_on: '2024-01-15',
      samples: 1000,
      status: 'active'
    },
    {
      id: 2,
      name: 'CancerDetect v0.9',
      accuracy: 91.8,
      trained_on: '2024-01-10',
      samples: 800,
      status: 'archived'
    }
  ];
  const loading = false;

  const handleFilesSelected = (files: File[]) => {
    setTrainingFiles(prev => [...prev, ...files]);
    console.log('Arquivos selecionados para treinamento:', files);
  };

  const handleStartTraining = async () => {
    if (!modelName || trainingFiles.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome do modelo e adicione arquivos de treinamento.",
        variant: "destructive"
      });
      return;
    }

    setIsTraining(true);
    setTrainingProgress(0);

    // Simular treinamento
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTrainingProgress(i);
    }

    setIsTraining(false);
    toast({
      title: "Treinamento Concluído! 🎉",
      description: `Modelo "${modelName}" treinado com sucesso.`
    });
    
    setModelName('');
    setTrainingFiles([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'training': return 'bg-blue-100 text-blue-700';
      case 'archived': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'training': return 'Treinando';
      case 'archived': return 'Arquivado';
      default: return 'Desconhecido';
    }
  };

  const getFileTypeCounts = () => {
    const images = trainingFiles.filter(file => file.type.startsWith('image/')).length;
    const yamls = trainingFiles.filter(file => 
      file.name.endsWith('.yaml') || file.name.endsWith('.yml')
    ).length;
    return { images, yamls };
  };

  const { images, yamls } = getFileTypeCounts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Treinamento de Modelos IA
        </h1>
        <p className="text-gray-600">Configure e treine modelos de detecção de câncer</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Training Form */}
        <div className="lg:col-span-2">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🧠</span>
                <span>Novo Modelo de Treinamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="modelName">Nome do Modelo</Label>
                <Input
                  id="modelName"
                  placeholder="Ex: CancerDetect v2.0"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="transition-all duration-300 focus:scale-105"
                />
              </div>

              <FileUpload
                onFilesSelected={handleFilesSelected}
                title="Dataset de Treinamento"
                description="Adicione imagens categorizadas e arquivos de configuração (incluindo data.yaml)"
                multiple={true}
                acceptYaml={true}
              />

              {trainingFiles.length > 0 && (
                <div className="medical-gradient-soft p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Resumo do Dataset:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Imagens:</span>
                      <span className="font-medium ml-2">{images}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Arquivos YAML:</span>
                      <span className="font-medium ml-2">{yamls}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium ml-2">{trainingFiles.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Tamanho:</span>
                      <span className="font-medium ml-2">
                        {(trainingFiles.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                  {yamls > 0 && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                      <p className="text-sm text-blue-700">
                        📝 Arquivos YAML detectados (incluindo data.yaml) - serão usados para configuração do treinamento
                      </p>
                    </div>
                  )}
                </div>
              )}

              {isTraining && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Progresso do Treinamento</span>
                    <span className="text-sm text-gray-500">{Math.round(trainingProgress)}%</span>
                  </div>
                  <Progress value={trainingProgress} className="h-3" />
                  <p className="text-sm text-gray-600 text-center">
                    Treinando modelo... Este processo pode levar alguns minutos.
                  </p>
                </div>
              )}

              <Button
                onClick={handleStartTraining}
                disabled={isTraining || !modelName || trainingFiles.length === 0}
                className="w-full medical-gradient text-white hover-lift shadow-lg disabled:opacity-50"
              >
                {isTraining ? 'Treinando...' : 'Iniciar Treinamento'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Model History */}
        <div className="lg:col-span-1">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📚</span>
                <span>Modelos Existentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-center text-gray-500">Carregando modelos...</div>
              ) : models.length === 0 ? (
                <div className="text-center text-gray-500">Nenhum modelo encontrado</div>
              ) : (
                models.map((model) => (
                  <div key={model.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{model.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(model.status)}`}>
                        {getStatusText(model.status)}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Precisão:</span>
                        <span className="font-medium">{model.accuracy.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amostras:</span>
                        <span>{model.samples}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Treinado em:</span>
                        <span>{model.trained_on}</span>
                      </div>
                    </div>
                    {model.status !== 'active' && model.status !== 'training' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2"
                        onClick={() => {
                          toast({
                            title: "Modelo Ativado",
                            description: `${model.name} agora está ativo.`
                          });
                        }}
                      >
                        Ativar Modelo
                      </Button>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Training;
