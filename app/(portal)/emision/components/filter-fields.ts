import { type DataTableFilterField } from "@/components/server-data-table/types"
import { Comprobante } from "../data/mock-comprobantes"

export const filterFields: DataTableFilterField<Comprobante>[] = [
  {
    id: "razonSocial",
    label: "Buscar",
    placeholder: "Buscar por RFC, Razón social, Número de documento...",
  },
  {
    id: "tipoDoc",
    label: "Tipo de documento",
    options: [
      { label: "Factura", value: "Factura" },
      { label: "Nota de Crédito", value: "Nota de Crédito" },
    ],
  },
  {
    id: "estado",
    label: "Estatus SAT",
    options: [
      { label: "Vigente", value: "vigente" },
      { label: "Cancelada", value: "cancelada" },
    ],
  },
  {
    id: "estado_comercial",
    label: "Aprobación Comercial",
    options: [
      { label: "Aceptado", value: "true" },
      { label: "Rechazado", value: "false" },
      { label: "Pendiente", value: "null" },
    ],
  },
]
