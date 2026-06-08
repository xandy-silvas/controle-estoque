import React, { useState, useEffect } from "react";
import {
  AssetStatus,
  ItemCondition,
  InventoryItem,
  AssetDelivery,
  HistoryLog,
  DiscardLog,
} from "./types";
import {
  INITIAL_INVENTORY,
  INITIAL_DELIVERIES,
  INITIAL_HISTORY,
  INITIAL_DISCARDS,
  SECTORS,
} from "./initialData";
import { MetricCards } from "./components/MetricCards";
import { DeliveryForm } from "./components/DeliveryForm";
import { ReturnForm } from "./components/ReturnForm";
import { StockManager } from "./components/StockManager";
import { HistoryLogs } from "./components/HistoryLogs";
import { DiscardsList } from "./components/DiscardsList";
import { AdminPanel } from "./components/AdminPanel";
import { loadAppState, saveAppState } from "./lib/supabaseState";
import {
  Plus,
  Search,
  Filter,
  RefreshCcw,
  UserCheck,
  Building,
  RotateCcw,
  ArrowLeftRight,
  Wrench,
  Trash2,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  FolderMinus,
  Calendar,
  X,
  PlusCircle,
  Settings,
  Lock,
  Unlock,
  Key,
  ShieldAlert,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";

export default function App() {
  // ---------------------------------------------
  // ACCESSIBILITY & SECURITY (TOKEN-BASED AUTHENTICATION)
  // ---------------------------------------------
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [tokenInput, setTokenInput] = useState<string>("");
  const [showToken, setShowToken] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Expected token from environment or default
    const expectedToken = (import.meta as any).env.VITE_ACCESS_TOKEN || "IventarioTI2026X";

    // 1. Check if token is in the URL search params, e.g. ?token=IventarioTI2026X
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");

    if (tokenFromUrl) {
      if (tokenFromUrl === expectedToken) {
        localStorage.setItem("inventory_auth_token", tokenFromUrl);
        setIsAuthenticated(true);
        // Clean URL params so they don't have the token visibly hanging out after being saved
        const urlWithoutToken = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, urlWithoutToken);
        return;
      } else {
        setAuthError("Token de acesso inválido fornecido via URL.");
      }
    }

    // 2. Check localStorage
    const savedToken = localStorage.getItem("inventory_auth_token");
    if (savedToken === expectedToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleManualAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedToken = (import.meta as any).env.VITE_ACCESS_TOKEN || "IventarioTI2026X";
    if (tokenInput.trim() === expectedToken) {
      localStorage.setItem("inventory_auth_token", tokenInput.trim());
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError("Token incorreto. Por favor, tente novamente.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("inventory_auth_token");
    setIsAuthenticated(false);
    setTokenInput("");
  };

  // ---------------------------------------------
  // STATE MANAGEMENT WITH LOCALSTORAGE PERSISTENCE
  // ---------------------------------------------
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem("ativos_inventory");
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [deliveries, setDeliveries] = useState<AssetDelivery[]>(() => {
    const saved = localStorage.getItem("ativos_deliveries");
    return saved ? JSON.parse(saved) : INITIAL_DELIVERIES;
  });

  const [history, setHistory] = useState<HistoryLog[]>(() => {
    const saved = localStorage.getItem("ativos_history");
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  const [discards, setDiscards] = useState<DiscardLog[]>(() => {
    const saved = localStorage.getItem("ativos_discards");
    return saved ? JSON.parse(saved) : INITIAL_DISCARDS;
  });

  // Sync back to local storage
  useEffect(() => {
    localStorage.setItem("ativos_inventory", JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem("ativos_deliveries", JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem("ativos_history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("ativos_discards", JSON.stringify(discards));
  }, [discards]);

  // ---------------------------------------------
  // SECTORS AND CATEGORIES STATE PERSISTENCE
  // ---------------------------------------------
  const [sectors, setSectors] = useState<string[]>(() => {
    const saved = localStorage.getItem("ativos_sectors");
    return saved ? JSON.parse(saved) : SECTORS;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem("ativos_categories");
    return saved ? JSON.parse(saved) : [
      "Notebooks",
      "Monitores",
      "Celulares",
      "Periféricos",
      "Acessórios",
      "Servidores",
      "Equipamentos de Rede",
    ];
  });

  useEffect(() => {
    localStorage.setItem("ativos_sectors", JSON.stringify(sectors));
  }, [sectors]);

  useEffect(() => {
    localStorage.setItem("ativos_categories", JSON.stringify(categories));
  }, [categories]);

  const supabaseEnabled = Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    if (!supabaseEnabled) return;
    let mounted = true;

    const loadState = async () => {
      const remoteState = await loadAppState();
      if (!mounted || !remoteState) return;

      if (remoteState.inventory) setInventory(remoteState.inventory);
      if (remoteState.deliveries) setDeliveries(remoteState.deliveries);
      if (remoteState.history) setHistory(remoteState.history);
      if (remoteState.discards) setDiscards(remoteState.discards);
      if (remoteState.sectors) setSectors(remoteState.sectors);
      if (remoteState.categories) setCategories(remoteState.categories);
    };

    loadState();
    return () => {
      mounted = false;
    };
  }, [supabaseEnabled]);

  useEffect(() => {
    if (!supabaseEnabled) return;

    saveAppState({
      inventory,
      deliveries,
      history,
      discards,
      sectors,
      categories,
    });
  }, [inventory, deliveries, history, discards, sectors, categories, supabaseEnabled]);

  const handleAddSector = (secName: string) => {
    setSectors((prev) => [...prev, secName]);
  };

  const handleDeleteSector = (secName: string) => {
    setSectors((prev) => prev.filter((s) => s !== secName));
  };

  const handleAddCategory = (catName: string) => {
    setCategories((prev) => [...prev, catName]);
  };

  const handleDeleteCategory = (catName: string) => {
    setCategories((prev) => prev.filter((c) => c !== catName));
  };

  // ---------------------------------------------
  // UI NAVIGATION / VIEW TABS
  // ---------------------------------------------
  const [activeTab, setActiveTab] = useState<"deliveries" | "stock" | "history" | "discards" | "admin">("stock");

  // ---------------------------------------------
  // FILTER STATES (Deliveries Table)
  // ---------------------------------------------
  const [filterColaborador, setFilterColaborador] = useState("");
  const [filterSetor, setFilterSetor] = useState("");
  const [filterItem, setFilterItem] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("Tudo");
  const [filterDataInicio, setFilterDataInicio] = useState("");
  const [filterDataFim, setFilterDataFim] = useState("");

  const clearFilters = () => {
    setFilterColaborador("");
    setFilterSetor("");
    setFilterItem("");
    setFilterStatus("Tudo");
    setFilterDataInicio("");
    setFilterDataFim("");
  };

  // ---------------------------------------------
  // DIALOG / MODAL CONTROLS
  // ---------------------------------------------
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [selectedDeliveryForReturn, setSelectedDeliveryForReturn] = useState<AssetDelivery | null>(null);
  
  // Custom Transfer modal state
  const [selectedDeliveryForTransfer, setSelectedDeliveryForTransfer] = useState<AssetDelivery | null>(null);
  const [transferColaborador, setTransferColaborador] = useState("");
  const [transferSetor, setTransferSetor] = useState("");
  const [transferMotivo, setTransferMotivo] = useState("");
  const [transferError, setTransferError] = useState<string | null>(null);

  // Custom Discard modal state
  const [selectedDeliveryForDiscard, setSelectedDeliveryForDiscard] = useState<AssetDelivery | null>(null);
  const [discardCondicao, setDiscardCondicao] = useState<ItemCondition>(ItemCondition.Danificado);
  const [discardMotivo, setDiscardMotivo] = useState("");
  const [discardObservacao, setDiscardObservacao] = useState("");
  const [discardError, setDiscardError] = useState<string | null>(null);

  // Helper lists
  const sectorsList = [...new Set([...sectors, ...deliveries.map((d) => d.setor)])];

  // ---------------------------------------------
  // DATA ACTIONS (Business Rules)
  // ---------------------------------------------
  
  // 1. Process DELIVERY (add delivery, decrement stock, log history)
  const handleRegisterDelivery = (data: {
    itemId: string;
    colaborador: string;
    setor: string;
    quantity: number;
    dataEntrega: string;
    motivo: string;
    observacao?: string;
    termPdf?: { name: string; data: string };
  }) => {
    // Decrement stock available quantity
    setInventory((prev) =>
      prev.map((item) =>
        item.id === data.itemId
          ? { ...item, availableQuantity: item.availableQuantity - data.quantity }
          : item
      )
    );

    const selectedItem = inventory.find((i) => i.id === data.itemId);
    const itemName = selectedItem ? selectedItem.name : "Equipamento Desconhecido";
    const itemCode = selectedItem ? selectedItem.code : undefined;

    // Create delivery record
    const newDelivery: AssetDelivery = {
      id: `del-${Date.now()}`,
      itemId: data.itemId,
      itemName,
      code: itemCode,
      quantity: data.quantity,
      colaborador: data.colaborador,
      setor: data.setor,
      dataEntrega: data.dataEntrega,
      motivo: data.motivo,
      observacao: data.observacao,
      status: AssetStatus.EmUso,
      termPdf: data.termPdf,
    };

    setDeliveries((prev) => [newDelivery, ...prev]);

    // Record in history log
    const newLog: HistoryLog = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Entrega",
      itemName,
      code: itemCode,
      colaborador: data.colaborador,
      setor: data.setor,
      quantity: data.quantity,
      details: `Ativo entregue para ${data.colaborador}. Motivo: ${data.motivo}. Obs: ${
        data.observacao || "Nenhuma registrada"
      }`,
    };

    setHistory((prev) => [newLog, ...prev]);
    setShowDeliveryForm(false);
  };

  // 2. Process RETURN/DEVOLUÇÃO (increment stock, alter state, log history)
  const handleRegisterReturn = (data: {
    deliveryId: string;
    quantity: number;
    dataDevolucao: string;
    condicao: ItemCondition;
    observacao: string;
  }) => {
    const originalDelivery = deliveries.find((d) => d.id === data.deliveryId);
    if (!originalDelivery) return;

    // Increment inventory stock
    setInventory((prev) =>
      prev.map((item) =>
        item.id === originalDelivery.itemId
          ? { ...item, availableQuantity: item.availableQuantity + data.quantity }
          : item
      )
    );

    // Update the delivery record
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id === data.deliveryId) {
          const fullyReturned = data.quantity === d.quantity;
          if (fullyReturned) {
            return {
              ...d,
              status: AssetStatus.Devolvido,
              dataDevolucao: data.dataDevolucao,
              condicaoDevolucao: data.condicao,
              observacao: `[Devolvido em ${data.dataDevolucao} como ${data.condicao}]: ${data.observacao}. Original: ${d.observacao || ""}`,
            };
          } else {
            // Partial Return - keep "Em Uso" but decrement original quantity assigned
            return {
              ...d,
              quantity: d.quantity - data.quantity,
              observacao: `[Retorno parcial de ${data.quantity} un. em ${data.dataDevolucao} como ${data.condicao}]: ${data.observacao}. ${d.observacao || ""}`,
            };
          }
        }
        return d;
      })
    );

    // Record History Log
    const newLog: HistoryLog = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Devolução",
      itemName: originalDelivery.itemName,
      code: originalDelivery.code,
      colaborador: originalDelivery.colaborador,
      setor: originalDelivery.setor,
      quantity: data.quantity,
      details: `Devolução de ${data.quantity} de ${originalDelivery.itemName} registrada. Estado retornado: ${data.condicao}. Obs: ${data.observacao}`,
    };

    setHistory((prev) => [newLog, ...prev]);
    setSelectedDeliveryForReturn(null);
  };

  // 3. Process MAINTENANCE toggle
  const handleToggleMaintenance = (deliveryId: string) => {
    setDeliveries((prev) =>
      prev.map((d) => {
        if (d.id === deliveryId) {
          const currentlyMaintenance = d.status === AssetStatus.EmManutencao;
          const newStatus = currentlyMaintenance ? AssetStatus.EmUso : AssetStatus.EmManutencao;

          // History log
          const newLog: HistoryLog = {
            id: `hist-${Date.now()}`,
            timestamp: new Date().toISOString(),
            action: "Manutenção",
            itemName: d.itemName,
            code: d.code,
            colaborador: d.colaborador,
            setor: d.setor,
            quantity: d.quantity,
            details: currentlyMaintenance
              ? `Equipamento retornou da manutenção científica para uso ativo regular`
              : `Enviado equipamento em posse de ${d.colaborador} para laboratório de manutenção emergencial devido à problemas relatados`,
            statusAnterior: d.status,
            statusNovo: newStatus,
          };

          setHistory((h) => [newLog, ...h]);

          return { ...d, status: newStatus };
        }
        return d;
      })
    );
  };

  // 4. Process TRANSFER
  const handleRegisterTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError(null);

    if (!selectedDeliveryForTransfer) return;

    if (!transferColaborador.trim()) {
      setTransferError("O nome do novo colaborador responsável é obrigatório.");
      return;
    }
    if (!transferSetor) {
      setTransferError("Selecione o setor de destino.");
      return;
    }
    if (!transferMotivo.trim()) {
      setTransferError("Informe o motivo da transferência.");
      return;
    }

    const tCol = transferColaborador.trim();
    const tSet = transferSetor;
    const tMot = transferMotivo.trim();
    const d = selectedDeliveryForTransfer;

    // Update active delivery details
    setDeliveries((prev) =>
      prev.map((item) =>
        item.id === d.id
          ? {
              ...item,
              colaborador: tCol,
              setor: tSet,
              status: AssetStatus.Transferido,
              observacao: `[Transferido de ${d.colaborador} (${d.setor}) para ${tCol} em ${
                new Date().toISOString().split("T")[0]
              }]: ${tMot}. ${item.observacao || ""}`,
            }
          : item
      )
    );

    // History log
    const newLog: HistoryLog = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Transferência",
      itemName: d.itemName,
      code: d.code,
      colaborador: tCol,
      setor: tSet,
      quantity: d.quantity,
      details: `Equipamento transferido de ${d.colaborador} (${d.setor}) para o novo responsável: ${tCol} (${tSet}). Motivo: ${tMot}`,
    };

    setHistory((prev) => [newLog, ...prev]);

    // Reset forms
    setSelectedDeliveryForTransfer(null);
    setTransferColaborador("");
    setTransferSetor("");
    setTransferMotivo("");
  };

  // 5. Process DISCARD (alter status, send to discard list, record in history)
  const handleRegisterDiscard = (e: React.FormEvent) => {
    e.preventDefault();
    setDiscardError(null);

    if (!selectedDeliveryForDiscard) return;

    if (!discardMotivo.trim()) {
      setDiscardError("A justificativa ou motivo do descarte é obrigatório.");
      return;
    }

    const d = selectedDeliveryForDiscard;

    // Create discard log record
    const newDiscard: DiscardLog = {
      id: `dis-${Date.now()}`,
      deliveryId: d.id,
      itemName: d.itemName,
      code: d.code,
      quantity: d.quantity,
      colaboradorOriginal: d.colaborador,
      setorOriginal: d.setor,
      dataDescarte: new Date().toISOString().split("T")[0],
      condicao: discardCondicao,
      motivo: discardMotivo.trim(),
      observacao: discardObservacao.trim() || undefined,
    };

    setDiscards((prev) => [newDiscard, ...prev]);

    // Update delivery record to 'Descartado'
    setDeliveries((prev) =>
      prev.map((item) =>
        item.id === d.id
          ? {
              ...item,
              status: AssetStatus.Descartado,
              observacao: `[Ativo DESCARTADO em ${newDiscard.dataDescarte}]: Motivo: ${
                newDiscard.motivo
              }. Obs: ${newDiscard.observacao || "Nenhuma"}`,
            }
          : item
      )
    );

    // Also decrement total quantity of this item in the inventory since it has been physically discarded/destroyed
    setInventory((prev) =>
      prev.map((item) =>
        item.id === d.itemId
          ? { ...item, totalQuantity: Math.max(0, item.totalQuantity - d.quantity) }
          : item
      )
    );

    // History log
    const newLog: HistoryLog = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Descarte",
      itemName: d.itemName,
      code: d.code,
      colaborador: d.colaborador,
      setor: d.setor,
      quantity: d.quantity,
      details: `Ativo em posse de ${d.colaborador} enviado para o Módulo de Descarte / Baixas de TI. Condição: ${discardCondicao}. Justificativa: ${discardMotivo}`,
    };

    setHistory((prev) => [newLog, ...prev]);

    // Reset forms
    setSelectedDeliveryForDiscard(null);
    setDiscardMotivo("");
    setDiscardObservacao("");
    setDiscardCondicao(ItemCondition.Danificado);
  };

  // 6. Inventario: Add brand new item specification
  const handleAddInventoryModel = (data: {
    name: string;
    code: string;
    category: string;
    totalQuantity: number;
  }) => {
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: data.name,
      code: data.code,
      category: data.category,
      totalQuantity: data.totalQuantity,
      availableQuantity: data.totalQuantity,
    };

    setInventory((prev) => [...prev, newItem]);

    // Add History
    const log: HistoryLog = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Ajuste de Estoque",
      itemName: data.name,
      code: data.code,
      quantity: data.totalQuantity,
      details: `Cadastrado novo lote modelo de equip. "${data.name}" em estoque TI. Categoria: ${data.category}. Qtde Total Inicial: ${data.totalQuantity}`,
    };

    setHistory((prev) => [log, ...prev]);
  };

  // 7. Inventario: Replenish quantity of existing item
  const handleReplenishInventory = (itemId: string, increment: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              totalQuantity: item.totalQuantity + increment,
              availableQuantity: item.availableQuantity + increment,
            }
          : item
      )
    );

    const match = inventory.find((i) => i.id === itemId);
    if (match) {
      const log: HistoryLog = {
        id: `hist-${Date.now()}`,
        timestamp: new Date().toISOString(),
        action: "Ajuste de Estoque",
        itemName: match.name,
        code: match.code,
        quantity: increment,
        details: `Reabastecimento de estoque realizado: Adicionada ${increment} unidades extras do item ${match.name} ao almoxarifado regular`,
      };
      setHistory((prev) => [log, ...prev]);
    }
  };

  // ---------------------------------------------
  // RENDER FILTERED LIST (Ativos Entregues Table)
  // ---------------------------------------------
  const filteredDeliveries = deliveries.filter((item) => {
    // 1. Colaborador filter
    if (
      filterColaborador &&
      !item.colaborador.toLowerCase().includes(filterColaborador.toLowerCase())
    ) {
      return false;
    }

    // 2. Setor filter
    if (filterSetor && item.setor !== filterSetor) {
      return false;
    }

    // 3. Item Name filter
    if (
      filterItem &&
      !item.itemName.toLowerCase().includes(filterItem.toLowerCase())
    ) {
      return false;
    }

    // 4. Status filter
    if (filterStatus !== "Tudo" && item.status !== filterStatus) {
      return false;
    }

    // 6. Period filters
    if (filterDataInicio) {
      const deliveryDate = new Date(item.dataEntrega);
      const startDate = new Date(filterDataInicio);
      if (deliveryDate < startDate) return false;
    }

    if (filterDataFim) {
      const deliveryDate = new Date(item.dataEntrega);
      const endDate = new Date(filterDataFim);
      if (deliveryDate > endDate) return false;
    }

    return true;
  });

  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case AssetStatus.EmUso:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-900 text-white border border-zinc-950">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Em Uso
          </span>
        );
      case AssetStatus.Devolvido:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-550 border border-zinc-200">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
            Devolvido
          </span>
        );
      case AssetStatus.EmManutencao:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-800 border border-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Em Manutenção
          </span>
        );
      case AssetStatus.Transferido:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600 border border-zinc-200">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
            Transferido
          </span>
        );
      case AssetStatus.Descartado:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-zinc-100 text-zinc-400 border border-zinc-200 line-through">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
            Descartado
          </span>
        );
    }
  };

  const formatDateField = (dateStr: string) => {
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans transition-all">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4 animate-fade-in">
          <div className="mx-auto bg-zinc-900 h-12 w-12 rounded-2xl flex items-center justify-center border border-zinc-700 shadow-sm">
            <Lock className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 tracking-tight">
              Acesso Restrito
            </h2>
            <p className="mt-1 text-xs text-zinc-400 font-bold uppercase tracking-widest">
              Controle de Ativos de TI
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 animate-fade-in">
          <div className="bg-white py-8 px-6 shadow-xs rounded-2xl border border-zinc-200 space-y-6">
            
            <div className="text-xs text-zinc-500 bg-zinc-50 p-4 rounded-xl border border-zinc-200/60 leading-relaxed space-y-2">
              <div className="flex gap-2 items-center font-bold text-zinc-800 uppercase tracking-wider text-[10px]">
                <ShieldAlert className="h-4 w-4 text-zinc-900 shrink-0" />
                <span>Diretriz de Segurança</span>
              </div>
              <p>
                Este sistema armazena informações patrimoniais internas. Insira o token de segurança para continuar ou utilize uma URL pré-autorizada.
              </p>
              <p className="text-[10px] text-zinc-400 border-t border-zinc-200/60 pt-2 font-mono">
                Dica: se você tiver uma URL pré-autorizada, abra-a diretamente no navegador.
              </p>
            </div>

            <form onSubmit={handleManualAuth} className="space-y-4">
              {authError && (
                <div className="p-3 bg-rose-50 text-rose-800 border-l-2 border-rose-500 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="token" className="block text-[10px] font-bold text-zinc-450 uppercase tracking-widest">
                  Chave Secrética / Token *
                </label>
                <div className="relative rounded-md shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-4 w-4 text-zinc-400" />
                  </div>
                  <input
                    id="token"
                    type={showToken ? "text" : "password"}
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Insira o seu token..."
                    className="block w-full pl-10 pr-10 py-2.5 sm:text-xs border border-zinc-250 bg-zinc-50/25 rounded-xl focus:border-zinc-950 focus:ring-0 focus:outline-hidden transition-colors font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-650"
                  >
                    {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-xs text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 focus:outline-hidden cursor-pointer transition-all flex items-center justify-center gap-2 h-10"
                >
                  <Unlock className="h-4 w-4" />
                  Acessar Painel
                </button>
              </div>
            </form>

          </div>

          <p className="mt-8 text-center text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
            TI Almoxarifado Interno • Estritamente Confidencial
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col antialiased">
      
      {/* ----------------- TOP NAVBAR ----------------- */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40 outline-none select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between min-h-[64px]">
          <div className="flex items-center gap-3">
            <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-150 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-zinc-950" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-zinc-950">Controle de Ativos de TI</h1>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Sistema Integrado de Almoxarifado TI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs border transition-all cursor-pointer h-9 ${
                activeTab === "admin"
                  ? "bg-zinc-105 border-zinc-350 text-zinc-950 bg-zinc-100"
                  : "border-zinc-200 hover:bg-zinc-50 text-zinc-700 bg-white"
              }`}
            >
              <Settings className="h-4 w-4" />
              Painel Admin
            </button>
            
            <button
              onClick={() => setShowDeliveryForm(true)}
              className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer h-9"
            >
              <PlusCircle className="h-4 w-4" />
              Nova Entrega
            </button>

            <button
              onClick={handleLogout}
              title="Sair do Sistema"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-50 border border-zinc-200 hover:border-rose-200 text-zinc-700 hover:text-rose-600 transition-all cursor-pointer flex items-center gap-1.5 h-9 bg-white"
            >
              <LogOut className="h-4 w-4 text-zinc-500 hover:text-rose-600" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* ----------------- MAIN GRID CONTAINER ----------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Metric Cards indicators */}
        <MetricCards deliveries={deliveries} inventory={inventory} />

        {/* Inner system module selector (Toggles) */}
        <div className="bg-zinc-100 p-1 rounded-xl border border-zinc-200 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab("stock")}
            className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "stock"
                ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/40"
                : "text-zinc-550 hover:text-zinc-900"
            }`}
          >
            <Building className="h-4 w-4 shrink-0" />
            Estoque / Inventário
          </button>
          <button
            onClick={() => setActiveTab("deliveries")}
            className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "deliveries"
                ? "bg-white text-zinc-950 shadow-xs border border-zinc-200/40"
                : "text-zinc-550 hover:text-zinc-900"
            }`}
          >
            <UserCheck className="h-4 w-4 shrink-0" />
            Ativos Entregues
          </button>
        </div>

        {/* ----------------- TAB: DELIVERIES (LISTAGEM DE ATIVOS ENTREGUES) ----------------- */}
        {activeTab === "deliveries" && (
          <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden flex flex-col">
            
            {/* Table Header & Search Filter Controls */}
            <div className="p-6 border-b border-zinc-150 bg-zinc-50/50 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-950 flex items-center gap-2 tracking-tight">
                    <Filter className="h-4 w-4 text-zinc-900" />
                    Listagem de Ativos Entregues
                  </h3>
                  <p className="text-xs text-zinc-550 mt-1 pb-0.5">
                    Pesquise e gerencie equipamentos em posse de equipes e realize devoluções, descartes ou manutenções
                  </p>
                </div>
                
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                  Limpar Filtros
                </button>
              </div>

              {/* GRID OF FILTERS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-[10px]">
                {/* 1. Colaborador */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wide">Colaborador</label>
                  <input
                    type="text"
                    value={filterColaborador}
                    onChange={(e) => setFilterColaborador(e.target.value)}
                    placeholder="Ex: Mariana"
                    className="w-full px-2.5 py-1.5 border border-zinc-200 bg-white rounded-lg focus:border-zinc-950 focus:ring-0 focus:outline-hidden text-xs transition-colors"
                  />
                </div>

                {/* 2. Setor */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wide">Setor</label>
                  <select
                    value={filterSetor}
                    onChange={(e) => setFilterSetor(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-zinc-200 bg-white rounded-lg focus:border-zinc-950 focus:ring-0 focus:outline-hidden text-xs transition-colors"
                  >
                    <option value="">Tudo</option>
                    {sectorsList.map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Item Name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wide">Equipamento</label>
                  <input
                    type="text"
                    value={filterItem}
                    onChange={(e) => setFilterItem(e.target.value)}
                    placeholder="Ex: Dell"
                    className="w-full px-2.5 py-1.5 border border-zinc-200 bg-white rounded-lg focus:border-zinc-950 focus:ring-0 focus:outline-hidden text-xs transition-colors"
                  />
                </div>

                {/* 4. Status */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wide">Situação/Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-zinc-200 bg-white rounded-lg focus:border-zinc-950 focus:ring-0 focus:outline-hidden text-xs transition-colors"
                  >
                    <option value="Tudo">Toda Situação</option>
                    {Object.values(AssetStatus).map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Period Start */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wide">Entrega de</label>
                  <input
                    type="date"
                    value={filterDataInicio}
                    onChange={(e) => setFilterDataInicio(e.target.value)}
                    className="w-full px-2.5 py-1 border border-zinc-200 bg-white rounded-lg focus:border-zinc-950 focus:ring-0 focus:outline-hidden text-xs transition-colors"
                  />
                </div>

                {/* 6. Period End */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-zinc-450 uppercase tracking-wide">Entrega até</label>
                  <input
                    type="date"
                    value={filterDataFim}
                    onChange={(e) => setFilterDataFim(e.target.value)}
                    className="w-full px-2.5 py-1 border border-zinc-200 bg-white rounded-lg focus:border-zinc-950 focus:ring-0 focus:outline-hidden text-xs transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* TABELA DE ATIVOS ENTREGUES */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-zinc-650 border-collapse">
                <thead>
                  <tr className="bg-zinc-50/60 font-semibold text-zinc-700 border-b border-zinc-200 select-none uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Item / Equipamento</th>
                    <th className="py-3 px-3">Responsável</th>
                    <th className="py-3 px-3">Setor</th>
                    <th className="py-3 px-2 text-center">Quant.</th>
                    <th className="py-3 px-3">Entregue Em</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Ações de Gestão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredDeliveries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 px-4 text-center">
                        <FolderMinus className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-gray-500">Nenhum registro encontrado</p>
                        <p className="text-xs text-gray-400 mt-1">Ajuste os filtros de pesquisa ou registre uma nova entrega</p>
                      </td>
                    </tr>
                  ) : (
                    filteredDeliveries.map((d) => {
                      const canAct = d.status !== AssetStatus.Devolvido && d.status !== AssetStatus.Descartado;
                      
                      return (
                        <tr key={d.id} className="hover:bg-zinc-50/40 transition-colors align-middle border-b border-zinc-100 last:border-0">
                          
                          {/* Item Name */}
                          <td className="py-4 px-4 text-zinc-950 text-xs max-w-[210px]">
                            <div>
                              <p className="font-bold truncate" title={d.itemName}>{d.itemName}</p>
                              {d.observacao && (
                                <p className="text-[10px] text-zinc-400 font-medium truncate max-w-[190px] mt-0.5" title={d.observacao}>
                                  Obs: {d.observacao}
                                </p>
                              )}
                              {d.termPdf && (
                                <div className="mt-1.5">
                                  <a
                                    href={d.termPdf.data}
                                    download={d.termPdf.name}
                                    className="inline-flex items-center gap-1.5 text-[9px] text-zinc-600 bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all cursor-pointer"
                                    title={`Baixar termo PDF anexado: ${d.termPdf.name}`}
                                  >
                                    <span className="text-red-500 font-bold">PDF</span> Termo
                                  </a>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Collaborator */}
                          <td className="py-4 px-3 text-zinc-805 font-bold">{d.colaborador}</td>

                          {/* Sector */}
                          <td className="py-4 px-3">
                            <span className="text-zinc-500 font-medium">{d.setor}</span>
                          </td>

                          {/* Quantity */}
                          <td className="py-4 px-2 text-center font-mono font-bold text-zinc-950">{d.quantity}</td>

                          {/* Date */}
                          <td className="py-4 px-3 text-zinc-500">{formatDateField(d.dataEntrega)}</td>

                          {/* Status Badge */}
                          <td className="py-4 px-3">{getStatusBadge(d.status)}</td>

                          {/* Management Actions */}
                          <td className="py-4 px-4 text-right">
                            {canAct ? (
                              <div className="flex items-center justify-end gap-1.5">
                                
                                {/* 1. Devolver Button */}
                                <button
                                  onClick={() => setSelectedDeliveryForReturn(d)}
                                  className="px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                  title="Registrar devolução de volta ao almoxarifado"
                                >
                                  Devolver
                                </button>

                                {/* 2. Transferir Button */}
                                <button
                                  onClick={() => {
                                    setSelectedDeliveryForTransfer(d);
                                    setTransferColaborador("");
                                    setTransferSetor(d.setor);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-zinc-50 border border-zinc-250 text-zinc-800 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                                  title="Transferir para outro colaborador"
                                >
                                  Transferir
                                </button>

                                {/* 3. Manutenção Toggle */}
                                <button
                                  onClick={() => handleToggleMaintenance(d.id)}
                                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                    d.status === AssetStatus.EmManutencao
                                      ? "bg-zinc-950 text-white border-zinc-950"
                                      : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-150"
                                  }`}
                                  title={
                                    d.status === AssetStatus.EmManutencao
                                      ? "Mudar de volta para Em Uso"
                                      : "Mudar situação para Em Manutenção"
                                  }
                                >
                                  <Wrench className="h-3.5 w-3.5" />
                                </button>

                                {/* 4. Descartar Button */}
                                <button
                                  onClick={() => setSelectedDeliveryForDiscard(d)}
                                  className="p-1.5 rounded-lg bg-zinc-50 text-rose-600 border border-zinc-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all cursor-pointer"
                                  title="Registrar descarte definitivo deste equipamento"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-3xs text-gray-400 font-bold uppercase tracking-wide italic p-1.5 block">
                                Sem pendências
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* List Footer metadata summary */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-150 text-[10px] text-zinc-500 font-bold flex flex-col md:flex-row md:items-center justify-between gap-2 uppercase tracking-wide">
              <p>Mostrando {filteredDeliveries.length} de {deliveries.length} registros totais de entregas cadastradas.</p>
              <p className="font-mono text-[9px] text-zinc-400 normal-case">Última checagem efetuada em: {new Date().toLocaleDateString("pt-BR")}</p>
            </div>
          </div>
        )}

        {/* ----------------- TAB: STOCK ----------------- */}
        {activeTab === "stock" && (
          <StockManager
            inventory={inventory}
            categories={categories}
            onAddItem={handleAddInventoryModel}
            onReplenish={handleReplenishInventory}
          />
        )}

        {/* ----------------- TAB: ADMIN ----------------- */}
        {activeTab === "admin" && (
          <AdminPanel
            sectors={sectors}
            categories={categories}
            onAddSector={handleAddSector}
            onDeleteSector={handleDeleteSector}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            history={history}
            discards={discards}
          />
        )}

      </main>

      {/* ----------------- MODAL: REGISTER NEW DELIVERY ----------------- */}
      {showDeliveryForm && (
        <DeliveryForm
          inventory={inventory}
          sectors={sectors}
          onSubmit={handleRegisterDelivery}
          onClose={() => setShowDeliveryForm(false)}
        />
      )}

      {/* ----------------- MODAL: REGISTER RETURN ----------------- */}
      {selectedDeliveryForReturn && (
        <ReturnForm
          delivery={selectedDeliveryForReturn}
          onSubmit={handleRegisterReturn}
          onClose={() => setSelectedDeliveryForReturn(null)}
        />
      )}

      {/* ----------------- MODAL: REGISTER TRANSFER ----------------- */}
      {selectedDeliveryForTransfer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in text-sm">
          <div className="bg-white rounded-xl shadow-lg border border-zinc-200 max-w-md w-full overflow-hidden">
            
            <div className="px-6 py-4 border-b border-zinc-150 bg-zinc-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-950 tracking-tight">Transferir Ativo Entregue</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Mude o responsável e setor de posse do patrimônio</p>
              </div>
              <button
                onClick={() => setSelectedDeliveryForTransfer(null)}
                className="p-1 px-2 hover:bg-zinc-200 rounded text-zinc-500 hover:text-zinc-900 font-bold transition-all"
              >
                X
              </button>
            </div>

            <form onSubmit={handleRegisterTransfer} className="p-6 space-y-4">
              {transferError && (
                <p className="p-2.5 bg-rose-50 text-rose-800 rounded font-medium text-[11px] border-l-2 border-rose-500">
                  {transferError}
                </p>
              )}

              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-150 text-xs font-medium space-y-1">
                <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Equipamento a transferir</p>
                <p className="text-zinc-900 font-semibold">{selectedDeliveryForTransfer.itemName}</p>
                <div className="flex justify-between items-center text-[10px] text-zinc-500">
                  <span>Patrimônio: <strong className="font-mono text-zinc-700">{selectedDeliveryForTransfer.code}</strong></span>
                  <span>Portador Atual: <strong>{selectedDeliveryForTransfer.colaborador}</strong></span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  Novo Colaborador Responsável *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Juliano Cesar Magalhães"
                  value={transferColaborador}
                  onChange={(e) => setTransferColaborador(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-250 rounded-lg focus:border-zinc-950 focus:ring-0 focus:outline-hidden text-xs transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  Setor do Novo Responsável *
                </label>
                <select
                  value={transferSetor}
                  onChange={(e) => setTransferSetor(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-250 bg-white rounded-lg focus:border-zinc-950 focus:ring-0 focus:outline-hidden text-xs transition-colors"
                  required
                >
                  <option value="">Selecione o setor...</option>
                  {sectorsList.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  Motivo / Justificativa da Transferência *
                </label>
                <textarea
                  placeholder="Justifique o motivo de portabilidade de posse deste material (Ex: Mudança de setor, promoção de cargo, reatribuição de mesa...)"
                  value={transferMotivo}
                  onChange={(e) => setTransferMotivo(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-zinc-250 bg-white rounded-lg focus:border-zinc-950 focus:ring-0 focus:outline-hidden text-xs transition-colors resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDeliveryForTransfer(null)}
                  className="px-3 py-1.5 border border-zinc-200 rounded-md font-bold text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                >
                  Confirmar Transferência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- MODAL: DISCARD ATIVE EQUIPMENT ----------------- */}
      {selectedDeliveryForDiscard && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in text-sm">
          <div className="bg-white rounded-xl shadow-lg border border-zinc-250 max-w-md w-full overflow-hidden">
            
            <div className="px-6 py-4 border-b border-zinc-150 bg-zinc-50/50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-950 tracking-tight">Enviar Ativo para Descarte / Baixa</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Dê baixa no patrimônio da TI de forma irrevogável</p>
              </div>
              <button
                onClick={() => setSelectedDeliveryForDiscard(null)}
                className="p-1 px-2 hover:bg-zinc-200 rounded text-zinc-400 hover:text-zinc-950 font-bold transition-all"
              >
                X
              </button>
            </div>

            <form onSubmit={handleRegisterDiscard} className="p-6 space-y-4">
              {discardError && (
                <p className="p-2.5 bg-rose-50 text-rose-800 rounded font-medium text-xs border-l-2 border-rose-500">
                  {discardError}
                </p>
              )}

              <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-150 text-xs font-medium space-y-1">
                <p className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Dando baixa em alocação</p>
                <p className="text-zinc-900 font-bold">{selectedDeliveryForDiscard.itemName}</p>
                <div className="flex justify-between items-center text-[10px] text-zinc-500">
                  <span>Código Patrimonial: <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-zinc-200 text-zinc-700">{selectedDeliveryForDiscard.code}</strong></span>
                  <span>Alocado para: <strong className="text-zinc-805">{selectedDeliveryForDiscard.colaborador}</strong></span>
                </div>
                <p className="text-[10px] text-zinc-500 font-bold mt-1 bg-zinc-100 p-1 rounded-md text-center">
                  ⚠️ Esta ação é permanente e removerá de circulação {selectedDeliveryForDiscard.quantity} un.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  Condição Geral do Material Descartado *
                </label>
                <select
                  value={discardCondicao}
                  onChange={(e) => setDiscardCondicao(e.target.value as ItemCondition)}
                  className="w-full px-3 py-2 border border-zinc-250 bg-white rounded-lg focus:border-zinc-950 focus:ring-0 focus:outline-hidden text-xs transition-colors"
                  required
                >
                  <option value={ItemCondition.Danificado}>Danificado (Perda Total / Quebrado)</option>
                  <option value={ItemCondition.NecessitaManutencao}>Necessita Manutenção Extraordinária Inviável</option>
                  <option value={ItemCondition.Regular}>Regular (Gargalo Tecnológico / Obsoleto)</option>
                  <option value={ItemCondition.Bom}>Bom (Doação / Substituição em Lote)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  Justificativa Tecnológica do Descarte *
                </label>
                <textarea
                  placeholder="Forneça de forma obrigatória os motivos de descarte, tais como quebra acidental, laudo de inviabilidade de conserto, obsolescência programada..."
                  value={discardMotivo}
                  onChange={(e) => setDiscardMotivo(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-zinc-250 bg-white rounded-lg focus:border-zinc-950 focus:ring-0 focus:outline-hidden text-xs transition-colors resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
                  Comentários Adicionais de Reciclagem
                </label>
                <textarea
                  placeholder="Ex: destinação ecológica, envio para reciclagem de lixo eletrônico autorizada, doação, etc."
                  value={discardObservacao}
                  onChange={(e) => setDiscardObservacao(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-zinc-250 bg-white rounded-lg focus:border-zinc-950 focus:ring-0 focus:outline-hidden text-xs transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedDeliveryForDiscard(null)}
                  className="px-3 py-1.5 border border-zinc-200 rounded-md font-bold text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
                >
                  Confirmar Descarte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- BOTTOM FOOTER ----------------- */}
      <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 py-8 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-semibold text-zinc-300">
            © 2026 Controle de Ativos Entregues. Desenvolvido para governança de patrimônios de TI.
          </p>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider font-bold text-zinc-500">
            <span>Totalmente Offline-First</span>
            <span className="text-zinc-800">|</span>
            <span>Validação Automática de Estoque</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
