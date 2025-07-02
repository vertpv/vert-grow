import React, { useState } from 'react';
import { 
  Beaker, 
  Droplets, 
  Calculator, 
  Info, 
  AlertTriangle,
  CheckCircle,
  Copy,
  Download
} from 'lucide-react';

const NutricaoMineral = () => {
  const [calculadora, setCalculadora] = useState({
    volumeAgua: 1000, // ml
    concentracao: 100, // %
    resultados: null
  });

  const [activeTab, setActiveTab] = useState('receita');

  // Receita base concentrada (para 1L de solução concentrada)
  const receitaConcentrada = {
    titulo: "Receita Concentrada - Nutrição Mineral Completa",
    descricao: "Solução nutritiva concentrada para todas as fases do cultivo",
    ingredientes: [
      {
        nome: "Nitrato de Cálcio",
        formula: "Ca(NO₃)₂·4H₂O",
        quantidade: 236,
        unidade: "g",
        funcao: "Fonte de Cálcio e Nitrogênio",
        cor: "branco",
        observacao: "Dissolver separadamente"
      },
      {
        nome: "Sulfato de Magnésio",
        formula: "MgSO₄·7H₂O",
        quantidade: 123,
        unidade: "g",
        funcao: "Fonte de Magnésio e Enxofre",
        cor: "branco cristalino",
        observacao: "Sal de Epsom"
      },
      {
        nome: "Fosfato Monopotássico",
        formula: "KH₂PO₄",
        quantidade: 68,
        unidade: "g",
        funcao: "Fonte de Fósforo e Potássio",
        cor: "branco",
        observacao: "MKP - Essencial para floração"
      },
      {
        nome: "Nitrato de Potássio",
        formula: "KNO₃",
        quantidade: 101,
        unidade: "g",
        funcao: "Fonte de Potássio e Nitrogênio",
        cor: "branco cristalino",
        observacao: "Salitre do Chile"
      },
      {
        nome: "Quelato de Ferro",
        formula: "Fe-EDTA",
        quantidade: 7.5,
        unidade: "g",
        funcao: "Fonte de Ferro quelado",
        cor: "amarelo/laranja",
        observacao: "Micronutriente essencial"
      },
      {
        nome: "Mix de Micronutrientes",
        formula: "Mn, Zn, Cu, B, Mo",
        quantidade: 2.5,
        unidade: "g",
        funcao: "Micronutrientes completos",
        cor: "variado",
        observacao: "Boro, Manganês, Zinco, Cobre, Molibdênio"
      }
    ],
    preparo: [
      "Aqueça 800ml de água destilada a 40-50°C",
      "Dissolva o Nitrato de Cálcio separadamente em 200ml de água",
      "Em outro recipiente, dissolva os demais sais em 600ml de água",
      "Misture as duas soluções lentamente",
      "Complete o volume para 1000ml com água destilada",
      "Ajuste o pH para 5.5-6.5 com ácido fosfórico",
      "Armazene em recipiente escuro e refrigerado"
    ],
    validade: "30 dias refrigerado",
    rendimento: "1000ml de solução concentrada"
  };

  const fasesCultivo = [
    {
      fase: "Germinação",
      concentracao: "10-25%",
      ec: "0.4-0.8",
      ph: "5.8-6.2",
      frequencia: "A cada 2-3 dias",
      observacoes: "Concentração muito baixa, foco em enraizamento"
    },
    {
      fase: "Vegetativa",
      concentracao: "50-75%",
      ec: "1.2-1.8",
      ph: "5.5-6.0",
      frequencia: "Diariamente",
      observacoes: "Aumento gradual da concentração, foco em nitrogênio"
    },
    {
      fase: "Pré-floração",
      concentracao: "75-100%",
      ec: "1.6-2.2",
      ph: "5.5-6.0",
      frequencia: "Diariamente",
      observacoes: "Concentração máxima, preparação para floração"
    },
    {
      fase: "Floração",
      concentracao: "100%",
      ec: "1.8-2.4",
      ph: "5.5-6.0",
      frequencia: "Diariamente",
      observacoes: "Concentração total, foco em fósforo e potássio"
    },
    {
      fase: "Maturação",
      concentracao: "25-50%",
      ec: "0.8-1.4",
      ph: "5.8-6.2",
      frequencia: "A cada 2 dias",
      observacoes: "Redução gradual, flush final com água"
    }
  ];

  const calcularDiluicao = () => {
    const { volumeAgua, concentracao } = calculadora;
    
    const volumeConcentrado = (volumeAgua * concentracao) / 100;
    const volumeAguaAdicional = volumeAgua - volumeConcentrado;
    
    const resultados = {
      volumeConcentrado: volumeConcentrado.toFixed(1),
      volumeAguaAdicional: volumeAguaAdicional.toFixed(1),
      volumeTotal: volumeAgua,
      concentracaoFinal: concentracao,
      ecEstimado: (concentracao * 0.024).toFixed(1), // Estimativa baseada na receita
      phRecomendado: "5.5-6.0"
    };
    
    setCalculadora(prev => ({ ...prev, resultados }));
  };

  const copiarReceita = () => {
    const texto = `
RECEITA CONCENTRADA - NUTRIÇÃO MINERAL

Ingredientes (para 1L):
${receitaConcentrada.ingredientes.map(ing => 
  `• ${ing.nome} (${ing.formula}): ${ing.quantidade}${ing.unidade} - ${ing.funcao}`
).join('\n')}

Preparo:
${receitaConcentrada.preparo.map((passo, i) => `${i + 1}. ${passo}`).join('\n')}

Validade: ${receitaConcentrada.validade}
    `.trim();
    
    navigator.clipboard.writeText(texto);
    alert('Receita copiada para a área de transferência!');
  };

  const exportarPDF = () => {
    // Implementação futura para exportar PDF
    alert('Funcionalidade de exportação PDF será implementada em breve!');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Beaker size={28} color="var(--primary)" />
          Nutrição Mineral
        </h1>
        <p className="text-muted-foreground">
          Receita concentrada e guia completo de nutrição mineral para cultivo hidropônico
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6" style={{ borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'receita', label: 'Receita Concentrada', icon: Beaker },
          { id: 'fases', label: 'Fases do Cultivo', icon: Info },
          { id: 'calculadora', label: 'Calculadora', icon: Calculator }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`btn ${activeTab === tab.id ? 'btn-secondary' : 'btn-ghost'} gap-2`}
              onClick={() => setActiveTab(tab.id)}
              style={{ borderRadius: '8px 8px 0 0' }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'receita' && (
        <div className="grid gap-6">
          {/* Header da Receita */}
          <div className="card card-elevated">
            <div className="card-header">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-lg">{receitaConcentrada.titulo}</h2>
                  <p className="text-muted-foreground mt-1">{receitaConcentrada.descricao}</p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-outline btn-sm gap-2" onClick={copiarReceita}>
                    <Copy size={16} />
                    Copiar
                  </button>
                  <button className="btn btn-outline btn-sm gap-2" onClick={exportarPDF}>
                    <Download size={16} />
                    PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Grid para Ingredientes */}
          <div 
            className="grid gap-4"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gridAutoRows: 'minmax(120px, auto)'
            }}
          >
            {receitaConcentrada.ingredientes.map((ingrediente, index) => (
              <div 
                key={index} 
                className="card hover:shadow-md transition-shadow"
                style={index === 0 ? { gridColumn: 'span 2' } : {}}
              >
                <div className="card-content">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{ingrediente.nome}</h3>
                      <p className="text-sm text-muted-foreground">{ingrediente.formula}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {ingrediente.quantidade}{ingrediente.unidade}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{ingrediente.funcao}</p>
                  {ingrediente.observacao && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Info size={12} />
                      {ingrediente.observacao}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Preparo */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold flex items-center gap-2">
                <Droplets size={20} />
                Modo de Preparo
              </h3>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                {receitaConcentrada.preparo.map((passo, index) => (
                  <div key={index} className="flex gap-3">
                    <div 
                      className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium"
                    >
                      {index + 1}
                    </div>
                    <p className="flex-1">{passo}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-secondary rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} color="var(--warning)" />
                  <span className="font-medium">Informações Importantes</span>
                </div>
                <div className="text-sm space-y-1">
                  <p><strong>Rendimento:</strong> {receitaConcentrada.rendimento}</p>
                  <p><strong>Validade:</strong> {receitaConcentrada.validade}</p>
                  <p><strong>Armazenamento:</strong> Local escuro e refrigerado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fases' && (
        <div className="grid gap-4">
          {fasesCultivo.map((fase, index) => (
            <div key={index} className="card">
              <div className="card-content">
                <div className="grid md:grid-cols-6 gap-4 items-center">
                  <div>
                    <h3 className="font-semibold">{fase.fase}</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Concentração</div>
                    <div className="font-medium">{fase.concentracao}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">EC</div>
                    <div className="font-medium">{fase.ec}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">pH</div>
                    <div className="font-medium">{fase.ph}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Frequência</div>
                    <div className="font-medium">{fase.frequencia}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{fase.observacoes}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'calculadora' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold">Calculadora de Diluição</h3>
            </div>
            <div className="card-content space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Volume de água (ml)
                </label>
                <input
                  type="number"
                  className="input"
                  value={calculadora.volumeAgua}
                  onChange={(e) => setCalculadora(prev => ({
                    ...prev,
                    volumeAgua: parseInt(e.target.value) || 0
                  }))}
                  min="100"
                  max="10000"
                  step="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Concentração desejada (%)
                </label>
                <input
                  type="number"
                  className="input"
                  value={calculadora.concentracao}
                  onChange={(e) => setCalculadora(prev => ({
                    ...prev,
                    concentracao: parseInt(e.target.value) || 0
                  }))}
                  min="10"
                  max="100"
                  step="5"
                />
              </div>
              
              <button
                className="btn btn-primary w-full gap-2"
                onClick={calcularDiluicao}
              >
                <Calculator size={16} />
                Calcular Diluição
              </button>
            </div>
          </div>

          {/* Resultados */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold">Resultados</h3>
            </div>
            <div className="card-content">
              {calculadora.resultados ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-secondary rounded-lg">
                      <div className="text-lg font-bold text-primary">
                        {calculadora.resultados.volumeConcentrado}ml
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Solução concentrada
                      </div>
                    </div>
                    <div className="text-center p-3 bg-secondary rounded-lg">
                      <div className="text-lg font-bold text-accent">
                        {calculadora.resultados.volumeAguaAdicional}ml
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Água adicional
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Volume total:</span>
                      <span className="font-medium">{calculadora.resultados.volumeTotal}ml</span>
                    </div>
                    <div className="flex justify-between">
                      <span>EC estimado:</span>
                      <span className="font-medium">{calculadora.resultados.ecEstimado}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>pH recomendado:</span>
                      <span className="font-medium">{calculadora.resultados.phRecomendado}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg">
                    <CheckCircle size={16} color="var(--success)" />
                    <span className="text-sm">Cálculo realizado com sucesso!</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Calculator size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Insira os valores e clique em calcular</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutricaoMineral;

