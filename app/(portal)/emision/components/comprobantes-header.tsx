"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar } from 'lucide-react'
import { Table } from "@tanstack/react-table"
import { DataTableFacetedFilter } from "@/components/server-data-table/ui/data-table-faceted-filter"
import { filterFields } from "./filter-fields"

import { Comprobante } from "../data/mock-comprobantes"

interface ComprobantesHeaderProps {
  table: Table<Comprobante> | null
}

export function ComprobantesHeader({ table }: ComprobantesHeaderProps) {
  const tipoDocFilter = filterFields.find(f => f.id === "tipoDoc")
  const estadoFilter = filterFields.find(f => f.id === "estado")
  const estadoComercialFilter = filterFields.find(f => f.id === "estado_comercial")

  return (
    <div className="space-y-4 rounded-lg bg-white px-6 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Comprobantes Emitidos
        </h1>
      </div>

      <div className="flex items-center gap-4 mt-8 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            Fecha de ingreso
          </label>
          <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              01/Dic/2025 - 07/Dic/2025
            </span>
          </div>
        </div>

        {table && tipoDocFilter && (
          <div className="flex items-center gap-2">
            <DataTableFacetedFilter
              column={table.getColumn("tipoDoc")}
              title={tipoDocFilter.label}
              options={tipoDocFilter.options || []}
            />
          </div>
        )}

        {table && estadoFilter && (
          <div className="flex items-center gap-2">
            <DataTableFacetedFilter
              column={table.getColumn("estado")}
              title={estadoFilter.label}
              options={estadoFilter.options || []}
            />
          </div>
        )}

        {table && estadoComercialFilter && (
          <div className="flex items-center gap-2">
            <DataTableFacetedFilter
              column={table.getColumn("estado_comercial")}
              title={estadoComercialFilter.label}
              options={estadoComercialFilter.options || []}
            />
          </div>
        )}

        <div className="flex flex-1 items-center gap-2 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Buscar por RFC, Razón social..."
              className="pl-9"
              value={(table?.getColumn("razonSocial")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table?.getColumn("razonSocial")?.setFilterValue(event.target.value)
              }
            />
          </div>
          <Button className="bg-gray-900 hover:bg-gray-800">
            <Search className="mr-2 h-4 w-4" />
            Avanzada
          </Button>
        </div>
      </div>
    </div>
  )
}
