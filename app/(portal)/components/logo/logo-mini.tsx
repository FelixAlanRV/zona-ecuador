import { forwardRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// ----------------------------------------------------------------------

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const LogoMini = forwardRef<HTMLImageElement, { disabledLink?: boolean; className?: string; [key: string]: any }>(function LogoMini({ disabledLink = false, className, ...other }, ref) {

  // -------------------------------------------------------
  const logo = (
    <Image
      src={`${basePath}/ec/assets/logo/egridMini.svg`}
      alt="logo"
      width={120}
      height={40}
      className={cn("w-[120px] h-[40px] cursor-pointer", className)}
      ref={ref}
      {...other}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link href="/" className="contents">
      {logo}
    </Link>
  );
});

LogoMini.displayName = 'LogoMini';

export default LogoMini;

