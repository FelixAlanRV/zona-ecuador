'use client';

import { forwardRef } from 'react';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  disabledLink?: boolean;
  className?: string;
  src?: string | StaticImageData;
  width?: number;
  height?: number;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const Logo = forwardRef<HTMLImageElement, LogoProps>(function Logo(
  {
    disabledLink = false,
    className,
    src = `${basePath}/ec/assets/logo/egrid.svg`,
    width = 200,
    height = 60,
    ...props
  },
  ref
) {
  const logo = (
    <Image
      src={src}
      alt="logo"
      width={width}
      height={height}
      className={cn("w-[200px] h-[60px] cursor-pointer", className)}
      ref={ref}
      {...props}
    />
  );

  if (disabledLink) return logo;

  return <Link href="/" className="contents">{logo}</Link>;
});

Logo.displayName = 'Logo';

export default Logo;
