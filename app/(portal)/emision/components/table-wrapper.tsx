"use client"

import * as React from "react"
import { useDataTable } from "@/components/server-data-table/hooks/use-data-table"
import { DataTable } from "@/components/server-data-table/data-table"
import { Comprobante } from "../data/mock-comprobantes"
import { columns } from "./columns"
import { filterFields } from "./filter-fields"
import { cn } from "@/lib/utils"
import { useSettingsContext } from "@/utils/context/settings-context"

interface ComprobantesTableWrapperProps {
  data: Comprobante[]
  pageCount: number
  isLoading?: boolean
  onTableReady?: (table: any) => void
}

export function ComprobantesTableWrapper({ 
  data, 
  pageCount, 
  isLoading = false,
  onTableReady
}: ComprobantesTableWrapperProps) {
  const settings = useSettingsContext();
  
  const defaultHiddenColumns = {
    fechaTimbrado: false,
    impuesto: false,
  }

  const isNavMini = settings.themeLayout === 'mini'

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    initialState: {
      sorting: [{ id: "fechaEmision", desc: true }],
      columnVisibility: defaultHiddenColumns,
    },
    getRowId: (row: Comprobante) => row.id,
    shallow: false,
    history: "push",
    storageKey: "comprobantes-recibidos-table",
  })

  // Notify parent when table is ready
  React.useEffect(() => {
    if (onTableReady) {
      onTableReady(table)
    }
  }, [table, onTableReady])
  
  return (
    <div className={cn("space-y-4 overflow-hidden pr-6 w-full",
      isNavMini? "w-[calc(90vw)]" :"w-[calc(90vw-150px)]" 
    )}>
      <DataTable table={table} isLoading={isLoading}>
      </DataTable>
    </div>
  )
}
