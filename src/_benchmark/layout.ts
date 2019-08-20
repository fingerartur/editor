import { generateRule } from '_testing/generateRule';
import { Layout } from 'diagram/layout/Layout';
import { Viewport } from 'diagram/Viewport';
import { Sizes } from 'diagram/Sizes';

/**
 * benchmarkLayout(10);     // 1 ms
 * benchmarkLayout(100);    // 1 ms
 * benchmarkLayout(1000);   // 12 ms
 * benchmarkLayout(5000);   // 30 ms
 * benchmarkLayout(100000); // stack overflow
 */
export function layout(count: number): number {
    const mil = 1000000;
    const viewport = new Viewport(0, mil, 0, mil);
    const sizes = new Sizes();
    const rule = generateRule(count);

    const t = performance.now();
    Layout.layout(rule, viewport, sizes);
    return performance.now() - t;
}
