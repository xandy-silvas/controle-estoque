import React, { useState } from "react";
import { AssetDelivery, ItemCondition } from "../types";
import { X, ShieldAlert } from "lucide-react";

interface ReturnFormProps {
  delivery: AssetDelivery;
  onSubmit: (formData: {
    deliveryId: string;
    quantity: number;
    dataDevolucao: string;
    condicao: ItemCondition;
    observacao: string;
  }) => void;
  onClose: () => void;
}

export const ReturnForm: React.FC<ReturnFormProps> = ({
  delivery,
  onSubmit,
  onClose,
}) => {
  const [quantity, setQuantity] = useState<number>(delivery.quantity);
  const [dataDevolucao, setDataDevolucao] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [condicao, setCondicao] = useState<ItemCondition>(ItemCondition.Excelente);
  const [observacao, setObservacao] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (quantity <= 0) {
      setError("A quantidade devolvida deve ser de pelo menos 1 unidade.");
      return;
    }

    if (quantity > delivery.quantity) {
      setError(
        `Quantidade inválida: O colaborador possui apenas ${delivery.quantity} unidades deste ativo entregues.`
      );
      return;
    }

    if (!dataDevolucao) {
      setError("Por favor, preencha a data da devolução.");
      return;
    }

    if (!condicao) {
      setError("Por favor, selecione a condição física do item retornado.");
      return;
    }

    onSubmit({
      deliveryId: delivery.id,
      quantity,
      dataDevolucao,
      condicao,
      observacao: observacao.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/25 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 transition-all duration-200">
      <div className="bg-white rounded-xl shadow-xs border border-zinc-150 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">Registrar Retorno / Devolução</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Dê entrada e faça a vistoria física do ativo recolhido</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-750 hover:bg-zinc-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs lg:text-sm flex-1">
          {error && (
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-750 flex gap-2.5 text-xs">
              <ShieldAlert className="h-4 w-4 shrink-0 text-zinc-900" />
              <div>{error}</div>
            </div>
          )}

          {/* Asset Info Card */}
          <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-lg space-y-2.5">
            <div>
              <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider block">Ativo Alocado</span>
              <span className="text-sm font-semibold text-zinc-800">{delivery.itemName}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div>
                <span className="text-zinc-400 font-medium">Código:</span>{" "}
                <span className="font-mono text-zinc-650 font-semibold text-2xs bg-zinc-100 px-1 py-0.5 rounded">
                  {delivery.code}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 font-medium">Responsável:</span>{" "}
                <span className="font-semibold text-zinc-700">{delivery.colaborador}</span>
              </div>
              <div>
                <span className="text-zinc-400 font-medium">Setor:</span>{" "}
                <span className="font-semibold text-zinc-700">{delivery.setor}</span>
              </div>
              <div>
                <span className="text-zinc-400 font-medium">Quantidade Atual:</span>{" "}
                <span className="font-semibold text-zinc-800 font-mono">{delivery.quantity} un.</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
                Quantidade a Devolver <span className="text-zinc-650">*</span>
              </label>
              <input
                type="number"
                min="1"
                max={delivery.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:ring-0 focus:outline-hidden text-xs transition-colors"
                required
              />
              <p className="text-[10px] text-zinc-400 mt-1">
                Máximo reembolsável: {delivery.quantity} un.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
                Data do Retorno <span className="text-zinc-650">*</span>
              </label>
              <input
                type="date"
                value={dataDevolucao}
                onChange={(e) => setDataDevolucao(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:ring-0 focus:outline-hidden text-xs transition-colors"
                required
              />
            </div>
          </div>

          {/* Condition of returned item */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
              Condição Física do Item Retornado <span className="text-zinc-650">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.values(ItemCondition).map((cond) => {
                const isActive = condicao === cond;
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setCondicao(cond)}
                    className={`px-3 py-2 border text-[10px] font-bold rounded-lg text-center cursor-pointer transition-all ${
                      isActive
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                        : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-400"
                    }`}
                  >
                    {cond}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
              Observações da Devolução / Avaliação <span className="text-zinc-650">*</span>
            </label>
            <textarea
              placeholder="Descreva observações sobre o estado em que o equipamento foi devolvido..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:ring-0 focus:outline-hidden text-xs resize-none transition-colors"
              required
            />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4.5 border-t border-zinc-100 flex items-center justify-end gap-2.5 bg-zinc-50/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all font-medium text-xs cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4.5 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-all font-medium text-xs cursor-pointer"
          >
            Confirmar Devolução
          </button>
        </div>
      </div>
    </div>
  );
};
