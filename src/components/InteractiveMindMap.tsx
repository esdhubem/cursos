import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Layers,
  FileDown
} from 'lucide-react';

export interface MindMapNode {
  id: string;
  parentId: string | null;
  text: string;
  color: string;
  timestamp?: string; // Ex: '04:15'
}

interface InteractiveMindMapProps {
  courseId: string;
  lessonIndex: number;
  lessonTitle: string;
}

const COLOR_PALETTE = [
  { name: 'Azul Marinho', bg: 'bg-[#243042]', text: 'text-white', border: 'border-[#243042]', badge: '#243042' },
  { name: 'Ouro / Âmbar', bg: 'bg-amber-500', text: 'text-slate-900', border: 'border-amber-400', badge: '#f59e0b' },
  { name: 'Esmeralda', bg: 'bg-emerald-600', text: 'text-white', border: 'border-emerald-600', badge: '#059669' },
  { name: 'Índigo', bg: 'bg-indigo-600', text: 'text-white', border: 'border-indigo-600', badge: '#4f46e5' },
  { name: 'Rosa Suave', bg: 'bg-rose-500', text: 'text-white', border: 'border-rose-500', badge: '#f43f5e' },
  { name: 'Ardósia', bg: 'bg-slate-700', text: 'text-white', border: 'border-slate-600', badge: '#475569' }
];

