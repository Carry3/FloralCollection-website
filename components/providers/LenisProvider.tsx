'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePreloader } from '@/components/providers/PreloaderProvider'
import { MOBILE_MEDIA } from '@/lib/breakpoints'
import { initZoom, isZoomed, onZoomChange } from '@/lib/zoom'

gsap.registerPlugin(ScrollTrigger)

// 移动端地址栏伸缩会改变视口高度，不应触发 ScrollTrigger.refresh（否则 pin 重排抖动）。
ScrollTrigger.config({ ignoreMobileResize: true })

const LenisContext = createContext<Lenis | null>(null)

export function useLenisInstance(): Lenis | null {
  return useContext(LenisContext)
}

interface LenisProviderProps {
  children: ReactNode
}

export default function LenisProvider({ children }: LenisProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const { preloaderDone, navLoading } = usePreloader()

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const mobileMql = window.matchMedia(MOBILE_MEDIA)
    let tickerFn: ((time: number) => void) | null = null
    let cleanupZoom: (() => void) | null = null

    // 缩放检测统一由 lib/zoom 单例提供（捏合 + 页面缩放，跨浏览器）。
    initZoom()

    const init = () => {
      if (mobileMql.matches) return // 手机端使用原生滚动

      const lenisInstance = new Lenis({
        // 连续惯性插值（参考 ouno.jp 的连绵跟手手感）。lerp 越小越"黏"/越重，
        // 越大停得越快/越跟手。0.2 比 0.15 滑行更短、停止更利落。
        lerp: 0.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
        // 放大时让出 wheel 控制权：返回 false 会在任何 preventDefault 之前退出，
        // 把平移交还浏览器原生处理 → 缩放后双指平移顺滑、不被 Lenis 拽着乱跳。
        // 返回 true（非 false）则照常平滑滚动（Lenis 只在 === false 时取消）。
        virtualScroll: () => !isZoomed(),
      })

      lenisRef.current = lenisInstance

      // ── 放大态下让 Lenis 完全让出滚动控制 ─────────────────────────────────
      // 两条铁律（来自 Safari 实测 + 源码）：
      //  1) 绝不能 lenis.stop()——它给 <html> 加 .lenis-stopped → overflow:clip，
      //     直接锁死整页滚动（即「Safari 放大后无法滚动」）。
      //  2) 缩放/手势期间绝不能调用 lenis.scrollTo / window.scrollTo——在 Safari 下
      //     手势中途修改滚动会打断视觉视口，表现为「放手后闪小一下再放大」；而且
      //     Lenis 的 immediate scrollTo 会置 _preventNextNativeScrollEvent，
      //     反而吞掉它自己的原生滚动同步。
      // 正确做法：缩放时只「停推 rAF」（见 tickerFn 的 isZoomed 闸门），Lenis 不再写
      // 滚动位置、把控制权交还浏览器，且不碰 overflow。仅在「进入缩放的那一刻」对齐一次
      // （丢弃可能正在进行的平滑惯性动画，避免还原后跳回旧目标）；这一次是在手势刚开始时，
      // 不在平移/松手途中，因此不会触发 Safari 的视觉视口闪烁。缩放期间之后 Lenis 的
      // onNativeScroll 会随原生滚动持续自动对齐，还原 100% 后无需再 scrollTo 即可无缝恢复。
      // ⭐ 局部放大无法滚动的真正根因：base.css 在 html/body 上设了
      // `overscroll-behavior: none`（用于压制 Safari 橡皮筋与 Lenis 的冲突）。
      // 普通文档内滚动无害，但捏合放大后，平移被放大的视觉视口在 WebKit 看来属于
      // overscroll，`none` 会把这种平移整个禁掉 → 放大后完全无法滚动（Cmd+ 页面缩放
      // 是文档内滚动，不受影响，所以正常）。放大态下临时恢复为 auto，还原后再交还 CSS。
      const setOverscroll = (zoomed: boolean) => {
        const v = zoomed ? 'auto' : ''
        document.documentElement.style.overscrollBehavior = v
        document.body.style.overscrollBehavior = v
        // 放大时把 html 的 scroll-behavior 从 smooth 切到 auto：否则浏览器对缩放焦点
        // 居中所做的滚动会被原生平滑动画化，与 Lenis 冲突，表现为位置飘/跳。
        document.documentElement.style.scrollBehavior = zoomed ? 'auto' : ''
      }

      // ⭐ 跳位的强嫌疑：ScrollTrigger 默认在 window `resize` 时自动 refresh()，
      // 重算所有 pin 位置并维持滚动；Safari 捏合缩放会触发 resize，于是在缩放途中
      // 重排 pin → 滚动被重算 → 跳位（Services 的 pin 多且长，跳得最明显）。
      // 放大期间从 autoRefreshEvents 去掉 resize，挂起自动 refresh；还原后恢复。
      const AUTO_REFRESH = 'visibilitychange,DOMContentLoaded,load,resize'
      const setRefreshSuspended = (suspended: boolean) => {
        ScrollTrigger.config({
          autoRefreshEvents: suspended ? 'visibilitychange,DOMContentLoaded,load' : AUTO_REFRESH,
        })
      }

      let wasZoomed = isZoomed()
      setOverscroll(wasZoomed)
      setRefreshSuspended(wasZoomed)
      const unsubZoom = onZoomChange(() => {
        const zoomed = isZoomed()
        setOverscroll(zoomed)
        setRefreshSuspended(zoomed)
        if (!zoomed && wasZoomed) {
          // 仅在「还原到 100%」时对齐一次：清掉缩放前可能残留的平滑动画、把 Lenis 内部
          // 位置对齐到当前真实滚动，避免恢复平滑滚动瞬间跳动。
          // 进入 / 缩放期间**绝不** scrollTo —— 捏合放大时浏览器会以焦点为中心原生改变
          // window.scrollY，若此时把它拽回旧位置就会和原生滚动互相拉扯 = 放大后乱跳，
          // 在 800% 的 Services pin 上还会被放大成动画相位的大跳。
          lenisInstance.scrollTo(window.scrollY, { immediate: true, force: true })
          // 还原后 innerWidth 回到真实值，补一次 refresh：让 pin 位置与函数式偏移
          // （offRight/offBottom = innerWidth/innerHeight）按正确尺寸重算，
          // 纠正放大期间可能漏进来的、用错误视觉视口尺寸做的 refresh。
          requestAnimationFrame(() => ScrollTrigger.refresh())
        }
        wasZoomed = zoomed
      })

      // 页面缩放（Cmd/Ctrl +/-）会重排布局：去抖刷新 ScrollTrigger，
      // 让带 invalidateOnRefresh 的 pin/scrub 在新 innerWidth 下重算函数式偏移。
      let refreshTimer = 0
      const unsubRefresh = onZoomChange((s) => {
        if (s.page) {
          window.clearTimeout(refreshTimer)
          refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200)
        }
      })

      cleanupZoom = () => {
        unsubZoom()
        unsubRefresh()
        window.clearTimeout(refreshTimer)
        // 还原 overscroll-behavior / scroll-behavior 的内联覆盖，交还 CSS。
        document.documentElement.style.overscrollBehavior = ''
        document.body.style.overscrollBehavior = ''
        document.documentElement.style.scrollBehavior = ''
        // 恢复 ScrollTrigger 默认的自动 refresh 事件。
        setRefreshSuspended(false)
      }

      window.scrollTo(0, 0)
      lenisInstance.scrollTo(0, { immediate: true })

      lenisInstance.on('scroll', ScrollTrigger.update)

      tickerFn = (time: number) => {
        // 缩放时不推进 Lenis：rAF 一旦推进就会 window.scrollTo(target) 拽回原生滚动。
        // 不调用 raf 即等于让出滚动给浏览器，且不会像 stop() 那样加 overflow:clip。
        if (isZoomed()) {
          // 放大期间「冻结」scrub 动画：不调用 ScrollTrigger.update()。
          // 原因：Safari 捏合放大会让浏览器改变 window.scrollY（焦点居中 / 边缘平移），
          // 若此时驱动 update()，scrub 动画就会跟着 scrollY 变 → 放大时画面乱变
          //（Services 8 屏动画最明显）。放大是"检视当前画面"，动画应保持不动；
          // 之前 Tenants 的错位是 962-refresh 跳位造成的，已由"挂起 refresh"修掉，
          // 因此这里无需再 update。还原 100% 时在 onZoomChange 里补 refresh 重新对齐。
          return
        }
        lenisInstance.raf(time * 1000)
      }
      gsap.ticker.add(tickerFn)
      gsap.ticker.lagSmoothing(0)

      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })

      setLenis(lenisInstance)
    }

    const teardown = () => {
      if (tickerFn) {
        gsap.ticker.remove(tickerFn)
        tickerFn = null
      }
      if (cleanupZoom) {
        cleanupZoom()
        cleanupZoom = null
      }
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
        setLenis(null)
      }
    }

    init()

    const onChange = () => {
      teardown()
      init()
      ScrollTrigger.refresh()
    }
    mobileMql.addEventListener('change', onChange)

    return () => {
      mobileMql.removeEventListener('change', onChange)
      teardown()
    }
  }, [])

  // Preloader 和导航期间禁止滚动，完成后恢复
  useEffect(() => {
    const instance = lenisRef.current
    if (!instance) {
      // Mobile: Lenis is disabled; use native scroll.
      // Reset to top when navigation ends so the new page is revealed at scroll 0.
      if (!navLoading && preloaderDone) {
        window.scrollTo(0, 0)
      }
      return
    }
    if (navLoading) {
      // 导航开始：立即回到顶部并锁定滚动，确保新页面从顶部开始
      instance.scrollTo(0, { immediate: true })
      instance.stop()
    } else if (preloaderDone) {
      instance.start()
      // 导航结束后强制刷新 ScrollTrigger，确保吸附位置基于最新的 GSAP spacer 布局重新计算
      // （子组件的 GSAP effects 先于父级 SnapSection 的 refresh 监听器运行，
      //   所以这里补一次 refresh 让吸附系统同步到正确位置）
      requestAnimationFrame(() => ScrollTrigger.refresh())
    } else {
      instance.stop()
    }
  }, [preloaderDone, navLoading])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
