'use client'

/**
 * 全站缩放状态的单一事实来源（single source of truth）。
 *
 * 浏览器有两种「放大」，必须分别处理：
 *  1) 捏合 / 视觉视口缩放（触控板捏合）：布局**不**重排，但 Safari 下 window.innerWidth/Height
 *     会缩成放大后的视觉视口尺寸（如 1470→962），并触发 resize。可由 visualViewport.scale、
 *     视觉视口宽度比、或 ctrlKey 滚轮累计探测；Safari 桌面端额外派发 gesture* 事件。
 *  2) 页面缩放（Cmd/Ctrl +/-）：布局重排，CSS 像素的 innerWidth/Height 改变，
 *     visualViewport.scale 保持 ~1，可通过 devicePixelRatio 相对基线的变化探测，并触发 resize。
 *
 * 任何滚动层（Lenis / ScrollTrigger / useScrollSnap / DeviceSync）都应消费本模块，
 * 以便缩放时干净地挂起 scroll-jacking / pin-refresh / 设备判定，还原后无跳变地恢复。
 *
 * 设计为模块级单例（非 hook）：监听器只装一次、initZoom() 幂等、永不卸载。
 */

export interface ZoomState {
  pinch: boolean
  page: boolean
  pinchScale: number
  pageLevel: number
}

type ZoomListener = (state: ZoomState) => void

const PINCH_SCALE_MIN = 1.02 // 容忍浮点 / 滚动条带来的亚像素噪声
const PAGE_LEVEL_EPS = 0.02 // |level-1| 超过此值视为页面缩放
const GESTURE_END_DELAY = 300 // Safari gestureend 后 scale 可能尚未稳定

let initialized = false
let baselineDpr = 1
let gesturing = false
let gestureEndTimer = 0
// Safari 捏合累计缩放：手势结束后仍保留，用于「持续」判定放大态。
let safariZoom = 1
let gestureStartZoom = 1
// ctrlKey 滚轮（捏合缩放，Safari 15+ / Chrome / Firefox 都派发）累计的近似缩放。
let wheelZoom = 1
let wheelZoomTimer = 0

interface GestureLike {
  scale?: number
}

const listeners = new Set<ZoomListener>()
let cached: ZoomState = { pinch: false, page: false, pinchScale: 1, pageLevel: 1 }

function vv(): VisualViewport | null {
  return typeof window !== 'undefined' ? window.visualViewport ?? null : null
}

// 视觉视口宽度比：捏合放大时视觉视口变窄，layoutWidth / visualViewport.width > 1。
// 跨浏览器最可靠的捏合信号——即便 Safari 的 visualViewport.scale 不更新，width 仍会变。
function vvWidthRatio(): number {
  const v = vv()
  if (!v || typeof document === 'undefined') return 1
  const layoutW = document.documentElement.clientWidth
  if (layoutW > 0 && v.width > 0) return layoutW / v.width
  return 1
}

export function getPinchScale(): number {
  const v = vv()
  const vs = v ? v.scale : 1
  // 取最大值：Chrome 的 .scale、Safari gesture 累计、ctrlKey 滚轮累计、以及宽度比兜底。
  return Math.max(vs, safariZoom, wheelZoom, vvWidthRatio())
}

export function isPinchZoomed(): boolean {
  if (gesturing) return true
  return getPinchScale() > PINCH_SCALE_MIN
}

export function getPageZoomLevel(): number {
  if (typeof window === 'undefined') return 1
  return window.devicePixelRatio / baselineDpr
}

export function isPageZoomed(): boolean {
  return Math.abs(getPageZoomLevel() - 1) > PAGE_LEVEL_EPS
}

export function isZoomed(): boolean {
  return isPinchZoomed() || isPageZoomed()
}

function snapshot(): ZoomState {
  return {
    pinch: isPinchZoomed(),
    page: isPageZoomed(),
    // 取 2 位小数，避免宽度比/DPR 的亚像素噪声每帧触发通知。
    pinchScale: Math.round(getPinchScale() * 100) / 100,
    pageLevel: Math.round(getPageZoomLevel() * 100) / 100,
  }
}

function recompute(): void {
  const next = snapshot()
  // 任一字段变化即通知（捏合进/出、页面缩放级别变化）。
  if (
    next.pinch === cached.pinch &&
    next.page === cached.page &&
    next.pinchScale === cached.pinchScale &&
    next.pageLevel === cached.pageLevel
  ) {
    return
  }
  cached = next
  listeners.forEach((cb) => cb(next))
}

// ctrlKey 滚轮 = 捏合缩放。按 deltaY 指数累计出近似 scale（zoom in: deltaY<0 → 放大）。
// 下限钳到 1（浏览器视觉缩放不会小于 1）；持续保留，直到用户捏合还原把它带回 1。
function onWheelZoom(e: WheelEvent): void {
  if (!e.ctrlKey) return
  wheelZoom = Math.max(1, wheelZoom * Math.exp(-e.deltaY * 0.01))
  // 接近 1 时直接归一，避免漂移残留导致永久判定放大（→ Lenis 永久让出、无平滑滚动）。
  if (wheelZoom < 1.02) wheelZoom = 1
  window.clearTimeout(wheelZoomTimer)
  // 安全阀：停止捏合一段时间后，若已非常接近 1 则归一。
  wheelZoomTimer = window.setTimeout(() => {
    if (wheelZoom < 1.05) {
      wheelZoom = 1
      recompute()
    }
  }, 800)
  recompute()
}

function onGestureStart(): void {
  gesturing = true
  // 本次手势的 .scale 相对手势开始为 1，累计到已有的 safariZoom 之上。
  gestureStartZoom = safariZoom
  window.clearTimeout(gestureEndTimer)
  recompute()
}

function onGestureChange(e: Event): void {
  const s = (e as GestureLike).scale
  if (typeof s === 'number' && s > 0) safariZoom = gestureStartZoom * s
  recompute()
}

function onGestureEnd(e: Event): void {
  const s = (e as GestureLike).scale
  if (typeof s === 'number' && s > 0) safariZoom = gestureStartZoom * s
  // 手势结束后 gesturing 标志延后清除；但 safariZoom 会保留，确保仍判定为放大态。
  window.clearTimeout(gestureEndTimer)
  gestureEndTimer = window.setTimeout(() => {
    gesturing = false
    recompute()
  }, GESTURE_END_DELAY)
}

/**
 * 幂等初始化：装一次监听器，捕获 DPR 基线。可从任意位置安全调用。
 */
export function initZoom(): void {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  // HiDPI：Retina 在 100% 时 DPR 为 2（或 1.5）。用「相对基线的比值」消除绝对值问题。
  baselineDpr = window.devicePixelRatio

  const v = vv()
  v?.addEventListener('resize', recompute)
  v?.addEventListener('scroll', recompute)

  // gesture* 仅 Safari 支持，类型未在标准 lib 中，故 as EventListener。
  window.addEventListener('gesturestart', onGestureStart as EventListener)
  window.addEventListener('gesturechange', onGestureChange as EventListener)
  window.addEventListener('gestureend', onGestureEnd as EventListener)

  // ctrlKey 滚轮（捏合缩放）：跨浏览器最通用的「捏合」探测兜底。
  window.addEventListener('wheel', onWheelZoom, { passive: true })

  // 页面缩放会触发 resize 且改变 devicePixelRatio。
  window.addEventListener('resize', recompute)

  cached = snapshot()
}

/**
 * 订阅缩放状态变化，返回取消订阅函数。回调在任一字段变化时触发。
 */
export function onZoomChange(cb: ZoomListener): () => void {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}
