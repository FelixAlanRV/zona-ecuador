import type { VisibilityState } from "@tanstack/react-table";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 1. Definimos la forma del estado y las acciones
interface TableSettingsState {
  // Guardará la visibilidad por cada clave de tabla. Ej: { 'users-table': { name: false, email: true } }
  tablesVisibility: Record<string, VisibilityState>;
  setTableVisibility: (tableKey: string, visibility: VisibilityState) => void;
}

// 2. Creamos el store con el middleware `persist`
export const useTableSettingsStore = create<TableSettingsState>()(
  persist(
    (set) => ({
      // Estado inicial
      tablesVisibility: {},
      
      // Acción para actualizar la visibilidad de una tabla específica
      setTableVisibility: (tableKey, visibility) =>
        set((state) => ({
          tablesVisibility: {
            ...state.tablesVisibility, // Mantenemos la visibilidad de otras tablas
            [tableKey]: visibility,     // Actualizamos la de la tabla actual
          },
        })),
    }),
    {
      name: "table-settings-store", // Nombre de la clave en localStorage
      storage: createJSONStorage(() => localStorage), // (Opcional) Especifica localStorage
    }
  )
);