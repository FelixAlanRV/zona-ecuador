'use client'
import { useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Client {
  id: string
  name: string
  taxId: string
}

interface ClientState {
  selectedClient: Client | null
  setSelectedClient: (client: Client) => void
  clearSelectedClient: () => void
  validateSelectedClient: (availableClients: Client[]) => void
  // Nuevo estado para manejar la hidratación
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

export const useClientStore = create<ClientState>()(
  persist(
    (set, get) => ({
      selectedClient: null,
      _hasHydrated: false,
      
      setSelectedClient: (client) => {
        set({ selectedClient: client })
      },
      clearSelectedClient: () => set({ selectedClient: null }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      
      // Valida si el cliente seleccionado existe en la lista de clientes disponibles
      validateSelectedClient: (availableClients) => {
        const { selectedClient } = get()
        
        if (!selectedClient || !availableClients?.length) {
          set({ selectedClient: null })
          return
        }
        
        // Verificar si el cliente seleccionado existe en la lista de clientes disponibles
        const clientExists = availableClients.some(
          client => client.taxId === selectedClient.taxId
        )
        
        if (!clientExists) {
          // Si no existe, limpiar la selección y seleccionar el primero disponible
          set({ selectedClient: availableClients[0] })
        } else {
          console.log('Client exists and is valid')
        }
      }
    }),
    {
      name: 'client-storage-portal-mx',
      onRehydrateStorage: () => (state) => {
        // Este callback se ejecuta después de que el estado se hidrate
        state?.setHasHydrated(true)
      },
    }
  )
)

// Hook personalizado que maneja la hidratación
export const useClientStoreHydrated = () => {
  const store = useClientStore()
  
  // Si no se ha hidratado, devolver valores por defecto
  if (!store._hasHydrated) {
    return {
      ...store,
      selectedClient: null, // Valor por defecto durante la hidratación
    }
  }
  
  return store
}

// Hook para debuggear el localStorage
export const useDebugLocalStorage = () => {
  useEffect(() => {
    // Solo en el cliente
    if (typeof window !== 'undefined') {
      const storageData = localStorage.getItem('client-storage')
      if (storageData) {
        try {
          const parsed = JSON.parse(storageData)
        } catch (e) {
          console.log('Error parsing localStorage:', e)
        }
      }
    }
  }, [])
}