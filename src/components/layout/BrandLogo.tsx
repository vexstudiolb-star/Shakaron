import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  locale: string;
  alt: string;
};

export function BrandLogo({
  className,
  imageClassName,
  priority = false,
  locale,
  alt,
}: BrandLogoProps) {
  return (
    <Link
      href={`/${locale}`}
      className={cn("relative inline-flex items-center justify-center", className)}
      aria-label={alt}
    >
      <Image
        src={siteConfig.assets.logo}
        alt={alt}
        width={180}
        height={64}
        priority={priority}
        className={cn(
          "h-8 w-auto object-contain sm:h-9 md:h-10",
          imageClassName
        )}
      />
    </Link>
  );
}
