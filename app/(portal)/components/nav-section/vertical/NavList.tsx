'use client';
import { useState, useEffect } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import useActiveLink from '@/hooks/use-active-link';
import NavItem from './NavItem';
import { usePathname } from 'next/navigation';

// ----------------------------------------------------------------------

interface NavListProps {
  data:any,
  depth:number,
  hasChild:boolean,
  isChildren?:boolean
}

export default function NavList({ data, depth, hasChild, isChildren }: NavListProps) {
  const pathname  = usePathname();

  const { active, isExternalLink } = useActiveLink(data.url);

  const [open, setOpen] = useState(active);

  useEffect(() => {
    if (!active) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <div onClick={hasChild ? handleToggle : undefined}>
          <NavItem
            item={data}
            depth={depth}
            open={open}
            active={active}
            isExternalLink={isExternalLink}
            className={isChildren ? "ml-3" : ""}
          />
        </div>
      </CollapsibleTrigger>

      {hasChild && (
        <CollapsibleContent className="data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up overflow-hidden">
          <div className='ml-2 mt-1'>
            <NavSubList
              data={data.children}
              depth={depth}
            />
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}

// ----------------------------------------------------------------------

function NavSubList({ data, depth }: { data: any[], depth: number }) {
  return (
    <>
      {data.map((list, index) => (
        <NavList
          key={list.nombre + list.url}
          data={list}
          depth={depth + 1}
          hasChild={false}
          isChildren={true}
        />
      ))}
    </>
  );
}
