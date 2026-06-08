import React, { useState, useEffect } from "react";
import { InventoryItem } from "../types";
import { X, ShieldAlert, BadgeInfo } from "lucide-react";

interface DeliveryFormProps {
  inventory: InventoryItem[];
  sectors: string[];
  onSubmit: (formData: {
    itemId: string;
    colaborador: string;
    setor: string;
    quantity: number;
    dataEntrega: string;
    motivo: string;
    observacao?: string;
    termPdf?: { name: string; data: string };
  }) => void;
  onClose: () => void;
}

export const DeliveryForm: React.FC<DeliveryFormProps> = ({
  inventory,
  sectors,
  onSubmit,
  onClose,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [colaborador, setColaborador] = useState<string>("");
  const [setor, setSetor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [dataEntrega, setDataEntrega] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [motivo, setMotivo] = useState<string>("");
  const [observacao, setObservacao] = useState<string>("");
  const [termPdf, setTermPdf] = useState<{ name: string; data: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Helper checking if selected item category looks like high value (Notebooks, Celulares, Servidores, etc.)
  const isHighValue = selectedItemId 
    ? ["Notebooks", "Celulares", "Servidores", "Monitores"].includes(
        inventory.find((i) => i.id === selectedItemId)?.category || ""
      )
    : false;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Por favor, envie apenas arquivos em formato PDF.");
        return;
      }
      
      // Limit file size to 3MB for localStorage safety
      if (file.size > 3 * 1024 * 1024) {
        setError("O arquivo PDF excede o limite recomendado para armazenamento offline (limite de 3MB).");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setTermPdf({
          name: file.name,
          data: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-fill and reset quantity bounds when item selected
  useEffect(() => {
    if (selectedItemId) {
      const selectedItem = inventory.find((i) => i.id === selectedItemId);
      if (selectedItem) {
        setError(null);
        if (selectedItem.availableQuantity === 0) {
          setError(`Atenção: Este item ("${selectedItem.name}") não possui estoque disponível no momento!`);
        } else if (quantity > selectedItem.availableQuantity) {
          setQuantity(selectedItem.availableQuantity);
        }
      }
    }
  }, [selectedItemId, inventory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedItemId) {
      setError("Por favor, selecione um equipamento ou material.");
      return;
    }

    const selectedItem = inventory.find((i) => i.id === selectedItemId);
    if (!selectedItem) {
      setError("Item selecionado inválido.");
      return;
    }

    if (selectedItem.availableQuantity <= 0) {
      setError(`Impossível entregar: Não há unidades disponíveis em estoque.`);
      return;
    }

    if (quantity <= 0) {
      setError("A quantidade entregue deve ser de pelo menos 1 unidade.");
      return;
    }

    if (quantity > selectedItem.availableQuantity) {
      setError(
        `Disponibilidade insuficiente: Apenas ${selectedItem.availableQuantity} unidades em estoque.`
      );
      return;
    }

    if (!colaborador.trim()) {
      setError("Por favor, informe o nome do colaborador responsável.");
      return;
    }

    if (!setor) {
      setError("Por favor, selecione o setor.");
      return;
    }

    if (!dataEntrega) {
      setError("Por favor, preencha a data da entrega.");
      return;
    }

    if (!motivo.trim()) {
      setError("Por favor, descreva ou selecione o motivo da entrega do ativo.");
      return;
    }

    onSubmit({
      itemId: selectedItemId,
      colaborador: colaborador.trim(),
      setor,
      quantity,
      dataEntrega,
      motivo: motivo.trim(),
      observacao: observacao.trim() || undefined,
      termPdf: termPdf || undefined,
    });
  };

  const selectedItem = inventory.find((i) => i.id === selectedItemId);

  return (
    <div className="fixed inset-0 bg-zinc-950/25 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 transition-all duration-200">
      <div className="bg-white rounded-xl shadow-xs border border-zinc-150 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h3 className="text-base font-bold text-zinc-900 tracking-tight">Registrar Entrega de Ativo</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Registre a alocação de equipamentos e materiais com baixa automática</p>
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
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-700 flex gap-2.5 text-xs">
              <ShieldAlert className="h-4 w-4 shrink-0 text-zinc-900" />
              <div>{error}</div>
            </div>
          )}

          {/* Item Selection */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
              Item / Equipamento <span className="text-zinc-650">*</span>
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:ring-0 focus:outline-hidden bg-white text-zinc-800 text-xs transition-colors"
              required
            >
              <option value="">Selecione um ativo disponível no estoque...</option>
              {inventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.category}) — {item.availableQuantity} disponíveis
                </option>
              ))}
            </select>
          </div>

          {/* Quantity selector */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
              Quantidade <span className="text-zinc-650">*</span>
            </label>
            <input
              type="number"
              min="1"
              max={selectedItem ? selectedItem.availableQuantity : 100}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:ring-0 focus:outline-hidden text-xs transition-colors"
              required
            />
            {selectedItem && (
              <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
                <BadgeInfo className="h-3 w-3 text-zinc-400" />
                Máximo: {selectedItem.availableQuantity} unidades
              </p>
            )}
          </div>

          {/* Responsável e Setor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
                Nome do Colaborador <span className="text-zinc-650">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Roberto da Silva"
                value={colaborador}
                onChange={(e) => setColaborador(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:ring-0 focus:outline-hidden text-xs transition-colors"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
                Setor de Destino <span className="text-zinc-650">*</span>
              </label>
              <select
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:ring-0 focus:outline-hidden bg-white text-xs transition-colors"
                required
              >
                <option value="">Selecione o setor...</option>
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Data Entrega e Motivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
                Data de Entrega <span className="text-zinc-650">*</span>
              </label>
              <input
                type="date"
                value={dataEntrega}
                onChange={(e) => setDataEntrega(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:ring-0 focus:outline-hidden text-xs transition-colors"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
                Motivo / Justificativa <span className="text-zinc-650">*</span>
              </label>
              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:ring-0 focus:outline-hidden bg-white text-xs transition-colors"
                required
              >
                <option value="">Selecione um motivo...</option>
                <option value="Nova Contratação / Admissão">Nova Contratação / Admissão</option>
                <option value="Substituição por Defeito">Substituição por Defeito</option>
                <option value="Upgrade de Equipamento">Upgrade de Equipamento</option>
                <option value="Montagem de Setup Home Office">Montagem de Setup Home Office</option>
                <option value="Empréstimo Temporário / Evento">Empréstimo Temporário / Evento</option>
                <option value="Uso Compartilhado no Setor">Uso Compartilhado no Setor</option>
              </select>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
              Observações Adicionais
            </label>
            <textarea
              placeholder="Detalhes adicionais sobre o estado de entrega do ativo..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:ring-0 focus:outline-hidden text-xs resize-none transition-colors"
            />
          </div>

          {/* Termo de Empréstimo PDF (Opcional - Recomendado para produtos de alto valor) */}
          <div className="space-y-1.5 border-t border-zinc-150 pt-3">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold text-zinc-455 uppercase tracking-wider">
                Termo de Empréstimo Assinado (PDF) — <span className="text-zinc-500 font-normal normal-case italic">Opcional</span>
              </label>
              {isHighValue && (
                <span className="text-[9px] text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-zinc-200 select-none animate-pulse">
                  Recomendado para Alto Valor
                </span>
              )}
            </div>
            
            <div className="bg-zinc-50 p-4 rounded-xl border border-dashed border-zinc-250 flex flex-col items-center justify-center gap-2">
              {!termPdf ? (
                <>
                  <p className="text-[11px] text-zinc-500 text-center">
                    Selecione o documento PDF do termo assinado pelo colaborador.
                  </p>
                  <label className="px-3.5 py-1.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all text-[11px] font-bold uppercase tracking-wider cursor-pointer shadow-2xs">
                    Procurar PDF
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </>
              ) : (
                <div className="w-full flex items-center justify-between bg-white p-2.5 rounded-lg border border-zinc-200 shadow-2xs">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold text-xs shrink-0 select-none border border-zinc-200 font-mono">
                      PDF
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-zinc-900 truncate max-w-[240px]" title={termPdf.name}>
                        {termPdf.name}
                      </p>
                      <p className="text-[10px] text-emerald-650 font-bold">Arquivo pronto para salvar</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTermPdf(null)}
                    className="p-1 px-2.5 hover:bg-zinc-100 rounded text-zinc-500 hover:text-zinc-900 font-bold transition-all text-xs"
                    title="Remover termo"
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
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
            className="px-4.5 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-all font-medium text-xs flex items-center gap-1.5 cursor-pointer"
          >
            Confirmar Entrega
          </button>
        </div>
      </div>
    </div>
  );
};
