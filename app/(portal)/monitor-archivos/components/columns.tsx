"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MonitorArchivo } from "@/_mock/mock-monitor-archivos"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, AlertCircle, CircleCheck, CircleX, CircleAlert} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DataTableColumnHeader } from "@/components/server-data-table/data-table-column-header"

const handleViewDetail = (documentId: string) => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
    const detailUrl = `${basePath}/ec/monitor-archivos/${documentId}`
    window.open(detailUrl, '_blank', 'noopener,noreferrer')
  }
const StatusCell = ({ status, message, title }: { status: boolean | null, message?: string, title: string }) => {
  const getBadgeVariant = (status: boolean | null) => {
    switch (status) {
      case true:
        return "bg-green-100 text-green-800 hover:bg-green-100 rounded-full"
      case false:
        return "bg-red-100 text-red-800 hover:bg-red-100 hover:cursor-pointer rounded-full"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100 rounded-full"
    }
  }

  if ((status === false) && message) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <span className="w-full flex items-center justify-center">
            <CircleX className={getBadgeVariant(status)} />
          </span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              {title}
            </DialogTitle>
            <DialogDescription className="pt-4 text-gray-900 font-medium">
              {message}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <span className="w-full flex items-center justify-center"> 
      {(status === true )? 
      <CircleCheck className={getBadgeVariant(status)} />
      : <CircleAlert className={getBadgeVariant(status)} />}
    </span>
  )
}

export const columns: ColumnDef<MonitorArchivo>[] = [
  {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && false)
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Seleccionar todo"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  {
    accessorKey: "trackId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Track ID" />
    ),
    cell: ({ row }) => <div className="text-sm font-medium">{row.getValue("trackId")}</div>,
  },
    {
    accessorKey: "fechaRecepcion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha Recepción" />
    ),
    cell: ({ row }) => {
      const fechaRecepcion = row.getValue("fechaRecepcion") as string;
      const fecha = fechaRecepcion.split(" ")[0];
      const hora = fechaRecepcion.split(" ")[1];
      return (<div className="text-sm flex flex-col items-center justify-center">
        <div>{fecha}</div>
        <div className="text-xs text-gray-500">
            {hora}
        </div>
    </div>)},
  },
  {
    accessorKey: "canalRecepcion",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Canal de Recepción" />
    ),
    cell: ({ row }) => <div className="text-sm">{row.getValue("canalRecepcion")}</div>,
  },
  {
    accessorKey: "identificadorCanal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Identificador" />
    ),
    cell: ({ row }) => <div className="text-sm">{row.getValue("identificadorCanal")}</div>,
  },
  {
    accessorKey: "estatus_egrid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Validación Estructura" />
    ),
    cell: ({ row }) => (
      <StatusCell 
        status={row.original.estatus_egrid} 
        message={row.original.mensaje_estatus_egrid}
        title="Error en Validación de Estructura"
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "estatus_fiscal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estatus SAT" />
    ),
    cell: ({ row }) => (
      <StatusCell 
        status={row.original.estatus_fiscal} 
        message={row.original.mensaje_estatus_fiscal}
        title="Error en Validación SAT"
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
    {
    accessorKey: "extraccion_datos_xml",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Extracción de Datos XML" />
    ),
    cell: ({ row }) => (
      <StatusCell 
        status={row.original.extraccion_datos_xml} 
        message={row.original.mensaje_extraccion_datos_xml}
        title="Error en Extracción de Datos XML"
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "estatus_comercial",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Validación Comercial" />
    ),
    cell: ({ row }) => (
      <StatusCell 
        status={row.original.estatus_comercial} 
        message={row.original.mensaje_estatus_comercial}
        title="Error en Validación Comercial"
      />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "documentos",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Archivos" />
    ),
    cell: ({ row }) => {
      const docs = row.original.documentos
      return (
        <div className="flex flex-col gap-1">
          {docs.map((doc) => (
            <span key={doc.id} className="text-xs text-gray-600 truncate max-w-[200px]" title={doc.nombre}>
              {doc.nombre}
            </span>
          ))}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => (
      <div>Acciones</div>
    ),
    cell: ({ row }) => {
      return (
        <TooltipProvider>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => handleViewDetail(row.original.id)}
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ver detalle</p>
          </TooltipContent>
        </Tooltip>
      </div>
      </TooltipProvider>  
      )
    },
  },
]
