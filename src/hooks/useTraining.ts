
import { useState } from 'react'
import { supabase, type TrainingSession } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { useModels } from './useModels'

export const useTraining = () => {
  const [isTraining, setIsTraining] = useState(false)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const { createModel, updateModelStatus } = useModels()
  const { toast } = useToast()

  const startTraining = async (modelName: string, trainingFiles: File[]) => {
    if (!modelName || trainingFiles.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, defina um nome para o modelo e selecione arquivos de treinamento.",
        variant: "destructive"
      })
      return
    }

    setIsTraining(true)
    setTrainingProgress(0)

    try {
      // Criar o modelo no banco
      const newModel = await createModel({
        name: modelName,
        accuracy: 0,
        trained_on: new Date().toLocaleDateString('pt-BR'),
        samples: trainingFiles.length,
        status: 'training'
      })

      // Simular processo de treinamento
      const progressInterval = setInterval(async () => {
        setTrainingProgress(prev => {
          const newProgress = prev + Math.random() * 15
          
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            setIsTraining(false)
            
            // Atualizar modelo com resultados do treinamento
            const finalAccuracy = Math.random() * 10 + 85 // 85-95%
            
            supabase
              .from('models')
              .update({ 
                accuracy: parseFloat(finalAccuracy.toFixed(1)),
                status: 'active',
                updated_at: new Date().toISOString()
              })
              .eq('id', newModel.id)

            toast({
              title: "Treinamento Concluído! 🎉",
              description: `Modelo "${modelName}" foi treinado com sucesso.`
            })
            
            return 100
          }
          
          return newProgress
        })
      }, 500)

      console.log('Iniciando treinamento do modelo:', modelName)
      console.log('Arquivos de treinamento:', trainingFiles)

    } catch (error) {
      setIsTraining(false)
      setTrainingProgress(0)
      console.error('Erro no treinamento:', error)
    }
  }

  return {
    isTraining,
    trainingProgress,
    startTraining
  }
}