export const InteractiveMindMap: React.FC<InteractiveMindMapProps> = ({
  courseId,
  lessonIndex,
  lessonTitle
}) => {
  const storageKey = `esdhubem_mindmap_${courseId}_lesson_${lessonIndex}`;

  const getDefaultNodes = (): MindMapNode[] => [
    {
      id: 'root',
      parentId: null,
      text: lessonTitle || 'Conceito Central da Aula',
      color: '#243042'
    },
    {
      id: 'node-1',
      parentId: 'root',
      text: 'Ideia Principal / Definição',
      color: '#4f46e5',
      timestamp: '01:20'
    },
    {
      id: 'node-2',
      parentId: 'root',
      text: 'Ferramenta ou Metodologia Prática',
      color: '#059669',
      timestamp: '05:45'
    },
    {
      id: 'node-3',
      parentId: 'root',
      text: 'Aplicação no Dia a Dia',
      color: '#f59e0b',
      timestamp: '11:10'
    }
  ];

  const [nodes, setNodes] = useState<MindMapNode[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Erro ao carregar mapa mental:', e);
    }
    return getDefaultNodes();
  });

  const [selectedParentId, setSelectedParentId] = useState<string>('root');
  const [newSubtopicText, setNewSubtopicText] = useState('');
  const [newTimestamp, setNewTimestamp] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[1].badge);
  const [savedNotification, setSavedNotification] = useState(false);

  // Recarregar nós se mudar de aula
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setNodes(JSON.parse(saved));
      } else {
        setNodes(getDefaultNodes());
      }
    } catch {
      setNodes(getDefaultNodes());
    }
    setSelectedParentId('root');
  }, [courseId, lessonIndex, lessonTitle]);

  // Salvar no localStorage sempre que os nós mudarem
  const saveToStorage = (updatedNodes: MindMapNode[]) => {
    setNodes(updatedNodes);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedNodes));
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 2000);
    } catch (e) {
      console.error('Erro ao salvar mapa mental:', e);
    }
  };

  const handleAddNode = () => {
    if (!newSubtopicText.trim()) return;

    const newNode: MindMapNode = {
      id: `node-${Date.now()}`,
      parentId: selectedParentId,
      text: newSubtopicText.trim(),
      color: selectedColor,
      timestamp: newTimestamp.trim() || undefined
    };

    saveToStorage([...nodes, newNode]);
    setNewSubtopicText('');
    setNewTimestamp('');
  };

  const handleUpdateText = (id: string, text: string) => {
    const updated = nodes.map((n) => (n.id === id ? { ...n, text } : n));
    saveToStorage(updated);
  };

  const handleDeleteNode = (id: string) => {
    if (id === 'root') {
      alert('O conceito central não pode ser excluído.');
      return;
    }
    // Remove o nó e recursivamente os filhos
    const idsToRemove = new Set<string>([id]);
    let changed = true;
    while (changed) {
      changed = false;
      nodes.forEach((n) => {
        if (n.parentId && idsToRemove.has(n.parentId) && !idsToRemove.has(n.id)) {
          idsToRemove.add(n.id);
          changed = true;
        }
      });
    }

    const updated = nodes.filter((n) => !idsToRemove.has(n.id));
    saveToStorage(updated);
    if (idsToRemove.has(selectedParentId)) {
      setSelectedParentId('root');
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Deseja restaurar o mapa mental inicial para esta aula? Suas anotações neste mapa serão reiniciadas.')) {
      const defaults = getDefaultNodes();
      saveToStorage(defaults);
      setSelectedParentId('root');
    }
  };

  const handleExportText = () => {
    const root = nodes.find((n) => n.parentId === null);
    if (!root) return;

    let output = `🧠 MAPA MENTAL - ESDHUBEM\nAula: ${lessonTitle}\n\n`;

    const printTree = (parentId: string, depth: number) => {
      const children = nodes.filter((n) => n.parentId === parentId);
      children.forEach((c) => {
        const indent = '  '.repeat(depth);
        const time = c.timestamp ? ` [Minuto: ${c.timestamp}]` : '';
        output += `${indent}• ${c.text}${time}\n`;
        printTree(c.id, depth + 1);
      });
    };

    output += `[CONCEITO CENTRAL]: ${root.text}\n\n`;
    printTree('root', 1);

    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mapa_Mental_Aula_${lessonIndex + 1}_ESDHUBEM.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const rootNode = nodes.find((n) => n.parentId === null);
  const getChildren = (parentId: string) => nodes.filter((n) => n.parentId === parentId);

  return (
    <div className="pt-3 space-y-5">
      {/* Top Banner do Mapa */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 to-[#1e293b] p-4 rounded-xl text-white border border-slate-700/60 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-sm">Mapa Mental Ativo da Aula</h4>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Preencha ramos e palavras-chave enquanto escuta o áudio/vídeo. Salvo automaticamente no seu dispositivo.
          </p>
        </div>

        {/* Ações do cabeçalho */}
        <div className="flex items-center gap-2">
          {savedNotification && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-md border border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" /> Salvo
            </span>
          )}

          <button
            onClick={handleExportText}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-white/10"
            title="Baixar resumo do mapa mental em arquivo de texto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar TXT</span>
          </button>

          <button
            onClick={handleResetToDefault}
            className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Restaurar padrão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Caixa de Entrada Rápida de Novos Ramos */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            Adicionar Novo Tópico / Ramo ao Mapa:
          </label>
          <span className="text-[11px] text-slate-500 font-medium">
            Conectar em: <strong className="text-slate-800">
              {nodes.find((n) => n.id === selectedParentId)?.text.slice(0, 30) || 'Conceito Central'}
            </strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          {/* Seletor de pai */}
          <div className="sm:col-span-3">
            <select
              value={selectedParentId}
              onChange={(e) => setSelectedParentId(e.target.value)}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.parentId === null ? '⭐ (Centro) ' : '↳ '}
                  {node.text.slice(0, 24)}...
                </option>
              ))}
            </select>
          </div>

          {/* Texto do tópico */}
          <div className="sm:col-span-5">
            <input
              type="text"
              value={newSubtopicText}
              onChange={(e) => setNewSubtopicText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddNode()}
              placeholder="Digite o conceito ou insight da aula..."
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#243042]"
            />
          </div>

          {/* Timestamp do vídeo */}
          <div className="sm:col-span-2">
            <input
              type="text"
              value={newTimestamp}
              onChange={(e) => setNewTimestamp(e.target.value)}
              placeholder="Ex: 08:30"
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600 font-mono text-center"
              title="Minuto do vídeo em que o professor falou disso"
            />
          </div>

          {/* Botão de adicionar */}
          <div className="sm:col-span-2 flex items-center gap-2">
            <button
              onClick={handleAddNode}
              className="w-full bg-[#243042] hover:bg-[#182333] text-[#FFC72C] font-bold text-xs py-2.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Inserir</span>
            </button>
          </div>
        </div>

        {/* Escolha rápida de cor do nó */}
        <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
          <span>Cor do ramo:</span>
          <div className="flex items-center gap-1.5">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setSelectedColor(c.badge)}
                className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                  selectedColor === c.badge ? 'scale-125 ring-2 ring-offset-1 ring-slate-400' : 'opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.badge }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ÁREA VISUAL DO MAPA MENTAL (ÁRVORE DINÂMICA / NÓS INTERATIVOS) */}
      <div className="bg-gradient-to-b from-slate-50/70 to-white rounded-2xl border-2 border-dashed border-slate-300 p-5 sm:p-7 min-h-[360px] overflow-x-auto">
        {rootNode && (
          <div className="flex flex-col items-center">
            {/* NÓ CENTRAL / ROOT */}
            <div className="relative group mb-8">
              <div
                className="px-6 py-4 rounded-2xl shadow-md text-white font-black text-sm sm:text-base border-2 border-slate-800 text-center max-w-md cursor-pointer transition-all hover:scale-105"
                style={{ backgroundColor: rootNode.color }}
                onClick={() => setSelectedParentId(rootNode.id)}
              >
                <div className="text-[10px] uppercase font-bold text-amber-300 tracking-wider mb-1 flex items-center justify-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5" /> NÓ CENTRAL DA AULA
                </div>
                <input
                  type="text"
                  value={rootNode.text}
                  onChange={(e) => handleUpdateText(rootNode.id, e.target.value)}
                  className="bg-transparent text-center font-black w-full focus:outline-none focus:bg-white/10 rounded px-1 text-white"
                />
              </div>

              {/* Indicador de Seleção Ativa */}
              {selectedParentId === rootNode.id && (
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                  Ramo ativo selecionado
                </div>
              )}
            </div>

            {/* RAMIFICAÇÕES DE NÍVEL 1 (E SEUS SUB-RAMOS) */}
            <div className="w-full flex flex-wrap justify-center gap-6 sm:gap-8 pt-2">
              {getChildren(rootNode.id).map((branch) => {
                const subBranches = getChildren(branch.id);
                const isSelected = selectedParentId === branch.id;

                return (
                  <div
                    key={branch.id}
                    className="flex-1 min-w-[240px] max-w-[320px] flex flex-col items-center relative"
                  >
                    {/* Linha vertical conectora superior */}
                    <div className="w-0.5 h-6 bg-slate-300 mb-1"></div>

                    {/* Cartão do Ramo Nível 1 */}
                    <div
                      className={`w-full p-3.5 rounded-xl border-2 transition-all shadow-sm relative group ${
                        isSelected
                          ? 'ring-2 ring-offset-2 ring-blue-600 border-blue-500 bg-white'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: branch.color }}
                          />
                          {branch.timestamp && (
                            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                              ⏱ {branch.timestamp}
                            </span>
                          )}
                        </div>

                        {/* Ações rápidas */}
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setSelectedParentId(branch.id)}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded cursor-pointer"
                            title="Adicionar sub-ideia a este nó"
                          >
                            + Sub-ramo
                          </button>
                          <button
                            onClick={() => handleDeleteNode(branch.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                            title="Excluir este tópico"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Texto editável */}
                      <textarea
                        value={branch.text}
                        onChange={(e) => handleUpdateText(branch.id, e.target.value)}
                        rows={2}
                        className="w-full text-xs font-semibold text-slate-800 bg-transparent resize-none focus:outline-none focus:bg-slate-50 rounded p-1 border border-transparent focus:border-slate-300"
                      />
                    </div>

                    {/* Sub-Ramos Conectados (Nível 2) */}
                    {subBranches.length > 0 && (
                      <div className="w-full pl-6 border-l-2 border-slate-200 mt-3 space-y-2.5">
                        {subBranches.map((sub) => (
                          <div
                            key={sub.id}
                            className="p-2.5 bg-slate-50 hover:bg-white rounded-lg border border-slate-200 text-xs shadow-2xs relative group transition-all"
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: sub.color }}
                                />
                                {sub.timestamp && (
                                  <span className="text-[9px] font-mono text-slate-500 font-bold">
                                    {sub.timestamp}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => handleDeleteNode(sub.id)}
                                className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer opacity-60 group-hover:opacity-100"
                                title="Excluir sub-tópico"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            </div>

                            <input
                              type="text"
                              value={sub.text}
                              onChange={(e) => handleUpdateText(sub.id, e.target.value)}
                              className="w-full bg-transparent font-medium text-slate-700 text-xs focus:outline-none focus:bg-white rounded px-1"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Rodapé explicativo */}
        <div className="mt-8 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Dica: Você pode clicar diretamente em qualquer texto acima para editar e personalizar seus insights.
            </span>
          </div>
          <span className="font-semibold text-slate-600">
            Total de nós ativos: {nodes.length}
          </span>
        </div>
      </div>
    </div>
  );
};
