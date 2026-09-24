'use client'

import { useEffect } from 'react'
import { useLenis } from '@/hooks/useLenis'

/** 当前有多少个浮层在锁滚动 —— 菜单 / 相册弹窗 / 灯箱可能叠在一起，全部关掉才解锁 */
let lockCount = 0
let savedOverflow = ''

/**
 * 浮层打开期间锁住页面滚动（Lenis + 原生）。
 * 浮层内部需要滚动的容器加 `data-lenis-prevent`，让 Lenis 不去接管它的滚轮。
 */
export function useScrollLock(active: boolean) {
  const lenis = useLenis()

  useEffect(() => {
    if (!active) return
    const root = document.documentElement
    if (lockCount === 0) {
      savedOverflow = root.style.overflow
      root.style.overflow = 'hidden'
      lenis?.stop()
    }
    lockCount++
    return () => {
      lockCount--
      if (lockCount === 0) {
        root.style.overflow = savedOverflow
        lenis?.start()
      }
    }
  }, [active, lenis])
}
