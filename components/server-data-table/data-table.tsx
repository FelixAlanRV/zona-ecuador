import { type Table as TanstackTable, flexRender } from "@tanstack/react-table";
import type * as React from "react";
import { useState, useEffect } from "react";

import { DataTablePagination } from "@/components/server-data-table/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/server-data-table/table"; // These are your ui/table components
import { getCommonPinningStyles } from "./lib/data-table";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  table: TanstackTable<TData>;
  floatingBar?: React.ReactNode | null;
  isLoading?: boolean;
  /**
   * Fixed height for the scrollable table area.
   */
  tableHeight?: string;
}

export function DataTable<TData>({
  table,
  floatingBar = null,
  children,
  className,
  isLoading = false,
  tableHeight = "calc(90vh - 250px)", // Default fixed height
  ...props
}: DataTableProps<TData>) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(isLoading);

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  const headerBackgroundColor = "bg-gray-100"; // Matching original comprobantes-table style

  return (
    <div
      className={cn("space-y-2.5", className)}
      {...props}
    >
      {children}
      {/* Este div define la ventana gráfica desplazable para la tabla */}
      <div
        className="relative rounded-md border"
        style={{ height: tableHeight, overflow: 'hidden' }} // Fixed height and hidden overflow
      >
        {/* Superposición con spinner al cargar - solo cuando hay datos */}
        {loading && table.getRowModel().rows?.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 z-20 rounded-md"> {/* z-20 para estar encima del encabezado fijo*/}
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {/* El componente Tabla de ui/table manejará el desplazamiento interno */}
        <Table>
          <TableHeader
            // Sticky header: sticky, top-0, z-index, and background
            // El índice z debe ser menor que la superposición del cargador, pero lo suficientemente alto para otro contenido.
            className={cn("sticky top-0 z-10", headerBackgroundColor)}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn("font-semibold text-muted-foreground h-12 bg-blue-500", headerBackgroundColor)}
                      style={{
                        ...getCommonPinningStyles({ column: header.column }), // Los estilos de fijación pueden incluir su propio índice z
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onMouseEnter={() => setHoveredRow(row.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={cn(
                    "border-border transition-colors duration-200",
                    index % 2 === 0 ? "bg-background/10" : "bg-muted/10", 
                    row.getIsSelected() && "bg-primary/10 dark:bg-primary/10",
                    hoveredRow === row.id
                      ? "bg-gray-50 hover:bg-gray-50"
                      : "hover:bg-gray-50",
                    row.getIsSelected() && hoveredRow === row.id && "hover:bg-primary/10"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "p-3 text-sm transition-colors duration-200",
                        
                        index % 2 === 0 ? "bg-background/10" : "bg-muted/10", 
                        row.getIsSelected()
                          ? "text-foreground bg-primary/10 dark:bg-primary/10" 
                          : "text-muted-foreground"
                      )}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column }),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Cargando datos...
                    </span>
                  ) : (
                    "No se encontraron resultados."
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {table.getFilteredSelectedRowModel().rows.length > 0 && floatingBar}
      </div>
    </div>
  );
}