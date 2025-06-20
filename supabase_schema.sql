
-- Tabela para armazenar modelos de IA
CREATE TABLE IF NOT EXISTS models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  accuracy DECIMAL(5,2) DEFAULT 0,
  trained_on VARCHAR NOT NULL,
  samples INTEGER DEFAULT 0,
  status VARCHAR CHECK (status IN ('active', 'archived', 'training')) DEFAULT 'training',
  file_path VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para sessões de treinamento
CREATE TABLE IF NOT EXISTS training_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID REFERENCES models(id) ON DELETE CASCADE,
  status VARCHAR CHECK (status IN ('pending', 'training', 'completed', 'failed')) DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para resultados de diagnóstico
CREATE TABLE IF NOT EXISTS diagnosis_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID REFERENCES models(id),
  filename VARCHAR NOT NULL,
  prediction VARCHAR CHECK (prediction IN ('Benigno', 'Maligno', 'Suspeito')) NOT NULL,
  confidence DECIMAL(5,2) NOT NULL,
  benign_probability DECIMAL(5,2) NOT NULL,
  malignant_probability DECIMAL(5,2) NOT NULL,
  suspicious_probability DECIMAL(5,2) NOT NULL,
  image_path VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_models_status ON models(status);
CREATE INDEX IF NOT EXISTS idx_training_sessions_model_id ON training_sessions(model_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_results_model_id ON diagnosis_results(model_id);

-- Política RLS (Row Level Security) - opcional
-- ALTER TABLE models ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE diagnosis_results ENABLE ROW LEVEL SECURITY;
