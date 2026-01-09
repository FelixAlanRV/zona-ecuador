"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  AlertTriangle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  FileCode,
  FileDigit,
  Files,
  Server,
  Folder,
} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

import { CheckCircle, Download, Upload, Edit } from "lucide-react";
import { CustomBarTooltip } from "@/components/chart"
import { formatNumber } from "@/lib/utils"

// Datos simulados
const last7Days = [
  { date: "Lun 25", documents: 145, errors: 12 },
  { date: "Mar 26", documents: 178, errors: 15 },
  { date: "Mié 27", documents: 156, errors: 10 },
  { date: "Jue 28", documents: 198, errors: 18 },
  { date: "Vie 29", documents: 167, errors: 14 },
  { date: "Sáb 30", documents: 89, errors: 6 },
  { date: "Dom 1", documents: 134, errors: 9 },
]

const last30Days = [
  { date: "1 Nov", documents: 142, errors: 9 },
  { date: "2 Nov", documents: 156, errors: 11 },
  { date: "3 Nov", documents: 148, errors: 10 },
  { date: "4 Nov", documents: 172, errors: 13 },
  { date: "5 Nov", documents: 189, errors: 16 },
  { date: "6 Nov", documents: 158, errors: 12 },
  { date: "7 Nov", documents: 163, errors: 14 },
  { date: "8 Nov", documents: 167, errors: 13 },
  { date: "9 Nov", documents: 153, errors: 11 },
  { date: "10 Nov", documents: 159, errors: 12 },
  { date: "11 Nov", documents: 145, errors: 10 },
  { date: "12 Nov", documents: 171, errors: 14 },
  { date: "13 Nov", documents: 162, errors: 12 },
  { date: "14 Nov", documents: 198, errors: 19 },
  { date: "15 Nov", documents: 184, errors: 15 },
  { date: "16 Nov", documents: 173, errors: 13 },
  { date: "17 Nov", documents: 176, errors: 14 },
  { date: "18 Nov", documents: 159, errors: 11 },
  { date: "19 Nov", documents: 148, errors: 10 },
  { date: "20 Nov", documents: 134, errors: 9 },
  { date: "21 Nov", documents: 167, errors: 12 },
  { date: "22 Nov", documents: 179, errors: 16 },
  { date: "23 Nov", documents: 201, errors: 17 },
  { date: "24 Nov", documents: 188, errors: 14 },
  { date: "25 Nov", documents: 174, errors: 13 },
  { date: "26 Nov", documents: 178, errors: 15 },
  { date: "27 Nov", documents: 182, errors: 16 },
  { date: "28 Nov", documents: 171, errors: 13 },
  { date: "29 Nov", documents: 165, errors: 12 },
  { date: "30 Nov", documents: 191, errors: 18 },
]

const last3Months = [
  { date: "Sep", documents: 4523, errors: 387 },
  { date: "Oct", documents: 5234, errors: 445 },
  { date: "Nov", documents: 4987, errors: 412 },
]

type Period = "7days" | "30days" | "3months"

type ActivityType = "aprobacion" | "rechazo" | "descarga" | "creacion" | "edicion"


export interface ActivityItem {
  user: string
  action: string
  date: string
  time: string
  type: ActivityType
}

export const recentActivities: ActivityItem[] = [
  {
    user: "Denny Albuz",
    action: "Realizó una aceptación comercial",
    time: "09:28 PM",
    date: "05/12/2025",
    type: "aprobacion"
  },
  {
    user: "Monty Prismic",
    action: "Realizó un rechazo comercial",
    time: "01:28 PM",
    date: "05/12/2025",
    type: "rechazo"
  },
  {
    user: "Jacky Anderson",
    action: "Subió un nuevo archivo",
    time: "11:15 AM",
    date: "05/12/2025",
    type: "creacion"
  },
  {
    user: "Laura Kensington",
    action: "Realizó un rechazo comercial",
    time: "10:42 AM",
    date: "05/12/2025",
    type: "rechazo"
  },
  {
    user: "Pedro Hollow",
    action: "Realizó una aceptación comercial",
    time: "08:03 AM",
    date: "05/12/2025",
    type: "aprobacion"
  },
  {
    user: "Wolbu Fenny",
    action: "Descargó un archivo XML",
    time: "06:44 PM",
    date: "04/12/2025",
    type: "descarga"
  },
  {
    user: "María Loxford",
    action: "Subio un nuevo archivo",
    time: "07:21 PM",
    date: "05/12/2025",
    type: "creacion"
  }
]





