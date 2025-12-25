export interface Comprobante {
  id: string
  tipoDoc: string
  estado: "vigente" | "cancelada"
  fechaConsulta: string
  validacionComercial: string
  canal: "Email" | "API" | "Manual"
  razonSocial: string
  rfc: string
  serie: string
  folio: string
  recepcion: string
  fechaEmision: string
  fechaTimbrado: string
  moneda: string
  impuesto: string
  valorTotal: string
  estado_comercial: boolean | null
  // Campos adicionales para la vista de detalle
  subtotal?: string
  direccionCorreo?: string
  remitenteEnvio?: string
  aprobacionComercial?: string
  fechaCarga?: string
  versiones?: DocumentVersion[]
  documentos?: DocumentFile[]
  historial?: HistoryEvent[]
  pdfUrl?: string
  xmlUrl?: string
}

export interface DocumentVersion {
  id: string
  version: string
  fecha: string
  estado: string
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

export const mockComprobantes: Comprobante[] = [
  {
    id: "1",
    tipoDoc: "Factura",
    estado: "vigente",
    fechaConsulta: "2025-11-17 10:30:00",
    canal: "Email",
    razonSocial: "Distribuidora Nacional SA",
    rfc: "DNL920415ABC",
    serie: "F003",
    folio: "00000386",
    recepcion: "2025-11-16 14:20:00",
    fechaEmision: "2025-05-04 09:30:00",
    fechaTimbrado: "2025-11-16 14:21:00",
    moneda: "MXN",
    impuesto: "$2,400.00",
    valorTotal: "$17,400.00",
    estado_comercial: true,
    subtotal: "$15,000.00",
    direccionCorreo: "milagros.ramirez@cholsolutions.com",
    remitenteEnvio: "FDC CORPORATION E.I.R.L.",
    aprobacionComercial: "ACEPTADO",
    validacionComercial: "valido",
    fechaCarga: "2025-11-16 14:20:00",
    documentos: [
      {
        id: "doc1",
        nombre: "R-20601356326-01-F003-00000386.xml",
        tipo: "xml",
        tamano: "28.83 KB",
        fecha: "26/11/2025"
      },
      {
        id: "doc2",
        nombre: "20601356326-01-F003-00000386.pdf",
        tipo: "pdf",
        tamano: "156.23 KB",
        fecha: "26/11/2025"
      },
      {
        id: "doc3",
        nombre: "Aprobación comercial",
        tipo: "txt",
        tamano: "185.06 KB",
        fecha: "26/11/2025"
      },
    ],
    historial: [
      {
        id: "h1",
        titulo: "Factura recibida",
        descripcion: "Acción realiza por Sistema",
        fecha: "27/11/2025 18:30",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h2",
        titulo: "Validación de esquema",
        descripcion: "Acción realiza por Sistema",
        fecha: "27/11/2025 18:30",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h3",
        titulo: "Validación fiscal",
        descripcion: "Acción realiza por Sistema",
        fecha: "27/11/2025 18:30",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h4",
        titulo: "Validación comercial",
        descripcion: "Acción realiza por Sistema",
        fecha: "27/11/2025 18:30",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h5",
        titulo: "Aprobación comercial",
        descripcion: "Acción realiza por Sistema",
        fecha: "27/11/2025 18:30",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h6",
        titulo: "Envío de respuesta",
        descripcion: "Acción realiza por Sistema",
        fecha: "27/11/2025 18:30",
        accion: "Acción realiza por Sistema"
      },
    ],
    xmlUrl: "https://example.com/xml",
    pdfUrl: "https://example.com/xml",
  },
  {
    id: "2",
    tipoDoc: "Nota de Crédito",
    estado: "cancelada",
    validacionComercial: "no_valido",
    fechaConsulta: "2025-11-17 09:15:00",
    canal: "API",
    razonSocial: "Comercializadora del Sur SC",
    rfc: "CDS850220XYZ",
    serie: "F002",
    folio: "00004567",
    recepcion: "2025-11-15 16:45:00",
    fechaEmision: "2025-11-15 09:15:00",
    fechaTimbrado: "2025-11-15 16:46:00",
    moneda: "MXN",
    impuesto: "$800.00",
    valorTotal: "$5,800.00",
    estado_comercial: false,
        xmlUrl: "https://example.com/xml",
    pdfUrl: "https://example.com/xml",
  },
  {
    id: "3",
    tipoDoc: "Factura",
    estado: "vigente",
    validacionComercial: "valido",
    fechaConsulta: "2025-11-17 08:00:00",
    canal: "Manual",
    razonSocial: "Proveedora Industrial SRL",
    rfc: "PIS900315DEF",
    serie: "F003",
    folio: "00007890",
    recepcion: "2025-11-14 11:30:00",
    fechaEmision: "2025-11-14 10:30:00",
    fechaTimbrado: "2025-11-14 11:31:00",
    moneda: "USD",
    impuesto: "$1,200.00",
    valorTotal: "$8,700.00",
    estado_comercial: false,
        xmlUrl: "https://example.com/xml",
    pdfUrl: "https://example.com/xml",
  },
  {
    id: "4",
    tipoDoc: "Factura",
    estado: "vigente",
    validacionComercial: "no_valido",
    fechaConsulta: "2025-11-16 17:45:00",
    canal: "Email",
    razonSocial: "Almacenes González SA de CV",
    rfc: "AGO770510GHI",
    serie: "F004",
    folio: "00000012",
    recepcion: "2025-11-13 09:20:00",
    fechaEmision: "2025-11-13 11:45:00",
    fechaTimbrado: "2025-11-13 09:22:00",
    moneda: "MXN",
    impuesto: "$3,200.00",
    valorTotal: "$23,200.00",
    estado_comercial: null,
    pdfUrl: "https://example.com/pdf",
    xmlUrl: "https://example.com/xml",
  },
  {
    id: "5",
    tipoDoc: "Factura",
    estado: "vigente",
    validacionComercial: "no_valido",
    fechaConsulta: "2025-11-16 15:30:00",
    canal: "API",
    razonSocial: "Tecnología y Servicios SA",
    rfc: "TYS881205JKL",
    serie: "F005",
    folio: "00003456",
    recepcion: "2025-11-12 13:10:00",
    fechaEmision: "2025-11-12 08:20:00",
    fechaTimbrado: "2025-11-12 13:11:00",
    moneda: "MXN",
    impuesto: "$1,600.00",
    valorTotal: "$11,600.00",
    estado_comercial: false,
    pdfUrl: "https://example.com/pdf",
    xmlUrl: "https://example.com/xml",
  },
  {
    id: "6",
    tipoDoc: "Factura",
    estado: "vigente",
    validacionComercial: "no_valido",
    fechaConsulta: "2025-11-18 11:20:00",
    canal: "Email",
    razonSocial: "Importadora del Norte SA de CV",
    rfc: "IDN950822MNO",
    serie: "F006",
    folio: "00009876",
    recepcion: "2025-11-17 15:30:00",
    fechaEmision: "2025-11-17 14:10:00",
    fechaTimbrado: "2025-11-17 15:31:00",
    moneda: "MXN",
    impuesto: "$3,600.00",
    valorTotal: "$26,100.00",
    estado_comercial: true,
    subtotal: "15234.5 USD",
    direccionCorreo: "facturas@importadoranorte.com.mx",
    remitenteEnvio: "IMPORTADORA DEL NORTE SA DE CV",
    aprobacionComercial: "ACEPTADO",
    fechaCarga: "2025-11-17 15:30:00",
    documentos: [
      {
        id: "doc6-1",
        nombre: "R-20601356327-01-F004-00000521.xml",
        tipo: "xml",
        tamano: "31.45 KB",
        fecha: "17/11/2025"
      },
      {
        id: "doc6-2",
        nombre: "20601356327-01-F004-00000521.pdf",
        tipo: "pdf",
        tamano: "178.92 KB",
        fecha: "17/11/2025"
      },
      {
        id: "doc6-3",
        nombre: "Aprobación comercial",
        tipo: "txt",
        tamano: "192.34 KB",
        fecha: "17/11/2025"
      },
    ],
    historial: [
      {
        id: "h6-1",
        titulo: "Factura recibida",
        descripcion: "Acción realiza por Sistema",
        fecha: "17/11/2025 15:30",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h6-2",
        titulo: "Validación de esquema",
        descripcion: "Acción realiza por Sistema",
        fecha: "17/11/2025 15:31",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h6-3",
        titulo: "Validación fiscal",
        descripcion: "Acción realiza por Sistema",
        fecha: "17/11/2025 15:32",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h6-4",
        titulo: "Validación comercial",
        descripcion: "Acción realiza por Sistema",
        fecha: "17/11/2025 15:33",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h6-5",
        titulo: "Aprobación comercial",
        descripcion: "Acción realiza por Sistema",
        fecha: "17/11/2025 15:34",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h6-6",
        titulo: "Envío de respuesta",
        descripcion: "Acción realiza por Sistema",
        fecha: "17/11/2025 15:35",
        accion: "Acción realiza por Sistema"
      },
    ],
    pdfUrl: "https://example.com/pdf",
    xmlUrl: "https://example.com/xml",
  },
  {
    id: "7",
    tipoDoc: "Factura",
    estado: "vigente",
    validacionComercial: "valido",
    fechaConsulta: "2025-11-19 09:45:00",
    canal: "API",
    razonSocial: "Servicios Logísticos Integrales SRL",
    rfc: "SLI910615PQR",
    serie: "F007",
    folio: "00005678",
    recepcion: "2025-11-18 10:15:00",
    fechaEmision: "2025-11-18 16:25:00",
    fechaTimbrado: "2025-11-18 10:16:00",
    moneda: "USD",
    impuesto: "$2,100.00",
    valorTotal: "$15,225.00",
    estado_comercial: true,
    subtotal: "8945.2 USD",
    direccionCorreo: "admin@logisticaintegral.com",
    remitenteEnvio: "SERVICIOS LOGÍSTICOS INTEGRALES SRL",
    aprobacionComercial: "ACEPTADO",
    fechaCarga: "2025-11-18 10:15:00",
    documentos: [
      {
        id: "doc7-1",
        nombre: "R-20601356328-01-SLI-2025-789.xml",
        tipo: "xml",
        tamano: "29.67 KB",
        fecha: "18/11/2025"
      },
      {
        id: "doc7-2",
        nombre: "20601356328-01-SLI-2025-789.pdf",
        tipo: "pdf",
        tamano: "165.78 KB",
        fecha: "18/11/2025"
      },
      {
        id: "doc7-3",
        nombre: "Aprobación comercial",
        tipo: "txt",
        tamano: "188.21 KB",
        fecha: "18/11/2025"
      },
    ],
    historial: [
      {
        id: "h7-1",
        titulo: "Factura recibida",
        descripcion: "Acción realiza por Sistema",
        fecha: "18/11/2025 10:15",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h7-2",
        titulo: "Validación de esquema",
        descripcion: "Acción realiza por Sistema",
        fecha: "18/11/2025 10:16",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h7-3",
        titulo: "Validación fiscal",
        descripcion: "Acción realiza por Sistema",
        fecha: "18/11/2025 10:17",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h7-4",
        titulo: "Validación comercial",
        descripcion: "Acción realiza por Sistema",
        fecha: "18/11/2025 10:18",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h7-5",
        titulo: "Aprobación comercial",
        descripcion: "Acción realiza por Sistema",
        fecha: "18/11/2025 10:19",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h7-6",
        titulo: "Envío de respuesta",
        descripcion: "Acción realiza por Sistema",
        fecha: "18/11/2025 10:20",
        accion: "Acción realiza por Sistema"
      },
    ],
    pdfUrl: "https://example.com/pdf",
    xmlUrl: "https://example.com/xml",
  },
  {
    id: "8",
    tipoDoc: "Factura",
    estado: "cancelada",
    validacionComercial: "no_valido",
    fechaConsulta: "2025-11-19 14:30:00",
    canal: "Manual",
    razonSocial: "Construcciones y Desarrollos SA",
    rfc: "CYD870925STU",
    serie: "F008",
    folio: "00002345",
    recepcion: "2025-11-18 16:45:00",
    fechaEmision: "2025-11-18 17:40:00",
    fechaTimbrado: "2025-11-18 16:46:00",
    moneda: "MXN",
    impuesto: "$4,800.00",
    valorTotal: "$34,800.00",
    estado_comercial: false,
    subtotal: "20456.8 USD",
    direccionCorreo: "contabilidad@construccionescd.mx",
    remitenteEnvio: "CONSTRUCCIONES Y DESARROLLOS SA",
    aprobacionComercial: "RECHAZADO",
    fechaCarga: "2025-11-18 16:45:00",
    documentos: [
      {
        id: "doc8-1",
        nombre: "R-20601356329-01-CD-F-2025-456.xml",
        tipo: "xml",
        tamano: "33.21 KB",
        fecha: "18/11/2025"
      },
      {
        id: "doc8-2",
        nombre: "20601356329-01-CD-F-2025-456.pdf",
        tipo: "pdf",
        tamano: "198.45 KB",
        fecha: "18/11/2025"
      },
      {
        id: "doc8-3",
        nombre: "Aprobación comercial",
        tipo: "txt",
        tamano: "195.67 KB",
        fecha: "18/11/2025"
      },
    ],
    historial: [
      {
        id: "h8-1",
        titulo: "Factura recibida",
        descripcion: "Acción realiza por Sistema",
        fecha: "18/11/2025 16:45",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h8-2",
        titulo: "Validación de esquema",
        descripcion: "Acción realiza por Sistema",
        fecha: "18/11/2025 16:46",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h8-3",
        titulo: "Validación fiscal",
        descripcion: "Acción realiza por Sistema",
        fecha: "18/11/2025 16:47",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h8-4",
        titulo: "Validación comercial",
        descripcion: "Acción realiza por Sistema",
        fecha: "18/11/2025 16:48",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h8-5",
        titulo: "Aprobación comercial",
        descripcion: "Acción realiza por Sistema",
        fecha: "18/11/2025 16:49",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h8-6",
        titulo: "Envío de respuesta",
        descripcion: "Acción realiza por Sistema",
        fecha: "18/11/2025 16:50",
        accion: "Acción realiza por Sistema"
      },
    ],
    pdfUrl: "https://example.com/pdf",
    xmlUrl: "https://example.com/xml",
  },
  {
    id: "9",
    tipoDoc: "Factura",
    estado: "vigente",
    validacionComercial: "valido",
    fechaConsulta: "2025-11-20 08:15:00",
    canal: "Email",
    razonSocial: "Equipos Industriales del Bajío SA de CV",
    rfc: "EIB930710VWX",
    serie: "F009",
    folio: "00006789",
    recepcion: "2025-11-19 12:00:00",
    fechaEmision: "2025-11-19 13:55:00",
    fechaTimbrado: "2025-11-19 12:01:00",
    moneda: "MXN",
    impuesto: "$5,200.00",
    valorTotal: "$37,700.00",
    estado_comercial: true,
    subtotal: "22145.6 USD",
    direccionCorreo: "facturacion@equiposbajio.com.mx",
    remitenteEnvio: "EQUIPOS INDUSTRIALES DEL BAJÍO SA DE CV",
    aprobacionComercial: "ACEPTADO",
    fechaCarga: "2025-11-19 12:00:00",
    documentos: [
      {
        id: "doc9-1",
        nombre: "R-20601356330-01-EIB-FAC-001892.xml",
        tipo: "xml",
        tamano: "35.89 KB",
        fecha: "19/11/2025"
      },
      {
        id: "doc9-2",
        nombre: "20601356330-01-EIB-FAC-001892.pdf",
        tipo: "pdf",
        tamano: "205.12 KB",
        fecha: "19/11/2025"
      },
      {
        id: "doc9-3",
        nombre: "Aprobación comercial",
        tipo: "txt",
        tamano: "201.45 KB",
        fecha: "19/11/2025"
      },
    ],
    historial: [
      {
        id: "h9-1",
        titulo: "Factura recibida",
        descripcion: "Acción realiza por Sistema",
        fecha: "19/11/2025 12:00",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h9-2",
        titulo: "Validación de esquema",
        descripcion: "Acción realiza por Sistema",
        fecha: "19/11/2025 12:01",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h9-3",
        titulo: "Validación fiscal",
        descripcion: "Acción realiza por Sistema",
        fecha: "19/11/2025 12:02",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h9-4",
        titulo: "Validación comercial",
        descripcion: "Acción realiza por Sistema",
        fecha: "19/11/2025 12:03",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h9-5",
        titulo: "Aprobación comercial",
        descripcion: "Acción realiza por Sistema",
        fecha: "19/11/2025 12:04",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h9-6",
        titulo: "Envío de respuesta",
        descripcion: "Acción realiza por Sistema",
        fecha: "19/11/2025 12:05",
        accion: "Acción realiza por Sistema"
      },
    ],
    pdfUrl: "https://example.com/pdf",
    xmlUrl: "https://example.com/xml",
  },
  {
    id: "10",
    tipoDoc: "Factura",
    estado: "vigente",
    validacionComercial: "valido",
    fechaConsulta: "2025-11-20 16:50:00",
    canal: "API",
    razonSocial: "Materiales de Construcción del Pacífico SRL",
    rfc: "MCP960330YZA",
    serie: "F010",
    folio: "00001111",
    recepcion: "2025-11-20 08:30:00",
    fechaEmision: "2025-11-20 15:05:00",
    fechaTimbrado: "2025-11-20 08:31:00",
    moneda: "MXN",
    impuesto: "$2,800.00",
    valorTotal: "$20,300.00",
    estado_comercial: true,
    subtotal: "11923.4 USD",
    direccionCorreo: "ventas@materialespacifico.mx",
    remitenteEnvio: "MATERIALES DE CONSTRUCCIÓN DEL PACÍFICO SRL",
    aprobacionComercial: "ACEPTADO",
    fechaCarga: "2025-11-20 08:30:00",
    documentos: [
      {
        id: "doc10-1",
        nombre: "R-20601356331-01-MCP-2025-1123.xml",
        tipo: "xml",
        tamano: "30.12 KB",
        fecha: "20/11/2025"
      },
      {
        id: "doc10-2",
        nombre: "20601356331-01-MCP-2025-1123.pdf",
        tipo: "pdf",
        tamano: "172.56 KB",
        fecha: "20/11/2025"
      },
      {
        id: "doc10-3",
        nombre: "Aprobación comercial",
        tipo: "txt",
        tamano: "189.78 KB",
        fecha: "20/11/2025"
      },
    ],
    historial: [
      {
        id: "h10-1",
        titulo: "Factura recibida",
        descripcion: "Acción realiza por Sistema",
        fecha: "20/11/2025 08:30",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h10-2",
        titulo: "Validación de esquema",
        descripcion: "Acción realiza por Sistema",
        fecha: "20/11/2025 08:31",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h10-3",
        titulo: "Validación fiscal",
        descripcion: "Acción realiza por Sistema",
        fecha: "20/11/2025 08:32",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h10-4",
        titulo: "Validación comercial",
        descripcion: "Acción realiza por Sistema",
        fecha: "20/11/2025 08:33",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h10-5",
        titulo: "Aprobación comercial",
        descripcion: "Acción realiza por Sistema",
        fecha: "20/11/2025 08:34",
        accion: "Acción realiza por Sistema"
      },
      {
        id: "h10-6",
        titulo: "Envío de respuesta",
        descripcion: "Acción realiza por Sistema",
        fecha: "20/11/2025 08:35",
        accion: "Acción realiza por Sistema"
      },
    ],
    pdfUrl: "https://example.com/pdf",
    xmlUrl: "https://example.com/xml",
  },
]
