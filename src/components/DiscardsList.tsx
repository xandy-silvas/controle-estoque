import React, { useState } from "react";
import { DiscardLog } from "../types";
import { Trash2, AlertTriangle, Search, Info } from "lucide-react";

interface DiscardsListProps {
  discards: DiscardLog[];
}

export const DiscardsList: React.FC<DiscardsListProps> = ({ discards }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDiscards = discards.filter((item) => {
    const text = `${item.itemName} ${item.colaboradorOriginal || ""} ${item.setorOriginal || ""} ${item.motivo}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6 overflow-hidden flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
        <div>
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2 tracking-tight">
            <Trash2 className="h-4 w-4 text-zinc-900" />
            Módulo de Ativos Descartados
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Logs oficiais de ativos inutilizados ou descartados, separados de circulação
          </p>
        </div>
      </div>

      <div className="my-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Pesquisar descartes por material, colaborador original ou motivo de descarte..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-zinc-250 rounded-lg focus:border-zinc-900 focus:ring-0 focus:outline-hidden bg-zinc-50/30 text-xs transition-colors"
          />
        </div>
      </div>

      <div className="grow overflow-y-auto max-h-[420px] pr-1">
        {filteredDiscards.length === 0 ? (
          <div className="text-center py-12 px-4 border border-zinc-150 rounded-xl bg-zinc-50/20">
            <AlertTriangle className="h-6 w-6 text-zinc-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-zinc-550">Nenhum descarte registrado</p>
            <p className="text-[11px] text-zinc-400 mt-1">Ao marcar um ativo como descartado, o registro definitivo constará aqui</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDiscards.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border border-zinc-150 bg-zinc-50/50 flex flex-col md:flex-row md:items-start justify-between gap-4 text-xs animate-fade-in"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold bg-zinc-900 text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                      Sem Valor de Uso
                    </span>
                    <span className="text-zinc-400 font-medium text-[10px]">
                      Data: <span className="font-bold text-zinc-700">{formatDate(item.dataDescarte)}</span>
                    </span>
                    <span className="text-zinc-400 font-medium text-[10px] ml-1">
                      Qtde: <span className="font-bold text-zinc-700">{item.quantity}</span>
                    </span>
                  </div>

                  <h4 className="font-semibold text-zinc-950 text-xs">{item.itemName}</h4>
                  
                  <div className="bg-white p-3 rounded-lg border border-zinc-150 space-y-1 mt-1 text-[11px]">
                    <p className="font-bold text-zinc-800 flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                      <Info className="h-3 w-3 text-zinc-600" />
                      Motivo / Laudo do Descarte:
                    </p>
                    <p className="text-zinc-650 leading-relaxed font-mono">"{item.motivo}"</p>
                    {item.observacao && (
                      <p className="text-[10px] text-zinc-400 mt-1.5">
                        Observação complementar: <span className="font-semibold text-zinc-600">{item.observacao}</span>
                      </p>
                    )}
                  </div>

                  {(item.colaboradorOriginal || item.setorOriginal) && (
                    <div className="text-[10px] text-zinc-400 flex flex-wrap items-center gap-2 mt-1.5 font-semibold">
                      <span>Anteriormente em posse de:</span>
                      <span className="bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded-md">
                        {item.colaboradorOriginal} ({item.setorOriginal})
                      </span>
                    </div>
                  )}
                </div>

                <div className="md:text-right shrink-0">
                  <span className="text-[10px] font-bold uppercase text-zinc-400 block tracking-wider">Estado do Descarte</span>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-800 text-[10px] font-bold uppercase tracking-wide">
                    {item.condicao}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
