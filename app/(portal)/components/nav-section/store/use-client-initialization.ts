// hooks/use-client-initialization.ts
'use client'
import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useClientStoreHydrated, useClientStore } from './use-client-store'

/**
 * Hook que inicializa el cliente seleccionado independientemente del CompanySwitcher
 * Debe usarse en componentes que necesiten acceso al selectedClient
 */
export const useClientInitialization = () => {
  const { data: session } = useSession()
  const { 
    selectedClient, 
    setSelectedClient, 
    validateSelectedClient, 
    _hasHydrated 
  } = useClientStoreHydrated()

  // Ref para evitar múltiples inicializaciones
  const hasInitialized = useRef(false)

  // Solo ejecutar la inicialización una vez después de la hidratación
  useEffect(() => {
    
    // Solo ejecutar una vez después de la hidratación y si hay empresas disponibles
    if (!_hasHydrated || hasInitialized.current || !session?.user?.clients?.length) return
    hasInitialized.current = true
    
    // Validar el cliente seleccionado contra las empresas disponibles
    validateSelectedClient(session.user.clients)
    
    // Si después de la validación no hay cliente seleccionado, seleccionar el primero
    // Usamos setTimeout para asegurar que la validación se complete primero
    setTimeout(() => {
      const currentSelected = useClientStore.getState().selectedClient
      if (!currentSelected && session?.user?.clients?.length) {
        setSelectedClient(session.user.clients[0])
      }
    }, 0)
    
  }, [_hasHydrated, session?.user?.clients, validateSelectedClient, setSelectedClient])

  return {
    selectedClient,
    _hasHydrated,
    isReady: _hasHydrated && (selectedClient !== null || !session?.user?.clients?.length)
  }
}