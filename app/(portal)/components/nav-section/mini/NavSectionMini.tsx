import { memo } from "react";
import NavList from "./NavList";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
interface NavSectionMiniProps {
  data: any[];
  className?: string;
  [key: string]: any;
}

function NavSectionMini({ data, className, ...other }: NavSectionMiniProps) {
  function agruparPorPadre(arr: any[]) {
    const padres: any = {};
    const resultado: any[] = [];
  
    arr.forEach(item => {
      if (!item.padre) {
        resultado.push(item);
      } else {
        if (!padres[item.padre]) {
          padres[item.padre] = { children: [] };
        }
        padres[item.padre].children.push(item);
      }
    });
  
    resultado.forEach(item => {
      if (padres[item.nombre]) {
        item.children = padres[item.nombre].children;
      }
    });
  
    return resultado;
  }


  return (
    <div
      className={cn("flex flex-col items-center gap-1", className)}
      {...other}
    >
      {agruparPorPadre(data).map((list, index) => {
        return <NavList key={index} data={list} depth={1} hasChild={!!list.children}/>;
      })}
    </div>
  );
}

export default memo(NavSectionMini);

// ----------------------------------------------------------------------

interface ItemsProps {
  items: any[];
  isLastGroup: boolean;
}

function Items({ items, isLastGroup }: ItemsProps) {
  return (
    <>
      {items.map((list) => (
        <NavList
          key={list.title + list.path}
          data={list}
          depth={1}
          hasChild={!!list.children}
        />
      ))}

      {!isLastGroup && (
        <div className="w-6 h-px bg-border my-2" />
      )}
    </>
  );
}
