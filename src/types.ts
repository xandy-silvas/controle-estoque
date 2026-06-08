export enum AssetStatus {
  EmUso = "Em Uso",
  Devolvido = "Devolvido",
  EmManutencao = "Em Manutenção",
  Transferido = "Transferido",
  Descartado = "Descartado"
}

export enum ItemCondition {
  Excelente = "Excelente",
  Bom = "Bom",
  Regular = "Regular",
  NecessitaManutencao = "Necessita Manutenção",
  Danificado = "Danificado"
}

export interface InventoryItem {
  id: string;
  name: string;
  code?: string; // Código patrimônio
  category: string;
  totalQuantity: number;
  availableQuantity: number;
}

export interface AssetDelivery {
  id: string;
  itemId: string; // vincula ao InventoryItem
  itemName: string;
  code?: string;
  quantity: number;
  colaborador: string;
  setor: string;
  dataEntrega: string; // ISO format YYYY-MM-DD
  motivo: string;
  observacao?: string;
  status: AssetStatus;
  dataDevolucao?: string;
  condicaoDevolucao?: ItemCondition;
  historicoId?: string;
  termPdf?: { name: string; data: string; };
}

export interface HistoryLog {
  id: string;
  timestamp: string; // Date string
  action: "Entrega" | "Devolução" | "Manutenção" | "Transferência" | "Descarte" | "Ajuste de Estoque";
  itemName: string;
  code?: string;
  colaborador?: string;
  setor?: string;
  quantity: number;
  details: string;
  statusAnterior?: string;
  statusNovo?: string;
}

export interface DiscardLog {
  id: string;
  deliveryId?: string;
  itemName: string;
  code?: string;
  quantity: number;
  colaboradorOriginal?: string;
  setorOriginal?: string;
  dataDescarte: string;
  condicao: ItemCondition | string;
  motivo: string;
  observacao?: string;
}
