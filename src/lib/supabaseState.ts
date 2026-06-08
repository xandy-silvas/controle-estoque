import { supabase } from "./supabase";
import {
  InventoryItem,
  AssetDelivery,
  HistoryLog,
  DiscardLog,
} from "../types";

export interface AppStatePayload {
  inventory: InventoryItem[];
  deliveries: AssetDelivery[];
  history: HistoryLog[];
  discards: DiscardLog[];
  sectors: string[];
  categories: string[];
}

const STATE_ROW_ID = "global";

export const loadAppState = async (): Promise<AppStatePayload | null> => {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("inventory_state")
      .select("payload")
      .eq("id", STATE_ROW_ID)
      .single();

    if (error) {
      console.warn("Supabase loadAppState error:", error.message);
      return null;
    }

    return data?.payload ?? null;
  } catch (error) {
    console.warn("Supabase loadAppState exception:", error);
    return null;
  }
};

export const saveAppState = async (payload: AppStatePayload) => {
  if (!supabase) return;

  try {
    const { error } = await supabase
      .from("inventory_state")
      .upsert({ id: STATE_ROW_ID, payload });

    if (error) {
      console.warn("Supabase saveAppState error:", error.message);
    }
  } catch (error) {
    console.warn("Supabase saveAppState exception:", error);
  }
};
