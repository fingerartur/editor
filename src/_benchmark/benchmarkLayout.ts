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
export function benchmarkLayout(count: number): void {
    const viewport = new Viewport(0, 0, 1000, 1000);
    // size of the viewport is irrelevant for the benchmark
    const sizes = new Sizes();
    const elementsPerLevel = 5;
    const levels = count / elementsPerLevel;
    const rule = generateRule(levels);

    const t = performance.now();
    Layout.layout(rule, viewport, sizes);
    console.log('layout in: ', performance.now() - t, ' ms');
}
