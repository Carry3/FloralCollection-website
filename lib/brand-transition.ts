/**
 * 开屏 / 换页：logo 飞回导航栏 + 幕布从中间向上下拉开。
 *
 * 幕布与 logo 同一时长（同速），只是晚一点出发、跟在 logo 后面：
 * 上半块幕布的下边缘在 logo 飞行全程都保持在 logo 下方，logo 一直压在纯色幕布上（加载色清晰可读）；
 * 等幕布越过已落位的 logo 之后，logo 再变成导航栏颜色。
 * 延迟很小时，幕布会在飞行过程中短暂碰到 logo（可接受的少量重叠）。
 */

/** logo 飞行。注意 GSAP 的 power2 是三次曲线（easeInOutCubic） */
export const BRAND_TRANSITION_S = 1.6;
export const BRAND_EASE_GSAP = "power2.inOut";

/** 幕布拉开（WAAPI）。与 logo 同一条曲线：GSAP power2.inOut = easeInOutCubic */
export const CURTAIN_DELAY_S = 0.25;
export const CURTAIN_S = 1.6;
export const CURTAIN_EASE_CSS = "cubic-bezier(0.65, 0, 0.35, 1)";

/** logo 变色：幕布越过落位后的 logo 时开始（幕布 0.25 + 1.6 = 1.85s 拉完），快速变成导航栏颜色 */
export const BRAND_COLOR_AT_S = 1.8;
export const BRAND_COLOR_S = 0.3;

/**
 * 小屏（导航栏只显示 logo 图标、不显示文字）的前置动作：
 * 先让文字淡出、logo 图标平移到屏幕正中，再开始上面的飞行 + 幕布动画（整体顺延这段时间）。
 * 断点须与 CSS 里隐藏 .header-brand-text 的断点一致（animations.css: max-width 768px）。
 */
export const BRAND_COMPACT_QUERY = "(max-width: 768px)";
export const BRAND_COMPACT_PRE_S = 0.5;

/** 不播放开场 loading 的页面：付款完成后由 Stripe / 整页跳转进入，再放一次品牌开场会显得像又在"处理中"。
    这些页面直接显示内容，由页面自身的入场动画（画勾 + 依次淡入）承接。站内点击跳转仍走正常的幕布过渡。 */
const NO_INTRO_PATHS = [/^\/book\/success\/?$/, /^\/order\/[^/]+\/?$/];
export function skipsIntro(pathname: string | null): boolean {
    return !!pathname && NO_INTRO_PATHS.some((re) => re.test(pathname));
}
