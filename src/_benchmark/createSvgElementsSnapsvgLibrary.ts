import { Graphics } from 'diagram/graphics/Graphics';
import * as Snap from 'snapsvg-cjs';
import { Sizes } from 'diagram/Sizes';

/**
 * Render rectangles with a shadow, text and one arrow.
 * 10   50 ms avg
 * 100  250 ms avg
 * 1K   1.6 s avg
 * 10K  17 s avg
 */
export function createSvgElementsSnapSvgLibrary(count: number): number {
    const snap = Snap(1000, 1000);
    const sizes = new Sizes();
    const graphics = new Graphics(snap, sizes);
    const t = performance.now();
    for (let  i = 0; i < count; i++) {
        graphics.renderElementRectangle({ x: 10, y: 10 + i, width: 100, height: 100 });
        graphics.renderElementText(10, 10 + i, 'Description of this element. This is a relatively long text and may be broken down to multiple SVG text elements.');
        graphics.renderDownArrow({ x: 10, y: 20 + i }, { x: 20, y: 30 + i }, 10);
    }
    snap.clear();
    return performance.now() - t;
}

/**
 * @Deprecated
 * Render rectangles
 * 10 3.5 ms
 * 100 25 ms
 * 1K 180 ms
 * 10K 1.3 s
 */
function benchmarkSnapSvg(count: number): void {
    const snap = Snap(1000, 1000);
    const t = performance.now();
    for (let  i = 0; i < count; i++) {
        snap.rect(10, i, 100, 20, 1);
    }
    console.log(performance.now() - t, ' ms');
}