import React, { useState } from "react";
import { HistoryLog } from "../types";
import { Clock, Calendar, CheckSquare, Search, FileDown } from "lucide-react";

interface HistoryLogsProps {
  history: HistoryLog[];
  onClearHistory?: () => void;
}

export const HistoryLogs: React.FC<HistoryLogsProps> = ({ history, onClearHistory }) => {
  const [filterAction, setFilterAction] = useState<string>("Tudo");
  const [filterSearch, setFilterSearch] = useState<string>("");

  const actions = ["Tudo", "Entrega", "Devolução", "Manutenção", "Transferência", "Descarte", "Ajuste de Estoque"];

  // Sort logs by timestamp newest first
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filteredLogs = sortedHistory.filter((log) => {
    const actionMatch = filterAction === "Tudo" || log.action === filterAction;
    const searchString = `${log.itemName} ${log.colaborador || ""} ${log.setor || ""} ${log.details}`.toLowerCase();
    const searchMatch = searchString.includes(filterSearch.toLowerCase());
    return actionMatch && searchMatch;
  });

  const getActionStyle = (action: string) => {
    switch (action) {
      case "Entrega":
        return "bg-zinc-100 text-zinc-900 border-zinc-200/90";
      case "Devolução":
        return "bg-zinc-50 text-zinc-700 border-zinc-200/80";
      case "Manutenção":
        return "bg-zinc-100/60 text-zinc-800 border-zinc-200/50";
      case "Descarte":
        return "bg-zinc-900 text-white border-zinc-900";
      case "Transferência":
        return "bg-zinc-100 text-zinc-800 border-zinc-200";
      default:
        return "bg-zinc-50 text-zinc-650 border-zinc-200/70";
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const handleExportCSV = () => {
    const headers = ["Data/Hora", "Ação", "Item", "Colaborador", "Setor", "Quantidade", "Detalhes"];
    const rows = filteredLogs.map((log) => [
      formatTimestamp(log.timestamp),
      log.action,
      log.itemName,
      log.colaborador || "N/A",
      log.setor || "N/A",
      log.quantity,
      log.details,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(";"), ...rows.map((r) => r.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `historico_ativos_entregues_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-6 overflow-hidden flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
        <div>
          <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2 tracking-tight">
            <Clock className="h-4 w-4 text-zinc-900" />
            Histórico Geral de Movimentações
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Registro imutável de todas as entregas, devoluções, descartes e alterações
          </p>
        </div>
        
        {filteredLogs.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 font-bold text-xs text-zinc-700 flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            <FileDown className="h-3.5 w-3.5 text-zinc-500" />
            Exportar CSV
          </button>
        )}
      </div>

      {/* Action Filters */}
      <div className="my-4 flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Pesquisar por equipamento, colaborador ou detalhe..."
            value={filterSearch}
            onChange={(e) => setFilterSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:ring-0 focus:outline-hidden bg-zinc-50/30 text-xs transition-colors"
          />
        </div>

        {/* Action filter pills */}
        <div className="flex flex-wrap gap-1 items-center">
          {actions.map((act) => {
            const isSelected = filterAction === act;
            return (
              <button
                key={act}
                onClick={() => setFilterAction(act)}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg border uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-550 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                {act}
              </button>
            );
          })}
        </div>
      </div>

      {/* Logs Chronology */}
      <div className="grow overflow-y-auto max-h-[420px] pr-1 space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 px-4 border border-zinc-150 rounded-xl bg-zinc-50/20">
            <Calendar className="h-6 w-6 text-zinc-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-zinc-550">Nenhum registro encontrado</p>
            <p className="text-[11px] text-zinc-400 mt-1">Experimente ajustar o filtro de pesquisa do histórico</p>
          </div>
        ) : (
          <div className="relative border-l border-zinc-200 pl-5 ml-2.5 space-y-5 py-2">
            {filteredLogs.map((log) => (
              <div key={log.id} className="relative group text-xs animate-fade-in">
                {/* Node marker on the line */}
                <div className="absolute -left-[25px] top-1 bg-white p-0.5 rounded-full border border-zinc-300 text-zinc-400 group-hover:border-zinc-900 transition-colors">
                  <div className="h-1.5 w-1.5 rounded-full bg-zinc-300 group-hover:bg-zinc-900" />
                </div>

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-1">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-zinc-400 font-semibold text-[10px]">
                        {formatTimestamp(log.timestamp)}
                      </span>
                      <span
                        className={`px-2 py-0.5 border text-[9px] font-bold uppercase rounded-md tracking-wider ${getActionStyle(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                      <span className="text-zinc-400 font-medium font-mono text-[10px]">
                        Qtde: {log.quantity}
                      </span>
                    </div>

                    <h4 className="font-semibold text-zinc-900 text-xs">
                      {log.itemName}
                    </h4>
                    
                    <p className="text-zinc-500 font-medium text-[11px] mt-1 leading-relaxed">
                      {log.details}
                    </p>

                    {(log.colaborador || log.setor) && (
                      <div className="mt-1.5 text-[10px] text-zinc-400 flex flex-wrap items-center gap-3 font-semibold">
                        {log.colaborador && (
                          <span>
                            Colaborador: <span className="text-zinc-650">{log.colaborador}</span>
                          </span>
                        )}
                        {log.setor && (
                          <span>
                            Setor: <span className="text-zinc-650">{log.setor}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
