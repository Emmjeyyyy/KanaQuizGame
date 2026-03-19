"use client";

import Link from "next/link";
import { usePageTransition } from "../components/PageTransition";
import { useRouter } from "next/navigation";
import { ComponentProps, forwardRef } from "react";

interface TransitionLinkProps extends ComponentProps<typeof Link> {
  children: React.ReactNode;
}

export const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ href, onClick, children, ...props }, ref) => {
    const { startTransition } = usePageTransition();
    const router = useRouter();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Only use transition for internal links
      const hrefString = href.toString();
      const isInternal = hrefString.startsWith("/") && !hrefString.startsWith("//");
      
      if (isInternal) {
        e.preventDefault();
        startTransition(() => {
          router.push(hrefString);
        });
      }
      
      if (onClick) {
        onClick(e);
      }
    };

    return (
      <Link href={href} onClick={handleClick} ref={ref} {...props}>
        {children}
      </Link>
    );
  }
);

TransitionLink.displayName = "TransitionLink";
