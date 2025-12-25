import React, { forwardRef } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronRight, Info } from "lucide-react";
import Link from "next/link";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------

interface NavItemProps {
  item: {
    nombre: string;
    icono?: React.ReactNode;
    url?: string;
    children?: React.ReactNode;
    disabled?: boolean;
    caption?: string;
    roles?: string[] | string;
  };
  depth?: number;
  open?: boolean;
  active?: boolean;
  isExternalLink?: boolean;
  className?: string;
  [key: string]: any;
}

const NavItem = forwardRef<HTMLDivElement, NavItemProps>(
  ({ item, depth, open, active, isExternalLink, className, ...other }, ref) => {
    const { nombre, icono, url, children, disabled, caption, roles } = item;
    const subItem = depth !== 1;

    const renderContent = (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col items-center justify-center capitalize w-full h-14 cursor-pointer transition-all ",
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          active && "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600 border-r-4 border-blue-600",
          disabled && "opacity-50 pointer-events-none",
          subItem && "h-10 flex-row px-3 justify-start", // Subitem styles
          className
        )}
        {...other}
      >
        {icono && (
          <span className={cn("flex items-center justify-center w-6 h-6", subItem && "mr-2")}>
            {(() => {
              const Icon = (Icons as any)[icono];
              return Icon ? <Icon className="w-5 h-5" /> : null;
            })()}
          </span>
        )}

        <span
          className={cn(
            "text-[10px] leading-4 text-center w-20 truncate transition-all",
            active && "font-medium",
            subItem && "text-sm w-auto text-left"
          )}
        >
          {nombre}
        </span>

        {caption && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="absolute top-2 left-1 w-3 h-3" />
            </TooltipTrigger>
            <TooltipContent side="right">
              {caption}
            </TooltipContent>
          </Tooltip>
        )}

        {!!children && (
          <ChevronRight
            className="absolute top-2 right-1 w-3 h-3"
          />
        )}
      </div>
    );

    const renderItem = () => {
      // ExternalLink
      if (isExternalLink)
        return (
          <Link href={url || "#"} target="_blank" rel="noopener" className="w-full block mb-1">
            {renderContent}
          </Link>
        );

      // Default
      return (
        <Link href={url || "#"} className="w-full block mb-1">
          {renderContent}
        </Link>
      );
    };

    return renderItem();
  }
);

NavItem.displayName = "NavItem";

export default NavItem;
