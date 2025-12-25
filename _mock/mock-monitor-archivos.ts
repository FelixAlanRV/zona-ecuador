
export interface MonitorArchivo {
  id: string
  trackId: string
  numeroDocumento: string
  fechaRecepcion: string
  canalRecepcion: "Email" | "API" | "Portal"
  identificadorCanal: string // Email address, API key, or username based on canalRecepcion
  rfcEmisor: string
  estatus_egrid: boolean | null
  mensaje_estatus_egrid?: string
  estatus_fiscal: boolean | null
  mensaje_estatus_fiscal?: string
  extraccion_datos_xml: boolean | null
  mensaje_extraccion_datos_xml?: string
  estatus_comercial: boolean | null
  mensaje_estatus_comercial?: string
  documentos: DocumentFile[]
  historial: HistoryEvent[]
  // Additional fields for details view if needed, similar to Comprobante
  razonSocial?: string
  moneda?: string
  impuesto?: string
  valorTotal?: string
  subtotal?: string
  fechaEmision?: string
  fechaTimbrado?: string
  tipoDoc: string
  direccionCorreo?: string
}

export interface DocumentFile {
  id: string
  nombre: string
  tipo: "pdf" | "xml" | "zip" | "txt" | "spf"
  tamano: string
  fecha: string
}

export interface HistoryEvent {
  id: string
  titulo: string
  descripcion: string
  fecha: string
  accion: string
}

