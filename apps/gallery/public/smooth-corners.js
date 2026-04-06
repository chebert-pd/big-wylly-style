/**
 * Smooth Corners Paint Worklet
 *
 * Creates iOS / Figma-style corner smoothing (continuous curvature)
 * by drawing a superellipse-based rounded rectangle as a mask.
 *
 * CSS custom properties:
 *   --corner-smoothing  : 0–100 (Figma-style percentage, default 0)
 *   --corner-radius     : pixel value for border radius (default 0)
 *
 * Usage:
 *   .smooth { mask-image: paint(smooth-corners); }
 */
class SmoothCornersPainter {
  static get inputProperties() {
    return ["--corner-smoothing", "--corner-radius"];
  }

  paint(ctx, geom, properties) {
    const w = geom.width;
    const h = geom.height;

    const smoothingRaw = properties.get("--corner-smoothing");
    const radiusRaw = properties.get("--corner-radius");

    const smoothing = smoothingRaw ? parseFloat(smoothingRaw.toString()) : 0;
    const radius = radiusRaw ? parseFloat(radiusRaw.toString()) : 0;

    if (smoothing <= 0 || radius <= 0) {
      // Fall back to a plain filled rect (no masking effect)
      ctx.fillRect(0, 0, w, h);
      return;
    }

    const r = Math.min(radius, w / 2, h / 2);
    // Map 0-100% to superellipse exponent: 2 (circle) → 10 (squircle)
    const n = 2 + (Math.min(smoothing, 100) / 100) * 8;
    // How far the smoothed curve extends along each edge
    const arcLen = Math.min(r * (1 + (smoothing / 100) * 0.6), w / 2, h / 2);

    ctx.beginPath();

    // --- Top edge (left → right) ---
    ctx.moveTo(arcLen, 0);
    ctx.lineTo(w - arcLen, 0);

    // --- Top-right corner ---
    this._smoothCorner(ctx, w - arcLen, 0, w, 0, w, arcLen, r, n);

    // --- Right edge ---
    ctx.lineTo(w, h - arcLen);

    // --- Bottom-right corner ---
    this._smoothCorner(ctx, w, h - arcLen, w, h, w - arcLen, h, r, n);

    // --- Bottom edge ---
    ctx.lineTo(arcLen, h);

    // --- Bottom-left corner ---
    this._smoothCorner(ctx, arcLen, h, 0, h, 0, h - arcLen, r, n);

    // --- Left edge ---
    ctx.lineTo(0, arcLen);

    // --- Top-left corner ---
    this._smoothCorner(ctx, 0, arcLen, 0, 0, arcLen, 0, r, n);

    ctx.closePath();
    ctx.fill();
  }

  /**
   * Draw a smoothed corner using a cubic Bézier whose control-point
   * spread increases with the superellipse exponent `n`.
   */
  _smoothCorner(ctx, x0, y0, cx, cy, x1, y1, _r, n) {
    // Standard circle-approximation kappa ≈ 0.5523
    // Scale it up as n grows to widen the curvature transition
    const kappa = 0.5522847498 * (1 + ((n - 2) / 8) * 0.35);

    const cp1x = x0 + (cx - x0) * kappa;
    const cp1y = y0 + (cy - y0) * kappa;
    const cp2x = x1 + (cx - x1) * kappa;
    const cp2y = y1 + (cy - y1) * kappa;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x1, y1);
  }
}

// eslint-disable-next-line no-undef
registerPaint("smooth-corners", SmoothCornersPainter);
