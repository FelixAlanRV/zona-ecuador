'use client'
import { useState, useEffect, useRef } from 'react';
import useActiveLink from '@/hooks/use-active-link';
import NavItem from './NavItem';
import { usePathname } from 'next/navigation';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

// ----------------------------------------------------------------------

export default function NavList({ data, depth, hasChild }: any) {
  const navRef = useRef(null);
  const pathname = usePathname();
  const { active, isExternalLink } = useActiveLink(data.url);

  return (
    <>
      {hasChild ? (
        <HoverCard openDelay={0} closeDelay={100}>
          <HoverCardTrigger asChild>
            <div>
              <NavItem
                ref={navRef}
                item={data}
                depth={depth}
                active={active}
                isExternalLink={isExternalLink}
              />
            </div>
          </HoverCardTrigger>
          <HoverCardContent 
            side="right" 
            align="start" 
            className="w-auto min-w-[160px] bg-popover"
            sideOffset={10}
          >
            <NavSubList data={data.children} depth={depth} />
          </HoverCardContent>
        </HoverCard>
      ) : (
        <NavItem
          ref={navRef}
          item={data}
          depth={depth}
          active={active}
          isExternalLink={isExternalLink}
        />
      )}
    </>
  );
}

// ----------------------------------------------------------------------

function NavSubList({ data, depth }: any) {
  return (
    <div className="flex flex-col gap-1">
      {data.map((list: any) => (
        <NavList
          key={list.title + list.path}
          data={list}
          depth={depth + 1}
          hasChild={!!list.children}
        />
      ))}
    </div>
  );
}
