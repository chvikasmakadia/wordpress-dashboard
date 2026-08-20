'use client';
import { useRouter, usePathname, useParams as useNextParams, useSearchParams as useNextSearchParams } from 'next/navigation';
import NextLink from 'next/link';
import React from 'react';

export function useNavigate() {
  const router = useRouter();
  return React.useCallback((to, options) => {
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [router]);
}

export function useLocation() {
  const pathname = usePathname();
  return React.useMemo(() => ({ pathname }), [pathname]);
}

export function useParams() {
  const params = useNextParams();
  return params || {};
}

export function useSearchParams() {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const setSearchParams = React.useCallback((newParams) => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() || []));
    for (const [key, value] of Object.entries(newParams)) {
      if (value === undefined || value === null) {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    }
    router.push(`${pathname}?${current.toString()}`);
  }, [searchParams, pathname, router]);

  return [searchParams || new URLSearchParams(), setSearchParams];
}

export const Link = React.forwardRef(({ to, children, ...props }, ref) => {
  return (
    <NextLink href={to} ref={ref} {...props}>
      {children}
    </NextLink>
  );
});
Link.displayName = 'Link';

export function Navigate({ to, replace }) {
  const router = useRouter();
  React.useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);
  return null;
}

export function Outlet() {
  return null;
}
