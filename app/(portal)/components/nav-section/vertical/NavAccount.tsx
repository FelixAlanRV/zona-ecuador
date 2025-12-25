import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import ListProyects from "./ListProyects";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useClientStoreHydrated } from "../store/use-client-store";
import { useClientInitialization } from "../store/use-client-initialization";
import { useSession } from "@/utils/context/session-context";
// ----------------------------------------------------------------------

export default function NavAccount() {
  const [open, setOpen] = useState(false);
  const { user } = useSession();

  // Hook para detectar el tamaño de la pantalla
    const [isMobile, setIsMobile] = React.useState(typeof window !== "undefined" ? window.innerWidth < 768 : false)

    React.useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768)
      }

      if (typeof window !== "undefined") {
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
      }
    }, [])

    const { 
    selectedClient, 
    setSelectedClient,
    _hasHydrated 
  } = useClientStoreHydrated()

  useClientInitialization()

  const handleChangeObra = (cliente: any) => {
    setSelectedClient(cliente)
    setOpen(false);
  };

  if (!_hasHydrated) {
    return (
      <div 
          className={cn(
            "flex items-center p-3 rounded-xl bg-muted/50 cursor-pointer transition-colors hover:bg-muted",
            "border border-transparent hover:border-border"
          )}
        >
          <div className="flex-grow min-w-[160px]">
            <p className="text-sm font-semibold text-foreground">
              Cargando...
            </p>
          </div>
        </div>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div 
          className={cn(
            "flex items-center p-3 rounded-xl bg-muted/50 cursor-pointer transition-colors hover:bg-muted",
            "border border-transparent hover:border-border"
          )}
        >
          <div className="flex-grow min-w-[160px]">
            <p className="text-sm font-semibold text-foreground">
              {selectedClient?.name}
            </p>
            <div className="flex items-center mt-0.5 text-muted-foreground">
              <p className="text-xs ml-1 mr-2 truncate">
                {selectedClient?.taxId}
              </p>
            </div>
          </div>
          <div className="text-muted-foreground pr-0.5">
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
      </PopoverTrigger>

      {(user?.clients?.length ?? 0) > 1 && (
        <PopoverContent 
          className="w-[450px] p-0 bg-popover/95 backdrop-blur-sm" 
          align="start"
          side="right"
          sideOffset={10}
        >
          <ListProyects list={user?.clients ?? []} accion={handleChangeObra} />
        </PopoverContent>
      )}
    </Popover>
  );
}