export const mockMonitorArchivos: MonitorArchivo[] = [
  {
    id: "1",
    trackId: "TRK-001",
    numeroDocumento: "F003-00000386",
    fechaRecepcion: "2025-11-16 14:20:00",
    canalRecepcion: "Email",
    identificadorCanal: "facturas@distribuidoranacional.com",
    rfcEmisor: "DNL920415ABC",
    estatus_egrid: true,
    estatus_fiscal:true,
    extraccion_datos_xml: true,
    estatus_comercial: true,
    razonSocial: "Distribuidora Nacional SA",
    moneda: "MXN",
    impuesto: "$2,400.00",
    valorTotal: "$17,400.00",
    fechaEmision: "2025-11-16",
    tipoDoc: "Factura",
    direccionCorreo: "milagros.ramirez@cholsolutions.com",
    documentos: [
      { id: "d1", nombre: "33_NPG_LTE6.spf", tipo: "spf", tamano: "10KB", fecha: "2025-11-16" },
      { id: "d2", nombre: "33_NPG_LTE6.pdf", tipo: "pdf", tamano: "150KB", fecha: "2025-11-16" },
      { id: "d3", nombre: "33_NPG_LTE6.xml", tipo: "xml", tamano: "25KB", fecha: "2025-11-16" }
    ],
    historial: [
      { id: "h1", titulo: "Recepción", descripcion: "Archivo recibido por Email", fecha: "2025-11-16 14:20", accion: "Sistema" },
      { id: "h2", titulo: "Validación de esquema", descripcion: "Estructura válida", fecha: "2025-11-16 14:21", accion: "Sistema" }
    ]
  },
  {
    id: "2",
    trackId: "TRK-002",
    numeroDocumento: "NC-567",
    fechaRecepcion: "2025-11-15 16:45:00",
    canalRecepcion: "API",
    identificadorCanal: "api_key_cds850220xyz_prod_2024",
    rfcEmisor: "CDS850220XYZ",
    estatus_egrid: false,
    mensaje_estatus_egrid: "El archivo XML no cumple con el esquema XSD versión 4.0. Falta el atributo 'Moneda'.",
    estatus_fiscal: null,
    extraccion_datos_xml: null,
    estatus_comercial: null,
    razonSocial: "Comercializadora del Sur SC",
    moneda: "MXN",
    impuesto: "$800.00",
    valorTotal: "$5,800.00",
    fechaEmision: "2025-11-15",
    tipoDoc: "Nota de Crédito",
    direccionCorreo: "contacto@comercializadorasur.com",
    documentos: [
      { id: "d4", nombre: "NC_567.xml", tipo: "xml", tamano: "20KB", fecha: "2025-11-15" }
    ],
    historial: [
      { id: "h3", titulo: "Recepción", descripcion: "Archivo recibido por API", fecha: "2025-11-15 16:45", accion: "Sistema" },
      { id: "h4", titulo: "Validación Estructura", descripcion: "Error en validación de esquema", fecha: "2025-11-15 16:46", accion: "Sistema" }
    ]
  },
  {
    id: "3",
    trackId: "TRK-003",
    numeroDocumento: "F-98765",
    fechaRecepcion: "2025-11-14 11:30:00",
    canalRecepcion: "Portal",
    identificadorCanal: "jgarcia.proveedora",
    rfcEmisor: "PIS900315DEF",
    estatus_egrid: true,
    estatus_fiscal: false,
    mensaje_estatus_fiscal: "El RFC del emisor no se encuentra en la lista de contribuyentes obligados (LCO).",
    extraccion_datos_xml: true,
    estatus_comercial: null,
    razonSocial: "Proveedora Industrial SRL",
    moneda: "USD",
    impuesto: "$1,200.00",
    valorTotal: "$8,700.00",
    fechaEmision: "2025-11-14",
    tipoDoc: "Factura",
    direccionCorreo: "finanzas@proveedoraindustrial.com",
    documentos: [
      { id: "d5", nombre: "F_98765.pdf", tipo: "pdf", tamano: "120KB", fecha: "2025-11-14" },
      { id: "d6", nombre: "F_98765.xml", tipo: "xml", tamano: "30KB", fecha: "2025-11-14" }
    ],
    historial: [
      { id: "h5", titulo: "Recepción", descripcion: "Carga Portal", fecha: "2025-11-14 11:30", accion: "Usuario" }
    ]
  },
  {
    id: "4",
    trackId: "TRK-004",
    numeroDocumento: "FAC-2024-001234",
    fechaRecepcion: "2025-11-13 09:20:00",
    canalRecepcion: "Portal",
    identificadorCanal: "mrodriguez.almacenes",
    rfcEmisor: "AGO770510GHI",
    estatus_egrid: true,
    estatus_fiscal: true,
    extraccion_datos_xml: false,
    mensaje_extraccion_datos_xml: "Error al extraer el nodo 'Conceptos'. Estructura XML malformada.",
    estatus_comercial: false,
    mensaje_estatus_comercial: "La orden de compra referenciada no existe o ya ha sido cerrada.",
    razonSocial: "Almacenes González SA de CV",
    moneda: "MXN",
    impuesto: "$3,200.00",
    valorTotal: "$23,200.00",
    fechaEmision: "2025-11-13",
    tipoDoc: "Factura",
    direccionCorreo: "pagos@almacenesgonzalez.mx",
    documentos: [
      { id: "d7", nombre: "FAC_2024_001234.spf", tipo: "spf", tamano: "500KB", fecha: "2025-11-13" }
    ],
    historial: [
      { id: "h6", titulo: "Recepción", descripcion: "Carga vía Portal", fecha: "2025-11-13 09:20", accion: "Sistema" }
    ]
  },
  {
    id: "5",
    trackId: "TRK-005",
    numeroDocumento: "A1-9876",
    fechaRecepcion: "2025-11-12 13:10:00",
    canalRecepcion: "API",
    identificadorCanal: "api_key_tys881205jkl_dev_2024",
    rfcEmisor: "TYS881205JKL",
    estatus_egrid: null,
    estatus_fiscal: null,
    extraccion_datos_xml: null,
    estatus_comercial: null,
    razonSocial: "Tecnología y Servicios SA",
    moneda: "MXN",
    impuesto: "$1,600.00",
    valorTotal: "$11,600.00",
    fechaEmision: "2025-11-12",
    tipoDoc: "Factura",
    direccionCorreo: "facturacion@tecnologiayservicios.com",
    documentos: [
      { id: "d8", nombre: "A1_9876.xml", tipo: "xml", tamano: "28KB", fecha: "2025-11-12" }
    ],
    historial: [
      { id: "h7", titulo: "Recepción", descripcion: "Recibido por API", fecha: "2025-11-12 13:10", accion: "Sistema" }
    ]
  },
  {
    id: "6",
    trackId: "TRK-006",
    numeroDocumento: "F004-00000521",
    fechaRecepcion: "2025-11-17 15:30:00",
    canalRecepcion: "Email",
    identificadorCanal: "cuentaspagar@importadoranorte.com.mx",
    rfcEmisor: "IDN950822MNO",
    estatus_egrid: true,
    estatus_fiscal: true,
    extraccion_datos_xml: true,
    estatus_comercial: true,
    razonSocial: "Importadora del Norte SA de CV",
    moneda: "MXN",
    impuesto: "$3,600.00",
    valorTotal: "$26,100.00",
    fechaEmision: "2025-11-17",
    tipoDoc: "Factura",
    direccionCorreo: "facturas@importadoranorte.com.mx",
    documentos: [
      { id: "d9", nombre: "F004_00000521.pdf", tipo: "pdf", tamano: "160KB", fecha: "2025-11-17" },
      { id: "d10", nombre: "F004_00000521.xml", tipo: "xml", tamano: "32KB", fecha: "2025-11-17" }
    ],
    historial: []
  },
  {
    id: "7",
    trackId: "TRK-007",
    numeroDocumento: "SLI-2025-789",
    fechaRecepcion: "2025-11-18 10:15:00",
    canalRecepcion: "API",
    identificadorCanal: "api_key_sli910615pqr_prod_2025",
    rfcEmisor: "SLI910615PQR",
    estatus_egrid: false,
    mensaje_estatus_egrid: "Error de sintaxis en el archivo XML. Línea 45, columna 12.",
    estatus_fiscal: null,
    extraccion_datos_xml: false,
    mensaje_extraccion_datos_xml: "No se pudo parsear el XML debido a errores de sintaxis.",
    estatus_comercial: null,
    razonSocial: "Servicios Logísticos Integrales SRL",
    moneda: "USD",
    impuesto: "$2,100.00",
    valorTotal: "$15,225.00",
    fechaEmision: "2025-11-18",
    tipoDoc: "Factura",
    direccionCorreo: "admin@logisticaintegral.com",
    documentos: [
      { id: "d11", nombre: "SLI_2025_78.xml", tipo: "xml", tamano: "15KB", fecha: "2025-11-18" }
    ],
    historial: []
  },
  {
    id: "8",
    trackId: "TRK-008",
    numeroDocumento: "CD-F-2025-456",
    fechaRecepcion: "2025-11-18 16:45:00",
    canalRecepcion: "Portal",
    identificadorCanal: "lsanchez.construcciones",
    rfcEmisor: "CYD870925STU",
    estatus_egrid: true,
    estatus_fiscal: false,
    mensaje_estatus_fiscal: "El certificado del sello digital (CSD) ha sido revocado.",
    extraccion_datos_xml: true,
    estatus_comercial: null,
    razonSocial: "Construcciones y Desarrollos SA",
    moneda: "MXN",
    impuesto: "$4,800.00",
    valorTotal: "$34,800.00",
    fechaEmision: "2025-11-18",
    tipoDoc: "Factura",
    direccionCorreo: "contabilidad@construccionescd.mx",
    documentos: [
      { id: "d12", nombre: "CD_F_2025_456.pdf", tipo: "pdf", tamano: "200KB", fecha: "2025-11-18" },
      { id: "d13", nombre: "CD_F_2025_456.xml", tipo: "xml", tamano: "35KB", fecha: "2025-11-18" }
    ],
    historial: []
  },
  {
    id: "9",
    trackId: "TRK-009",
    numeroDocumento: "EIB-FAC-001892",
    fechaRecepcion: "2025-11-19 12:00:00",
    canalRecepcion: "Email",
    identificadorCanal: "recepcion.facturas@equiposbajio.com.mx",
    rfcEmisor: "EIB930710VWX",
    estatus_egrid: true,
    estatus_fiscal: true,
    extraccion_datos_xml: true,
    estatus_comercial: false,
    mensaje_estatus_comercial: "El monto total de la factura excede el límite autorizado para este proveedor.",
    razonSocial: "Equipos Industriales del Bajío SA de CV",
    moneda: "MXN",
    impuesto: "$5,200.00",
    valorTotal: "$37,700.00",
    fechaEmision: "2025-11-19",
    tipoDoc: "Factura",
    direccionCorreo: "facturacion@equiposbajio.com.mx",
    documentos: [
      { id: "d14", nombre: "EIB_FAC_001892.pdf", tipo: "pdf", tamano: "210KB", fecha: "2025-11-19" },
      { id: "d15", nombre: "EIB_FAC_001892.xml", tipo: "xml", tamano: "38KB", fecha: "2025-11-19" }
    ],
    historial: []
  },
  {
    id: "10",
    trackId: "TRK-010",
    numeroDocumento: "MCP-2025-1123",
    fechaRecepcion: "2025-11-20 08:30:00",
    canalRecepcion: "API",
    identificadorCanal: "api_key_mcp960330yza_prod_2025",
    rfcEmisor: "MCP960330YZA",
    estatus_egrid: true,
    estatus_fiscal: true,
    extraccion_datos_xml: true,
    estatus_comercial: true,
    razonSocial: "Materiales de Construcción del Pacífico SRL",
    moneda: "MXN",
    impuesto: "$2,800.00",
    valorTotal: "$20,300.00",
    fechaEmision: "2025-11-20",
    tipoDoc: "Factura",
    direccionCorreo: "ventas@materialespacifico.mx",
    documentos: [
      { id: "d16", nombre: "MCP_2025_1123.pdf", tipo: "pdf", tamano: "180KB", fecha: "2025-11-20" },
      { id: "d17", nombre: "MCP_2025_1123.xml", tipo: "xml", tamano: "31KB", fecha: "2025-11-20" }
    ],
    historial: []
  }
]
