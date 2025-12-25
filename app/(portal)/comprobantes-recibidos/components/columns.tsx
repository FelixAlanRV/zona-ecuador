"use client"

import { DataTableColumnHeader } from "@/components/server-data-table/data-table-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, FileText, FileCode, Zap, CheckCircle, Ban, FileType, FileCode2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ColumnDef, Row } from "@tanstack/react-table"
import { Comprobante } from "../data/mock-comprobantes"
import { toast } from "sonner"
import { apiUrl } from "@/lib/api-client"
import { useState } from "react"

// Componente de acciones
const AccionesCell = ({ row }: { row: Row<Comprobante> }) => {
  const comprobante = row.original as Comprobante
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

  const handleViewDetail = (documentId: string) => {
    const detailUrl = `${basePath}/comprobantes-recibidos/${documentId}`
    window.open(detailUrl, '_blank', 'noopener,noreferrer')
  }

  const handleDownloadPDF = async (url: string) => {
    try {
      const response = await fetch(apiUrl(`/api/comprobantes/download-pdf`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      })
      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch {
      toast.error("Error al descargar el PDF")
    }
  }

  const handleDownloadXML = async (url: string) => {
    try {
      const response = await fetch(apiUrl(`/api/comprobantes/download-xml`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      })
      const data = await response.json()

      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch {
      toast.error("Error al descargar el XML")
    }
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-0.4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleViewDetail(comprobante.id)}
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ver detalle</p>
          </TooltipContent>
        </Tooltip>

        {comprobante.pdfUrl ?
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleDownloadPDF(comprobante.pdfUrl!)}
              >
                <FileType className="h-4 w-4 text-red-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Descargar PDF</p>
            </TooltipContent>
          </Tooltip>
          : <div className="h-8 w-8 p-0"></div>}

        {comprobante.xmlUrl ?
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleDownloadXML(comprobante.xmlUrl!)}
              >
                <FileCode2 className="h-4 w-4 text-blue-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Descargar XML</p>
            </TooltipContent>
          </Tooltip>
          : <div className="h-8 w-8 p-0"></div>}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Zap className="h-4 w-4 text-yellow-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reenviar validación tributaria</p>
          </TooltipContent>
        </Tooltip>

        {comprobante.estado_comercial !== false && comprobante.estado_comercial !== true && comprobante.estado === "vigente" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Aceptar</p>
            </TooltipContent>
          </Tooltip>
        )}

        {comprobante.estado_comercial !== false && comprobante.estado_comercial !== true && comprobante.estado === "vigente" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Ban className="h-4 w-4 text-red-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rechazar</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}

// Definición de las columnas
export const columns: ColumnDef<Comprobante>[] = [
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
    accessorKey: "serie",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Serie" />
    ),
    cell: ({ row }) => <div className="text-sm font-medium">{row.getValue("serie")}</div>,
  },
  {
    accessorKey: "folio",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Folio" />
    ),
    cell: ({ row }) => <div className="text-sm ">{row.getValue("folio")}</div>,
  },
  {
    accessorKey: "tipoDoc",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={
          <div className="flex flex-col text-center">
            <span>Tipo de</span>
            <span>documento</span>
          </div>
        }
      />
    ),
    cell: ({ row }) => <div className="text-xs overflow-auto">{row.getValue("tipoDoc")}</div>,
  },


  {
    id: "razonSocial",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Emisor" />,
    cell: ({ row }) => {
      const rfc = row.original.rfc
      const razonSocial = row.original.razonSocial

      return (
        <div className="flex flex-col gap-1 items-start">
          <div className="inline-block text-left">
            <div className="text-xs font-bold">{rfc}</div>
            <div className="text-xs text-gray-500 overflow-auto">{razonSocial}</div>
          </div>
        </div>
      )
    },
  },



  {
    id: "monto",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monto" />
    ),
    cell: ({ row }) => {
      const monto = row.original.valorTotal
      const moneda = row.original.moneda

      return (
        <div className="flex flex-col items-start"> {/* contenedor al inicio */}
          <div className="inline-block text-center"> {/* bloque pequeño centrado entre sí */}
            <div className="text-xs font-bold block">{monto}</div>
            <div className="text-xs text-gray-500 block">{moneda}</div>
          </div>
        </div>
      )
    },
  }
  ,
  {
    accessorKey: "emision",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={
          <div className="flex flex-col text-center">
            <span>Fecha</span>
            <span>Emision</span>
          </div>
        }
      />
    ),
    cell: ({ row }) => {
      const fechaRecepcion = row.getValue("recepcion") as string;

      // Separar fecha y hora
      const fecha = new Date(fechaRecepcion).toLocaleDateString();
      const hora = new Date(fechaRecepcion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return (
        <div className="flex flex-col items-start"> {/* contenedor al inicio */}
          <div className="inline-block text-center"> {/* bloque pequeño centrado entre sí */}
            <span className="text-xs text-gray-600 block">{fecha}</span>
            <span className="text-xs text-gray-500 block">{hora}</span>
          </div>
        </div>
      );
    },
  },


  // Reemplaza las columnas de "estado", "reglas_comerciales" y "estado_comercial" con estas versiones:

  // COLUMNA: Estatus SAT
  {
    accessorKey: "estado",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={
          <div className="flex flex-col text-center">
            <span>Estatus</span>
            <span>SAT</span>
          </div>
        }
      />
    ),
    cell: ({ row }) => {
      const estado = row.getValue("estado") as string
      const fechaConsulta = row.original.fechaConsulta

      // Separar fecha y hora
      const fecha = new Date(fechaConsulta).toLocaleDateString()
      const hora = new Date(fechaConsulta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      return (
        <div className="flex flex-col gap-1 items-start">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant={estado === "vigente" ? "default" : "destructive"}
                className={
                  estado === "vigente"
                    ? "bg-green-100 text-green-800 hover:bg-green-100 cursor-pointer"
                    : "bg-red-100 text-red-800 hover:bg-red-100 cursor-pointer"
                }
              >
                {estado === "vigente" ? "Vigente" : "Cancelada"}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col text-center">
                <span className="font-bold">{fecha}</span>
                <span className="font-bold">{hora}</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
  },

  // COLUMNA: Reglas Comerciales
  {
    accessorKey: "reglas_comerciales",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={
          <div className="flex flex-col text-center">
            <span>Reglas</span>
            <span>Comerciales</span>
          </div>
        }
      />
    ),
    cell: ({ row }) => {
      const status = row.original.validacionComercial as "valido" | "no_valido" | "pendiente"
      const fechaConsulta = row.original.fechaConsulta

      const getBadgeClass = (status: string) => {
        switch (status) {
          case "valido":
            return "bg-green-100 text-green-800 hover:bg-green-100 cursor-pointer"
          case "no_valido":
            return "bg-red-100 text-red-800 hover:bg-red-100 cursor-pointer"
          default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-100 cursor-pointer"
        }
      }

      const getLabel = (status: string) => {
        switch (status) {
          case "valido":
            return "Válido"
          case "no_valido":
            return "No Válido"
          default:
            return "Pendiente"
        }
      }

      // Separar fecha y hora
      const fecha = new Date(fechaConsulta).toLocaleDateString()
      const hora = new Date(fechaConsulta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      return (
        <div className="flex flex-col gap-1 items-start">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className={getBadgeClass(status)}>
                {getLabel(status)}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col text-center">
                <span className="font-bold">{fecha}</span>
                <span className="font-bold">{hora}</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
  },

  // COLUMNA: Aprobación Comercial
  {
    accessorKey: "estado_comercial",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={
          <div className="flex flex-col text-center">
            <span>Aprobación</span>
            <span>Comercial</span>
          </div>
        }
      />
    ),
    cell: ({ row }) => {
      const estadoComercial = row.getValue("estado_comercial") as boolean | null
      const fechaConsulta = row.original.fechaConsulta

      // Separar fecha y hora
      const fecha = new Date(fechaConsulta).toLocaleDateString()
      const hora = new Date(fechaConsulta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      return (
        <div className="flex flex-col gap-1 items-start">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant={estadoComercial === false ? "destructive" : "default"}
                className={
                  estadoComercial === true
                    ? "bg-green-100 text-green-800 hover:bg-green-100 cursor-pointer"
                    : estadoComercial === false
                      ? "bg-red-100 text-red-800 hover:bg-red-100 cursor-pointer"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100 cursor-pointer"
                }
              >
                {estadoComercial === true ? "Aceptado" : estadoComercial === false ? "Rechazado" : "Pendiente"}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col text-center">
                <span className="font-bold">{fecha}</span>
                <span className="font-bold">{hora}</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      )
    },
  },



  // {
  //   accessorKey: "razonSocial",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Razón Social" />
  //   ),
  //   cell: ({ row }) => <div className="text-sm">{row.getValue("razonSocial")}</div>,
  // },
  // {
  //   accessorKey: "rfc",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="RFC" />
  //   ),
  //   cell: ({ row }) => <div className="text-sm font-mono">{row.getValue("rfc")}</div>,
  // },


  {
    accessorKey: "recepcion",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={
          <div className="flex flex-col text-center">
            <span>Fecha</span>
            <span>Recepción</span>
          </div>
        }
      />
    ),
    cell: ({ row }) => {
      const fechaRecepcion = row.getValue("recepcion") as string;

      // Separar fecha y hora
      const fecha = new Date(fechaRecepcion).toLocaleDateString();
      const hora = new Date(fechaRecepcion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      return (
        <div className="flex flex-col items-start"> {/* contenedor al inicio */}
          <div className="inline-block text-center"> {/* bloque pequeño centrado entre sí */}
            <span className="text-xs text-gray-600 block">{fecha}</span>
            <span className="text-xs text-gray-500 block">{hora}</span>
          </div>
        </div>
      );
    },
  }
  ,

  // {
  //   accessorKey: "fechaTimbrado",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Fecha Timbrado" />
  //   ),
  //   cell: ({ row }) => <div className="text-sm text-gray-600">{row.getValue("fechaTimbrado")}</div>,
  // },
  // {
  //   accessorKey: "moneda",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Moneda" />
  //   ),
  //   cell: ({ row }) => <div className="text-sm">{row.getValue("moneda")}</div>,
  // },
  // {
  //   accessorKey: "impuesto",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Impuesto" />
  //   ),
  //   cell: ({ row }) => <div className="text-sm">{row.getValue("impuesto")}</div>,
  // },
  // {
  //   accessorKey: "valorTotal",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Valor Total" />
  //   ),
  //   cell: ({ row }) => (
  //     <div className="text-right text-sm font-semibold">
  //       {row.getValue("valorTotal")}
  //     </div>
  //   ),
  // },

  {
    id: "acciones",
    header: () => (
      <div className="text-center">Acciones</div> // Alinea el header al centro
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center"> {/* centra vertical y horizontal */}
        <AccionesCell row={row} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  }

]
