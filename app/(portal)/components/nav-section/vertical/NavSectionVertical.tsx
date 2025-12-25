import NavList from "./NavList";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------

interface NavSectionVerticalProps {
  data: any[];
  className?: string;
  [key: string]: any;
}

export default function NavSectionVertical({ data, className, ...other }: NavSectionVerticalProps) {


  //TODO: cambiar a utils
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
    <div className={cn("flex flex-col gap-1", className)} {...other}>
      {agruparPorPadre(data).map((list, index) => {
        return (
          <NavList
            key={list.nombre + list.url}
            data={list}
            depth={1}
            hasChild={!!list.children}
          />
        );
      })}
    </div>
  );
}