const activityIcons = {
  aprobacion: {
    icon: CheckCircle,
    color: "text-green-500",
  },
  rechazo: {
    icon: XCircle,
    color: "text-red-500",
  },
  descarga: {
    icon: Download,
    color: "text-blue-500",
  },
  creacion: {
    icon: Upload,
    color: "text-purple-500",
  },
  edicion: {
    icon: Edit,
    color: "text-amber-500",
  },
};


const recentFiles = [
  {
    serieFolio: "F001-00004567",
    razonSocial: "DISTRIBUIDORA KROMA",
    rfc: "DKR900301AQ7",
    monto: "$15,430.00",
    fecha: "5 Dic 2025",
    hora: "09:45 AM",
  },
  {
    serieFolio: "F002-00004562",
    razonSocial: "FULTON INMUEBLES",
    rfc: "FIN960221D63",
    monto: "$8,750.50",
    fecha: "5 Dic 2025",
    hora: "08:22 AM",
  },
  {
    serieFolio: "F003-00004565",
    razonSocial: "GRUPO COMEX",
    rfc: "GCO9311174I0",
    monto: "$22,100.00",
    fecha: "4 Dic 2025",
    hora: "06:15 PM",
  },
  {
    serieFolio: "F003-00004565",
    razonSocial: "CONSORCIO COMEX",
    rfc: "CCO950628II2",
    monto: "$22,100.00",
    fecha: "4 Dic 2025",
    hora: "06:15 PM",
  },

]

