'use client';

import { useEffect, useState } from 'react';

export const MOBILE_MAX = 639;
export const SNAP_MIN = 1000;

export const MOBILE_MEDIA = `(max-width: ${MOBILE_MAX}px)`;

export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOBILE_MEDIA).matches;
}

export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_MEDIA);
    const update = () => setMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);
  return mobile;
}
