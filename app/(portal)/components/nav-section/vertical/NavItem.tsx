import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import Link from "next/link";
import { forwardRef } from "react";

// ----------------------------------------------------------------------

export default function NavItem({
  item,
  depth,
  open,
  active,
  isExternalLink,
  className,
  ...other
}: any) {
  const { nombre, icono, url, info, children, disabled, caption, roles } = item;
  const subItem = depth !== 1;

  const renderContent = (
    <div
      className={cn(
        "relative flex items-center capitalize py-2 pr-3 mb-1 w-full transition-colors cursor-pointer select-none",
        "text-muted-foreground",
        // Solo aplicamos hover si NO está activo
        !active && "hover:bg-accent hover:text-accent-foreground",
        "pl-4",
        subItem && "h-9 text-sm pl-4",
        depth > 2 && "pl-8",
        // Estilos de activo
        active && "bg-blue-50 text-blue-600 font-medium hover:bg-blue-100/50", // Puedes añadir un hover azul más oscuro aquí
        active && !subItem && "border-r-4 border-blue-600",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      {...other}
    >
      {icono && (
        <span className="flex items-center justify-center w-6 h-6 mr-3">
          {(() => {
            const Icon = (Icons as any)[icono];
            return Icon ? <Icon className="w-5 h-5" /> : null;
          })()}
        </span>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <span className="truncate text-sm font-medium">{nombre}</span>
        {caption && (
          <span className="truncate text-xs text-muted-foreground/70">
            {caption}
          </span>
        )}
      </div>

      {info && (
        <span className="leading-none ml-2">
          {info}
        </span>
      )}

      {!!children && (
        open ?
          <Icons.ChevronDown className="w-4 h-4 ml-1" /> :
          <Icons.ChevronRight className="w-4 h-4 ml-1" />
      )}
    </div>
  );

  const renderItem = () => {
    // ExternalLink
    if (isExternalLink)
      return (
        <Link href={url} target="_blank" rel="noopener" className="w-full block">
          {renderContent}
        </Link>
      );

    // Has child
    if (children) {
      return renderContent;
    }

    // Default
    return (
      <Link href={url} className="w-full block">
        {renderContent}
      </Link>
    );
  };

  if (caption) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {renderItem()}
        </TooltipTrigger>
        <TooltipContent side="right">
          {caption}
        </TooltipContent>
      </Tooltip>
    );
  }

  return renderItem();
}
