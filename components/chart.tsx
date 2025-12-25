"use client"

import { TooltipProps } from "recharts"

export function CustomBarTooltip({ active, payload, label }: TooltipProps<any, any>) {
  if (!active || !payload || !payload.length) return null

  const value = payload[0].value

  return (
    <div className="
      px-4 py-2 rounded-xl 
      bg-white/80 dark:bg-slate-900/80 
      backdrop-blur-xl 
      border border-slate-200/60 dark:border-slate-700/60
      shadow-xl
      transition-all
      text-xs
    ">
      <p className="font-semibold text-slate-900 dark:text-slate-100">{label}</p>
      <p className="text-slate-700 dark:text-slate-300 mt-1">
        Documentos: <span className="font-bold text-blue-500">{value}</span>
      </p>
    </div>
  )
}
