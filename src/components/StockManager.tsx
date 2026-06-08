import React, { useState } from "react";
import { InventoryItem } from "../types";
import { Plus, PackageCheck, AlertCircle, RefreshCw } from "lucide-react";

interface StockManagerProps {
  inventory: InventoryItem[];
  categories: string[];
  onAddItem: (itemData: {
    name: string;
    code: string;
    category: string;
    totalQuantity: number;
  }) => void;
  onReplenish: (itemId: string, increment: number) => void;
}

export const StockManager: React.FC<StockManagerProps> = ({
  inventory,
  categories,
  onAddItem,
  onReplenish,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0] || "Notebooks");
  const [totalQuantity, setTotalQuantity] = useState(5);
  const [error, setError] = useState<string | null>(null);

  // Replenish controls
  const [replenishItemId, setReplenishItemId] = useState<string | null>(null);
  const [replenishCount, setReplenishCount] = useState<number>(5);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Por favor, preencha o nome do equipamento.");
      return;
    }

    const generatedCode = "STK-" + Math.floor(1000 + Math.random() * 9000);

    onAddItem({
      name: name.trim(),
      code: generatedCode,
      category,
      totalQuantity,
    });

    // Reset Form
    setName("");
    setCategory(categories[0] || "Notebooks");
    setTotalQuantity(5);
    setShowAddForm(false);
  };

  const handleReplenishSubmit = (itemId: string) => {
    if (replenishCount < 1) return;
    onReplenish(itemId, replenishCount);
    setReplenishItemId(null);
    setReplenishCount(5);
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
        <div>
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2 tracking-tight">
            <PackageCheck className="h-4 w-4 text-zinc-900" />
            Inventário de Estoque de Ativos TI
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Visualize o total de equipamentos disponíveis versus alocados e configure novos lotes
          </p>
        </div>
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 font-medium text-xs flex items-center gap-1.5 self-start cursor-pointer transition-all"
          >
            <Plus className="h-4 w-4" />
            Cadastrar Novo Modelo
          </button>
        ) : (
          <button
            onClick={() => {
              setShowAddForm(false);
              setError(null);
            }}
            className="px-3.5 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-medium text-xs self-start cursor-pointer transition-all"
          >
            Cancelar Cadastro
          </button>
        )}
      </div>

      {/* New Item Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="bg-zinc-50/70 p-5 rounded-lg border border-zinc-200 my-4 space-y-4 text-xs animate-fade-in"
        >
          <p className="font-bold text-zinc-800 text-sm tracking-tight">Registrar Novo Modelo de Equipamento em Estoque</p>
          
          {error && (
            <div className="p-2.5 bg-zinc-100 border border-zinc-205 rounded text-zinc-800 font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">
                Nome do Material / Equipamento *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: ThinkPad L14 Gen 3 Ryzen 7"
                className="w-full px-2.5 py-1.5 border border-zinc-200 bg-white rounded-lg focus:border-zinc-900 focus:ring-0 focus:outline-hidden text-xs transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-zinc-200 bg-white rounded-lg focus:border-zinc-900 focus:ring-0 focus:outline-hidden text-xs transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-zinc-450 uppercase mb-1">
                Quantidade Inicial no Estoque
              </label>
              <input
                type="number"
                min="0"
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-2.5 py-1.5 border border-zinc-200 bg-white rounded-lg focus:border-zinc-900 focus:ring-0 focus:outline-hidden text-xs transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-zinc-900 text-white hover:bg-zinc-805 font-bold cursor-pointer transition-all"
            >
              Adicionar ao Estoque
            </button>
          </div>
        </form>
      )}

      {/* Grid of Stock Items */}
      <div className="mt-4 grow overflow-y-auto max-h-[380px] pr-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-650 border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/60 font-semibold text-zinc-700 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Equipamento</th>
                <th className="py-2.5 px-2">Categoria</th>
                <th className="py-2.5 px-2 text-center">Em Estoque</th>
                <th className="py-2.5 px-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {inventory.map((item) => {
                const delivered = item.totalQuantity - item.availableQuantity;
                const isLow = item.availableQuantity <= 1;

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50/40 transition-colors align-middle"
                  >
                    <td className="py-3 px-3 font-semibold text-zinc-950 max-w-[200px] truncate" title={item.name}>
                      {item.name}
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 text-zinc-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span
                          className={`font-mono font-bold text-sm ${
                            isLow ? "text-zinc-950 font-black" : "text-zinc-900"
                          }`}
                        >
                          {item.availableQuantity}
                        </span>
                        {isLow && (
                          <span
                            className="bg-zinc-100 border border-zinc-200 text-zinc-800 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                            title="Estoque Crítico"
                          >
                            BAIXO
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {replenishItemId === item.id ? (
                        <div className="inline-flex items-center gap-1">
                          <input
                            type="number"
                            min="1"
                            value={replenishCount}
                            onChange={(e) =>
                              setReplenishCount(Math.max(1, parseInt(e.target.value) || 1))
                            }
                            className="w-12 px-2 py-0.5 text-xs text-center border border-zinc-200 rounded-md font-mono font-bold bg-white focus:outline-hidden"
                          />
                          <button
                            onClick={() => handleReplenishSubmit(item.id)}
                            className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-[10px] font-bold uppercase cursor-pointer"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setReplenishItemId(null)}
                            className="px-2 py-0.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded text-[10px] font-bold uppercase cursor-pointer"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setReplenishItemId(item.id);
                            setReplenishCount(5);
                          }}
                          className="px-2 py-1 border border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 rounded-lg text-[10px] font-bold text-zinc-700 uppercase tracking-wider inline-flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <RefreshCw className="h-2.5 w-2.5" />
                          Reabastecer
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