const storageData = [
  {
    type: "Total",
    used: 138,
    color: "from-slate-600 to-slate-800",
    colorStart: "#475569",
    colorEnd: "#1e293b",
    bgGradient: "from-slate-500/10 via-slate-600/10 to-transparent",
    icon: Server, // ⬅️ Mejor icono
  },
  {
    type: "XML",
    used: 47,
    color: "from-blue-500 to-cyan-500",
    colorStart: "#3b82f6",
    colorEnd: "#06b6d4",
    bgGradient: "from-blue-500/10 via-cyan-500/10 to-transparent",
    icon: FileCode, // ⬅️ XML perfecto
  },
  {
    type: "PDF",
    used: 68,
    color: "from-red-500 to-rose-500",
    colorStart: "#ef4444",
    colorEnd: "#f43f5e",
    bgGradient: "from-red-500/10 via-rose-500/10 to-transparent",
    icon: FileDigit, // ⬅️ Más representativo como PDF
  },
  {
    type: "Otros",
    used: 23,
    color: "from-purple-500 to-violet-500",
    colorStart: "#a855f7",
    colorEnd: "#8b5cf6",
    bgGradient: "from-purple-500/10 via-violet-500/10 to-transparent",
    icon: Files, // ⬅️ Otros archivos
  },
]

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>("7days")

  const getChartData = () => {
    switch (period) {
      case "7days":
        return last7Days
      case "30days":
        return last30Days
      case "3months":
        return last3Months
      default:
        return last7Days
    }
  }

  const getPeriodLabel = () => {
    switch (period) {
      case "7days":
        return "últimos 7 días"
      case "30days":
        return "últimos 30 días"
      case "3months":
        return "últimos 3 meses"
    }
  }

  const chartData = getChartData()
  const totalDocuments = 6579
  const accepted = 5569
  const rejected = 500
  const pending = 510
  const percentageComplete = Math.round((accepted / totalDocuments) * 100)

  const metrics = [
    {
      title: "Documentos Recibidos",
      value: formatNumber(totalDocuments),
      change: "+12.5%",
      trend: "up",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 via-cyan-500/10 to-transparent",
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
      textColor: "text-blue-600 dark:text-blue-400",
      label: "Total procesados",
      lightBadge: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
    },
    {
      title: "Estatus en SAT",
      value: "247",
      change: "-3.2%",
      trend: "down",
      icon: AlertTriangle,
      color: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-500/10 via-amber-500/10 to-transparent",
      iconBg: "bg-gradient-to-br from-orange-500 to-amber-500",
      textColor: "text-orange-600 dark:text-orange-400",
      label: "Requieren atención",
      lightBadge: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
    },
    {
      title: "Validaciones Comerciales",
      value: "189",
      change: "+5.7%",
      trend: "up",
      icon: XCircle,
      color: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 via-pink-500/10 to-transparent",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
      textColor: "text-purple-600 dark:text-purple-400",
      label: "No cumplen con las reglas",
      lightBadge: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
    },
    {
      title: "Error al Procesar",
      value: "64",
      change: "-8.1%",
      trend: "down",
      icon: AlertCircle,
      color: "from-red-500 to-rose-500",
      bgGradient: "from-red-500/10 via-rose-500/10 to-transparent",
      iconBg: "bg-gradient-to-br from-red-500 to-rose-500",
      textColor: "text-red-600 dark:text-red-400",
      label: "En revision por EDX",
      lightBadge: "bg-red-500/20 text-red-700 dark:text-red-300",
    },

  ]

  return (
    <div className=" w-full h-full mb-5 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full px-4 py-6 md:px-6 lg:px-8  mx-auto">
        {/* Enhanced Header */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-1.5 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Activity className="h-3.5 w-3.5 text-blue-500" />
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Facturación Electrónica</p>
                <span className="text-slate-400 dark:text-slate-600">•</span>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  {new Date().toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {metrics.map((metric, index) => (
            <Card
              key={index}
              className="
        group relative overflow-hidden 
        border border-slate-200/60 dark:border-slate-800/60
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl 
        shadow-lg shadow-slate-900/5 dark:shadow-slate-950/30
        hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-slate-950/50
        transition-all duration-500 hover:-translate-y-1
      "
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient SIEMPRE visible */}
              <div className={`absolute inset-0 bg-gradient-to-br ${metric.bgGradient} opacity-100`} />

              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              </div>

              <CardHeader className="relative flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                  {metric.title}
                </CardTitle>
                <div
                  className={`${metric.iconBg} rounded-lg p-2 shadow-lg shadow-slate-900/10 dark:shadow-slate-950/50 group-hover:scale-110 transition-transform duration-300`}
                >
                  <metric.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>

              <CardContent className="relative">
                <div className={`text-2xl font-bold tracking-tight ${metric.textColor} mb-1.5`}>{metric.value}</div>

                <div className="flex items-center gap-2">
                  <div
                    className={`
              flex items-center gap-1 px-2 py-0.5 rounded-full 
              text-xs font-semibold ${metric.lightBadge}
            `}
                  >
                    {metric.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}

                    <span>{metric.label}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-3">
          {/* Main Chart */}
          <Card className="lg:col-span-2 border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Documentos Recibidos
                </CardTitle>
                <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
                  Mostrando {getPeriodLabel()}
                </CardDescription>
              </div>
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                {["7days", "30days", "3months"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p as Period)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${period === p
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md shadow-slate-900/10 scale-105"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
                      }`}
                  >
                    {p === "7days" ? "7 días" : p === "30days" ? "30 días" : "3 meses"}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-6 pt-4">
              <ChartContainer
                config={{
                  documents: {
                    label: "Documentos",
                    color: "rgb(59, 130, 246)",
                  },
                }}
                className="h-[40vh] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorDocuments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgb(148, 163, 184)" opacity={0.15} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={12}
                      fontSize={12}
                      fontWeight={500}
                      stroke="rgb(100, 116, 139)"
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      fontWeight={500}
                      stroke="rgb(100, 116, 139)"
                    />
                    <Tooltip
                      content={<CustomBarTooltip />}
                      cursor={{ fill: "rgb(148, 163, 184)", opacity: 0.1 }}
                    />
                    <Bar
                      dataKey="documents"
                      fill="url(#colorDocuments)"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={50}
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Aprobacion Comercial
              </CardTitle>
              <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
                Resumen de procesamiento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-0">
              {/* Enhanced Circular Progress */}
              <div className="flex items-center justify-center py-2">
                <div className="relative w-40 h-40 overflow-visible">
                  {/* Outer glow ring */}
                  <div
                    className="absolute inset-0 rounded-full bg-gradient-to-r 
                        from-emerald-400/20 to-teal-400/20 
                        blur-xl pointer-events-none"
                  />

                  <svg className="h-full w-full -rotate-90 relative overflow-visible" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgb(16, 185, 129)" />
                        <stop offset="100%" stopColor="rgb(20, 184, 166)" />
                      </linearGradient>
                    </defs>

                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#progressGradient)"
                      strokeWidth="8"
                      strokeDasharray={`${(percentageComplete / 100) * 251.327} 251.327`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 drop-shadow-lg"
                      style={{
                        filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))",
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold bg-gradient-to-br from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                      {percentageComplete}%
                    </span>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-1">Aprobadas</span>
                  </div>
                </div>
              </div>

              {/* Redesigned Stats List - Value + Percentage juntos */}
              <div className="space-y-3">
                {/* Total Documents - Azul */}
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-xl 
                  bg-blue-50 dark:bg-blue-800 border border-blue-200 dark:border-blue-700 
                  hover:shadow-md transition-all duration-300"
                >
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Total</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-blue-700 dark:text-blue-300">
                      {formatNumber(totalDocuments)}
                    </span>
                  </div>
                </div>

                {/* Accepted - Verde */}
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-xl 
                  bg-emerald-50 dark:bg-emerald-800 border border-emerald-200 dark:border-emerald-700 
                  hover:shadow-md transition-all duration-300"
                >
                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Aceptados</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-emerald-700 dark:text-emerald-300">
                      {formatNumber(accepted)}
                    </span>
                    <span className="text font-bold text-emerald-600/70 dark:text-emerald-400/70">
                      ({percentageComplete}%)
                    </span>
                  </div>
                </div>

                {/* Rejected - Rojo */}
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-xl 
                  bg-rose-50 dark:bg-rose-800 border border-rose-200 dark:border-rose-700 
                  hover:shadow-md transition-all duration-300"
                >
                  <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">Rechazados</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-rose-700 dark:text-rose-300">{rejected}</span>
                    <span className=" font-bold text-rose-600/70 dark:text-rose-400/70">
                      ({Math.round((rejected / totalDocuments) * 100)}%)
                    </span>
                  </div>
                </div>

                {/* Pending - Gris */}
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-xl 
                  bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 
                  hover:shadow-md transition-all duration-300"
                >
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pendientes</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-bold text-slate-600 dark:text-slate-400">{pending}</span>
                    <span className="font-bold text-slate-600/70 dark:text-slate-400/70">
                      ({Math.round((pending / totalDocuments) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 grid-cols-1 lg:grid-cols-3 mt-5">
          {/* Storage Section */}
          <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Almacenamiento
              </CardTitle>
              <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
                Uso por tipo de archivo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {storageData.map((storage, idx) => (
                <div
                  key={idx}
                  className="
          group relative
          flex items-center gap-4 p-11 rounded-xl
          border border-slate-200/60 dark:border-slate-800/60
          bg-white dark:bg-slate-900/60
          shadow-md hover:shadow-2xl
          transition-all duration-300 hover:-translate-y-1
        "
                >
                  {/* Shine effect sutil */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                  </div>
                  <div className="relative flex-shrink-0 z-10">
                    {/* Capa glow detrás */}
                    <div
                      className={`absolute inset-0 blur-2xl opacity-40 rounded-2xl bg-gradient-to-br ${storage.color}`}
                    />

                    {/* Icono principal */}
                    <div
                      className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${storage.color}
      flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300
    `}
                      style={{
                        boxShadow: `0 12px 28px ${storage.colorStart}50`,
                      }}
                    >
                      <storage.icon className="h-7 w-7 text-white drop-shadow-md" strokeWidth={2} />
                    </div>
                  </div>


                  {/* Storage info sin barra de progreso */}
                  <div className="flex-1 relative z-10">
                    <div className="flex items-baseline justify-between">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                        {storage.type}
                      </p>
                      <div className="text-right">
                        <span className="text-2xl font-bold" style={{ color: storage.colorStart }}>
                          {storage.used}
                        </span>
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 ml-1">
                          GB
                        </span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                      Espacio ocupado
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          {/* Recent Files Section */}
          {/* Recent Files Section - LIMPIO Y PROFESIONAL */}
          <Card className="border border-slate-200/60 dark:border-slate-800/60 
                 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl 
                 shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 
                         dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Archivos Recientes
              </CardTitle>
              <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
                Últimos documentos procesados
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {recentFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="group relative p-4 rounded-xl overflow-hidden
             bg-white dark:bg-slate-900/60 
             border border-slate-200/60 dark:border-slate-700/40 
             shadow-lg dark:shadow-slate-900/40
             hover:shadow-2xl hover:-translate-y-1 
             transition-all duration-300"
                >
                  {/* Header: Serie/Folio + Monto */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Icono simple con glow detrás */}
                      <div className="relative">
                        {/* Capa glow detrás */}
                        <div
                          className="absolute inset-0 blur-xl opacity-0 rounded-2xl 
               bg-gradient-to-br from-yellow-400 to-orange-500"
                        />

                        {/* Icono normal (sin cambios) */}
                        <div className="
        relative h-10 w-10 rounded-xl 
        bg-gradient-to-br from-yellow-400 to-orange-500
        flex items-center justify-center 
        group-hover:scale-110 transition-transform duration-300
      "
                        >
                          <FileText className="h-5 w-5 text-white" strokeWidth={2} />
                        </div>
                      </div>


                      {/* Serie y tipo */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {file.serieFolio}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Factura Electrónica
                        </p>
                      </div>
                    </div>

                    {/* Monto */}
                    <div className="text-right flex-shrink-0 ml-3">
                      <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {file.monto}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        MXN
                      </p>
                    </div>
                  </div>

                  {/* Razón Social, RFC y Badge Fecha/Hora */}
                  <div className="flex items-start justify-between">
                    <div className="pb-3 flex-1 min-w-0">
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate mb-1">
                        {file.razonSocial}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        RFC: {file.rfc}
                      </p>
                    </div>

                    {/* Badge: Fecha y Hora en uno solo */}
                    <div className="flex-shrink-0 ml-3 flex items-center gap-1 px-3 py-2 rounded-lg 
                            bg-slate-100 dark:bg-slate-800 
                            border border-slate-200 dark:border-slate-700
                            text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      <span>{file.fecha}</span>
                      <span className="text-slate-500 dark:text-slate-400">·</span>
                      <span>{file.hora}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>


          {/* Recent Activities Section */}
          <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-shadow duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Actividades Recientes
              </CardTitle>
              <CardDescription className="text-xs text-slate-600 dark:text-slate-400">
                Últimos actividades realizadas
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {recentActivities.map((activity, idx) => {
                const Icon = activityIcons[activity.type].icon
                const iconColor = activityIcons[activity.type].color

                return (
                  <div
                    key={idx}
                    className="
            p-3 rounded-lg 
            bg-slate-50 dark:bg-slate-800/50 
            border border-slate-200 dark:border-slate-700/50 
            shadow-md hover:shadow-lg 
            transition-all duration-200
            hover:bg-slate-100 dark:hover:bg-slate-800
            flex gap-3 
          "
                  >
                    {/* Icono dinámico */}
                    <div className="flex-shrink-0 mt-0.5">
                      <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={2} />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1">
                      {/* User + Badge */}
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {activity.user}
                        </p>

                        {/* Badge blanco */}
                        <div
                          className="flex-shrink-0 ml-3 flex items-center gap-1 px-3 py-1.5 rounded-lg
                  bg-white dark:bg-slate-900
                  shadow-sm
                  border border-slate-200 dark:border-slate-700
                  text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          <span>{activity.date}</span>
                          <span className="text-slate-500 dark:text-slate-400">·</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>

                      {/* Acción */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {activity.action}
                      </p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  )
}
