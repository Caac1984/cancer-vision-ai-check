
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, FileText, Image } from 'lucide-react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  title?: string;
  description?: string;
  acceptYaml?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  accept = 'image/*',
  multiple = true,
  className = '',
  title = 'Upload de Imagens',
  description = 'Arraste suas imagens aqui ou clique para selecionar',
  acceptYaml = false
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const acceptConfig = acceptYaml 
    ? {
        'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp'],
        'application/x-yaml': ['.yaml', '.yml'],
        'text/yaml': ['.yaml', '.yml']
      }
    : {
        'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.bmp']
      };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptConfig,
    multiple
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
      return <FileText className="w-5 h-5 text-blue-600" />;
    }
    return <Image className="w-5 h-5 text-blue-600" />;
  };

  const getFileTypeLabel = (file: File) => {
    if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
      return 'YAML';
    }
    return 'Imagem';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card 
        {...getRootProps()} 
        className={`p-8 border-2 border-dashed cursor-pointer transition-all duration-300 hover-lift ${
          isDragActive 
            ? 'border-blue-500 medical-gradient-soft' 
            : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto medical-gradient rounded-full flex items-center justify-center animate-float">
            <Check className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            <p className="text-gray-500 mt-1">{description}</p>
            {acceptYaml && (
              <p className="text-sm text-gray-400 mt-1">
                Aceita imagens (.png, .jpg, .jpeg, .webp, .bmp) e arquivos YAML (.yaml, .yml)
              </p>
            )}
          </div>
          <Button variant="outline" className="hover-lift">
            Selecionar Arquivos
          </Button>
        </div>
      </Card>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Arquivos Selecionados:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {uploadedFiles.map((file, index) => (
              <Card key={index} className="p-3 flex items-center justify-between hover-lift">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    {getFileIcon(file)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 truncate max-w-40">
                      {file.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{getFileTypeLabel(file)}</span>
                      <span>•</span>
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  ✕
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
