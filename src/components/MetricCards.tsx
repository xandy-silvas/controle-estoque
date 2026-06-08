import React from "react";
import { Package, AlertTriangle, Trash2 } from "lucide-react";
import { AssetDelivery, AssetStatus, InventoryItem } from "../types";

interface MetricCardsProps {
  deliveries: AssetDelivery[];
  inventory: InventoryItem[];
}

export const MetricCards: React.FC<MetricCardsProps> = ({ deliveries, inventory }) => {
  const totalAvailable = inventory.reduce((sum, item) => sum + item.availableQuantity, 0);

  const lowStockCount = inventory.filter((item) => item.availableQuantity <= 1).length;

  const discarded = deliveries
    .filter((d) => d.status === AssetStatus.Descartado)
    .reduce((sum, item) => sum + item.quantity, 0);

  const metrics = [
    {
      id: "metric-available",
      title: "Equipamentos Disponíveis",
      value: totalAvailable,
      description: "Unidades em estoque para alocação",
      icon: Package,
      color: "border border-zinc-200/80 bg-white/70 text-zinc-900",
      iconBg: "bg-zinc-100 text-zinc-800",
    },
    {
      id: "metric-low-stock",
      title: "Baixo Estoque",
      value: lowStockCount,
      description: "Itens com estoque em nível crítico (≤ 1 un.)",
      icon: AlertTriangle,
      color: "border border-zinc-200/80 bg-white/70 text-zinc-900",
      iconBg: lowStockCount > 0 ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-zinc-100 text-zinc-700",
    },
    {
      id: "metric-discarded",
      title: "Descartados",
      value: discarded,
      description: "Retirados definitivamente de circulação",
      icon: Trash2,
      color: "border border-zinc-200/80 bg-white/70 text-zinc-900",
      iconBg: "bg-zinc-100 text-zinc-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
      {metrics.map((metric) => {
        const IconComponent = metric.icon;
        return (
          <div
            key={metric.id}
            id={metric.id}
            className={`p-5 rounded-xl transition-all duration-150 hover:border-zinc-350 hover:shadow-xs ${metric.color}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  {metric.title}
                </p>
                <p className="text-3xl font-light font-sans mt-2 tracking-tight text-zinc-900">
                  {metric.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${metric.iconBg}`}>
                <IconComponent className="h-4 w-4" />
              </div>
            </div>
            <p className="text-[11px] mt-3 text-zinc-400 font-normal leading-relaxed">
              {metric.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};
