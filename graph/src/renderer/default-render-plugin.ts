/**
 * DefaultRenderPlugin — 框架内置默认渲染插件。
 *
 * 将现有的 NodeBatchRenderer / LinkBatchRenderer / TextLabelRenderer /
 * WebGLPicker / PlusBadgeLayer 统一封装为一个 RenderPlugin。
 */
import type { RenderNode, RenderLink } from "./types.js"
import type { GraphOverlay } from "./graph-overlay.js"
import type { PickHit } from "./picker.js"
import type { GraphViewStyle } from "../theme.js"
import type { DefaultGraphDataGenerics } from "../client/type.js"
import {
  defaultNodeStyle,
  personStyle,
  phoneStyle,
  addressStyle,
  accountStyle,
  companyStyle,
  ipStyle,
  deviceStyle,
} from "../entity/default/default.style.js"
import { defaultLinkStyle } from "../entity/link/default/default.style.js"
import type {
  RenderPlugin,
  RenderPluginOptions,
  RenderContext,
} from "./render-plugin.js"
import { NodeBatchRenderer } from "./node-batch.js"
import { LinkBatchRenderer } from "./link-batch.js"
import { TextLabelRenderer, type CharInfo } from "./text-label.js"
import { WebGLPicker } from "./webgl-picker.js"
import { CpuPicker } from "./cpu-picker.js"
import { PlusBadgeLayer, type BadgeData } from "./plus-badge-layer.js"
import type { Picker } from "./picker.js"

export class DefaultRenderPlugin implements RenderPlugin {
  readonly name = "default"

  private gl: WebGL2RenderingContext
  private nodeRenderer: NodeBatchRenderer
  private linkRenderer: LinkBatchRenderer
  private labelRenderer: TextLabelRenderer
  private picker: Picker
  readonly plusBadgeLayer: PlusBadgeLayer

  // 缓存
  private nodes: RenderNode[] = []
  private links: RenderLink[] = []
  private labels: CharInfo[] = []

  constructor(opts: RenderPluginOptions) {
    this.gl = opts.gl
    this.nodeRenderer = new NodeBatchRenderer(opts.gl)
    this.linkRenderer = new LinkBatchRenderer(opts.gl)
    this.labelRenderer = new TextLabelRenderer(
      opts.gl,
      2048,
      opts.labelFontSize,
    )

    const pickMode = opts.pickerMode ?? "gpu"
    if (pickMode === "cpu") {
      this.picker = new CpuPicker()
    } else {
      this.picker = new WebGLPicker({
        gl: opts.gl,
        nodeRenderer: this.nodeRenderer,
        linkRenderer: this.linkRenderer,
        width: opts.width,
        height: opts.height,
      })
    }

    this.plusBadgeLayer = new PlusBadgeLayer({
      canvas: opts.canvas,
      gl: opts.gl,
      onPlusClick: opts.onPlusClick,
      borderWidth: opts.plusBadgeBorderWidth,
      borderColor: opts.plusBadgeBorderColor,
    })
  }

  // ═══════════════════════════════════════════════
  // RenderPlugin
  // ═══════════════════════════════════════════════

  render(ctx: RenderContext): void {
    this.linkRenderer.render(
      ctx.links,
      ctx.width,
      ctx.height,
      ctx.tx,
      ctx.ty,
      ctx.scale,
      ctx.showArrows,
      0,
    )
    this.nodeRenderer.render(
      ctx.nodes,
      ctx.width,
      ctx.height,
      ctx.tx,
      ctx.ty,
      ctx.scale,
      -0.5,
    )

    this.labels = this.labelRenderer.buildNodeLabels(
      ctx.nodes,
      ctx.scale,
      ctx.labelMinScale,
    )
    this.labelRenderer.render(
      this.labels,
      ctx.width,
      ctx.height,
      ctx.tx,
      ctx.ty,
      ctx.scale,
      -1.0,
    )
  }

  getOverlays(): GraphOverlay[] {
    return [this.plusBadgeLayer]
  }

  afterPositionUpdate(nodes: RenderNode[]): void {
    this.updateBadges(nodes)
  }

  getDefaultStyle(): GraphViewStyle<DefaultGraphDataGenerics> {
    return {
      background: "#f7f7f7",
      node: {
        default: defaultNodeStyle as any,
        person: personStyle,
        phone: phoneStyle,
        address: addressStyle,
        account: accountStyle,
        company: companyStyle,
        ip: ipStyle,
        device: deviceStyle,
      },
      link: { default: defaultLinkStyle as any },
    } as GraphViewStyle<DefaultGraphDataGenerics>
  }

  // ═══════════════════════════════════════════════
  // Picker
  // ═══════════════════════════════════════════════

  get tx() {
    return this.picker.tx
  }
  set tx(v: number) {
    this.picker.tx = v
  }
  get ty() {
    return this.picker.ty
  }
  set ty(v: number) {
    this.picker.ty = v
  }
  get k() {
    return this.picker.k
  }
  set k(v: number) {
    this.picker.k = v
  }

  syncData(nodes: RenderNode[], links: RenderLink[]): void {
    this.nodes = nodes
    this.links = links
    this.picker.syncData(nodes, links)
    this.updateBadges(nodes)

    const texts = nodes.map((n) => n.label).filter(Boolean) as string[]
    texts.push(...(links.map((l) => l.label).filter(Boolean) as string[]))
    this.labelRenderer.preRegister(texts)
  }

  pick(screenX: number, screenY: number): PickHit | null {
    return this.picker.pick(screenX, screenY)
  }

  resize(width: number, height: number): void {
    this.picker.resize(width, height)
  }

  destroy(): void {
    this.nodeRenderer.destroy()
    this.linkRenderer.destroy()
    this.labelRenderer.destroy()
    this.picker.destroy()
    this.plusBadgeLayer.destroy()
  }

  // ═══════════════════════════════════════════════
  // Helpers
  // ═══════════════════════════════════════════════

  private updateBadges(nodes: RenderNode[]): void {
    const badges: BadgeData[] = []
    for (const n of nodes) {
      if (!n.showPlus) continue
      const offX = n.radius * (n.plusOffsetX ?? 0.5)
      const offY = n.radius * (n.plusOffsetY ?? -0.5)
      badges.push({
        x: n.x + offX,
        y: n.y + offY,
        radius: n.radius * (n.plusScale ?? 0.35),
        nodeId: n.id,
      })
    }
    this.plusBadgeLayer.updateBadges(badges)
  }
}
