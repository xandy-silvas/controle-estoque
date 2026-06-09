import React, { useState } from "react";
import { Settings, Plus, Trash2, MapPin, Layers, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { HistoryLog, DiscardLog, AssetDelivery } from "../types";
import { HistoryLogs } from "./HistoryLogs";
import { DiscardsList } from "./DiscardsList";

interface AdminPanelProps {
  sectors: string[];
  categories: string[];
  onAddSector: (sector: string) => void;
  onDeleteSector: (sector: string) => void;
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
  history: HistoryLog[];
  discards: DiscardLog[];
  // New: allow admin panel to list current deliveries and request a discard action
  deliveries?: AssetDelivery[];
  onSelectForDiscard?: (delivery: AssetDelivery) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  sectors,
  categories,
  onAddSector,
  onDeleteSector,
  onAddCategory,
  onDeleteCategory,
  history,
  discards,
  deliveries,
  onSelectForDiscard,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"sectors" | "categories" | "history" | "discards">("sectors");
  
  // Form states
  const [newSector, setNewSector] = useState("");
  const [newCategory, setNewCategory] = useState("");
  
  // Feedback states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    if (type === "success") {
      setSuccess(message);
      setError(null);
    } else {
      setError(message);
      setSuccess(null);
    }
    setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 4000);
  };

  const handleAddSectorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sectorName = newSector.trim();
    
    if (!sectorName) {
      showNotification("error", "O nome do setor não pode estar vazio.");
      return;
    }

    if (sectors.some((s) => s.toLowerCase() === sectorName.toLowerCase())) {
      showNotification("error", `O setor "${sectorName}" já existe.`);
      return;
    }

    onAddSector(sectorName);
    showNotification("success", `Setor "${sectorName}" criado com sucesso!`);
    setNewSector("");
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryName = newCategory.trim();

    if (!categoryName) {
      showNotification("error", "O nome da categoria não pode estar vazio.");
      return;
    }

    if (categories.some((c) => c.toLowerCase() === categoryName.toLowerCase())) {
      showNotification("error", `A categoria "${categoryName}" já existe.`);
      return;
    }

    onAddCategory(categoryName);
    showNotification("success", `Categoria "${categoryName}" criada com sucesso!`);
    setNewCategory("");
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="border-b border-zinc-150 pb-5">
        <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2 tracking-tight">
          <Settings className="h-4 w-4 text-zinc-950" />
          Painel Administrativo da TI
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          Cadastre e gerencie as informações básicas de Setores e Categorias utilizadas nas entregas de equipamentos
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-1.5 my-5 bg-zinc-100 p-1 rounded-lg border border-zinc-200/50 self-start">
        <button
          onClick={() => {
            setActiveSubTab("sectors");
            setError(null);
            setSuccess(null);
          }}
          className={`px-4 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "sectors"
              ? "bg-white text-zinc-950 shadow-xs border border-zinc-250/20"
              : "text-zinc-500 hover:text-zinc-905 font-medium text-xs transition-colors"
          }`}
        >
          <MapPin className="h-3.5 w-3.5" />
          Setores ({sectors.length})
        </button>
        <button
          onClick={() => {
            setActiveSubTab("categories");
            setError(null);
            setSuccess(null);
          }}
          className={`px-4 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "categories"
              ? "bg-white text-zinc-950 shadow-xs border border-zinc-250/20"
              : "text-zinc-500 hover:text-zinc-905 font-medium text-xs transition-colors"
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Categorias ({categories.length})
        </button>
        <button
          onClick={() => {
            setActiveSubTab("history");
            setError(null);
            setSuccess(null);
          }}
          className={`px-4 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "history"
              ? "bg-white text-zinc-950 shadow-xs border border-zinc-250/20"
              : "text-zinc-500 hover:text-zinc-905 font-medium text-xs transition-colors"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          Histórico ({history.length})
        </button>
        <button
          onClick={() => {
            setActiveSubTab("discards");
            setError(null);
            setSuccess(null);
          }}
          className={`px-4 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "discards"
              ? "bg-white text-zinc-950 shadow-xs border border-zinc-250/20"
              : "text-zinc-500 hover:text-zinc-905 font-medium text-xs transition-colors"
          }`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Descartados ({discards.length})
        </button>
      </div>

      {/* Dynamic Notifications */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-150 text-red-800 text-xs rounded-lg flex items-center gap-2 animate-fade-in">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          <span className="font-semibold">{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-zinc-50 border border-zinc-250 text-zinc-900 text-xs rounded-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <span className="font-semibold">{success}</span>
        </div>
      )}

      {/* Tab Contents */}
      {activeSubTab === "sectors" ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* New Sector Form */}
          <div className="md:col-span-5 bg-zinc-55/20 p-5 rounded-xl border border-zinc-150 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Novo Setor</h4>
              <p className="text-[11px] text-zinc-500 mt-1">
                Adicione um novo departamento da organização para receber alocações de hardware.
              </p>
            </div>
            <form onSubmit={handleAddSectorSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Nome do Setor / Setor corporativo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Comercial Sul"
                  value={newSector}
                  onChange={(e) => setNewSector(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-250 rounded-lg focus:border-zinc-950 focus:ring-0 focus:outline-hidden text-xs bg-white transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-zinc-900 hover:bg-zinc-805 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar Setor
              </button>
            </form>
          </div>

          {/* List Sectors */}
          <div className="md:col-span-7 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Setores Cadastrados</h4>
            <div className="border border-zinc-200 rounded-xl overflow-hidden max-h-[350px] overflow-y-auto bg-zinc-50/10">
              {sectors.length === 0 ? (
                <div className="p-8 text-center text-zinc-400 text-xs">
                  Nenhum setor cadastrado.
                </div>
              ) : (
                <table className="w-full text-left text-xs text-zinc-650 border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-150 font-semibold text-zinc-500 uppercase tracking-wider text-[10px] select-none">
                      <th className="py-2.5 px-4 font-bold">Nome do Setor</th>
                      <th className="py-2.5 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {sectors.map((sec) => (
                      <tr key={sec} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-zinc-900">{sec}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              onDeleteSector(sec);
                              showNotification("success", `Setor "${sec}" excluído com sucesso!`);
                            }}
                            className="p-1 px-2 rounded-md hover:bg-rose-50 text-rose-600 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                            title="Remover este setor"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 italic">
              * Nota: A remoção de um setor não apagará históricos de entregas antigas vinculadas a ele, mas o removerá como opção em futuros registros.
            </p>
          </div>
        </div>
      ) : activeSubTab === "categories" ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* New Category Form */}
          <div className="md:col-span-5 bg-zinc-55/20 p-5 rounded-xl border border-zinc-150 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Nova Categoria</h4>
              <p className="text-[11px] text-zinc-500 mt-1">
                Adicione uma classificação geral para classificar os equipamentos do inventário.
              </p>
            </div>
            <form onSubmit={handleAddCategorySubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  placeholder="Ex: Licenças de Software"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-250 rounded-lg focus:border-zinc-950 focus:ring-0 focus:outline-hidden text-xs bg-white transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-zinc-900 hover:bg-zinc-805 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar Categoria
              </button>
            </form>
          </div>

          {/* List Categories */}
          <div className="md:col-span-7 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Categorias Cadastrados</h4>
            <div className="border border-zinc-200 rounded-xl overflow-hidden max-h-[350px] overflow-y-auto bg-zinc-50/10">
              {categories.length === 0 ? (
                <div className="p-8 text-center text-zinc-400 text-xs">
                  Nenhuma categoria cadastrada.
                </div>
              ) : (
                <table className="w-full text-left text-xs text-zinc-650 border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-150 font-semibold text-zinc-500 uppercase tracking-wider text-[10px] select-none">
                      <th className="py-2.5 px-4 font-bold">Nome da Categoria</th>
                      <th className="py-2.5 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {categories.map((cat) => (
                      <tr key={cat} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-zinc-900">{cat}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              onDeleteCategory(cat);
                              showNotification("success", `Categoria "${cat}" excluída com sucesso!`);
                            }}
                            className="p-1 px-2 rounded-md hover:bg-rose-50 text-rose-600 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                            title="Remover esta categoria"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 italic">
              * Nota: Certifique-se de que nenhum item ativo no estoque ainda utiliza esta categoria antes de excluí-la.
            </p>
          </div>
        </div>
      ) : activeSubTab === "history" ? (
        <HistoryLogs history={history} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 bg-zinc-55/20 p-5 rounded-xl border border-zinc-150 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800">Registrar Descarte</h4>
            <p className="text-[11px] text-zinc-500 mt-1">Selecione um ativo em posse de colaborador para registrar um descarte definitivo.</p>
            <div className="max-h-[320px] overflow-y-auto mt-3 space-y-2">
              {(deliveries && deliveries.length > 0 ? deliveries.filter(d => d.status !== 'Descartado' && d.status !== 'Devolvido') : []).map((d) => (
                <div key={d.id} className="flex items-center justify-between bg-white p-2 rounded border border-zinc-100">
                  <div className="text-xs">
                    <div className="font-semibold">{d.itemName}</div>
                    <div className="text-[11px] text-zinc-500">{d.colaborador} • {d.setor}</div>
                  </div>
                  <div>
                    <button
                      onClick={() => onSelectForDiscard && onSelectForDiscard(d)}
                      className="px-2 py-1 rounded-md text-xs bg-rose-600 text-white hover:bg-rose-700 transition-all flex items-center gap-2"
                      title="Registrar descarte deste ativo"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Registrar Descarte</span>
                    </button>
                  </div>
                </div>
              ))}
              {(!deliveries || deliveries.filter(d => d.status !== 'Descartado' && d.status !== 'Devolvido').length === 0) && (
                <p className="text-[12px] text-zinc-400">Nenhum ativo em posse pode ser marcado para descarte.</p>
              )}
            </div>
          </div>

          <div className="md:col-span-7">
            <DiscardsList discards={discards} />
          </div>
        </div>
      )}
    </div>
  );
};
