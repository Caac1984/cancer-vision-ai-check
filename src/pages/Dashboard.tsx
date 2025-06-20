
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    {
      title: 'Modelos Treinados',
      value: '3',
      change: '+1 este mês',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Imagens Analisadas',
      value: '1,247',
      change: '+89 hoje',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'Precisão Média',
      value: '94.2%',
      change: '+2.1% vs anterior',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Casos Detectados',
      value: '127',
      change: '18 este mês',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const recentAnalyses = [
    { id: 1, filename: 'scan_001.jpg', result: 'Benigno', confidence: '96.8%', date: '2024-01-15 14:30' },
    { id: 2, filename: 'scan_002.jpg', result: 'Suspeito', confidence: '87.2%', date: '2024-01-15 14:25' },
    { id: 3, filename: 'scan_003.jpg', result: 'Benigno', confidence: '94.1%', date: '2024-01-15 14:20' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Dashboard de Diagnóstico
        </h1>
        <p className="text-gray-600">Monitore o desempenho e resultados do sistema de IA</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="hover-lift transition-all duration-300 medical-gradient-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-emerald-600">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center animate-pulse-medical`}>
                  <div className="w-6 h-6 bg-white/20 rounded backdrop-blur"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>🚀</span>
                <span>Ações Rápidas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/training">
                <Button className="w-full medical-gradient text-white hover-lift shadow-lg">
                  <span className="mr-2">🧠</span>
                  Treinar Novo Modelo
                </Button>
              </Link>
              <Link to="/diagnosis">
                <Button variant="outline" className="w-full hover-lift">
                  <span className="mr-2">🔬</span>
                  Analisar Imagem
                </Button>
              </Link>
              <Button variant="outline" className="w-full hover-lift">
                <span className="mr-2">📊</span>
                Ver Relatórios
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Analyses */}
        <div className="lg:col-span-2">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📋</span>
                <span>Análises Recentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{analysis.id}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{analysis.filename}</p>
                        <p className="text-sm text-gray-500">{analysis.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${analysis.result === 'Benigno' ? 'text-emerald-600' : 'text-orange-600'}`}>
                        {analysis.result}
                      </p>
                      <p className="text-sm text-gray-500">{analysis.confidence}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
