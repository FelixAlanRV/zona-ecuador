import Scrollbar from "@/components/custom/scrollbar/scrollbar";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------

export default function ListProyects({ list, accion }: any) {
  return (
    <Scrollbar className="max-h-[400px]">
      <div className="flex flex-col gap-2 pr-0">
        {list?.map((cliente: any) => (
          <ProyectItem
            key={cliente.id || cliente.taxId} // Fallback key
            name={cliente?.name}
            ruc={cliente?.taxId}
            photo={cliente?.foto?.url}
            accion={() => accion(cliente)}
          />
        ))}
      </div>
    </Scrollbar>
  );
}

// ----------------------------------------------------------------------

function ProyectItem({ name, ruc, photo, accion }: any) {
  return (
    <div
      onClick={accion}
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all",
        "hover:bg-primary/10 hover:border hover:border-primary"
      )}
    >
      <div
        className="w-[86px] h-[48px] shrink-0 flex items-center justify-center bg-muted rounded-xl"
      >
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="w-[86px] h-[48px] rounded-lg object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted rounded-lg" />
        )}
      </div>

      <div className="flex-grow min-w-[160px] max-w-[300px]">
        <h6 className="text-sm font-semibold">{name}</h6>
        <div className="flex items-center mt-0.5 text-muted-foreground">
          <p className="text-xs ml-1 mr-2 text-muted-foreground/70 truncate">
            {ruc}
          </p>
        </div>
      </div>

      <div className="flex items-end text-muted-foreground pr-3">
        <ChevronRight className="w-5 h-5" />
      </div>
    </div>
  );
}
