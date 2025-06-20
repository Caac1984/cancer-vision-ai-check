
import { useState, useEffect } from 'react'
import { supabase, type Model } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useModels = () => {
  const [models, setModels] = useState<Model[]>([])
  const [activeModel, setActiveModel] = useState<Model | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      setModels(data || [])
      
      // Define o modelo ativo (primeiro com status 'active')
      const active = data?.find(model => model.status === 'active')
      setActiveModel(active || null)
    } catch (error) {
      console.error('Erro ao buscar modelos:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os modelos.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const createModel = async (modelData: Omit<Model, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('models')
        .insert([{
          ...modelData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      setModels(prev => [data, ...prev])
      
      toast({
        title: "Modelo Criado! 🎉",
        description: `Modelo "${modelData.name}" foi criado com sucesso.`
      })

      return data
    } catch (error) {
      console.error('Erro ao criar modelo:', error)
      toast({
        title: "Erro",
        description: "Não foi possível criar o modelo.",
        variant: "destructive"
      })
      throw error
    }
  }

  const updateModelStatus = async (modelId: string, status: Model['status']) => {
    try {
      const { error } = await supabase
        .from('models')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', modelId)

      if (error) throw error

      setModels(prev => 
        prev.map(model => 
          model.id === modelId 
            ? { ...model, status, updated_at: new Date().toISOString() }
            : model
        )
      )

      // Se definindo como ativo, remover status ativo de outros modelos
      if (status === 'active') {
        await supabase
          .from('models')
          .update({ status: 'archived' })
          .neq('id', modelId)
          .eq('status', 'active')
        
        fetchModels() // Recarregar para refletir mudanças
      }

    } catch (error) {
      console.error('Erro ao atualizar status do modelo:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o modelo.",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    fetchModels()
  }, [])

  return {
    models,
    activeModel,
    loading,
    createModel,
    updateModelStatus,
    refetchModels: fetchModels
  }
}
