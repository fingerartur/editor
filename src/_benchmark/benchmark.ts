import { exportSvg } from './exportSvg';
import { renderRule } from './renderRule';
import { createSvgElementsSnapSvgLibrary } from './createSvgElementsSnapsvgLibrary';
import { layout } from './layout';
import { renderRulePathological } from './renderRulePathological';

/**
 * How long does it take on average to layout and render
 * a rule on an SVG element to be exported.
 */
export function benchmarkExportSvg() {
    runBenchmark(exportSvg, [100, 500, 1000, 2000, 3000], 10);
}

/**
 * How long does it take on average to render a normal shaped rule on screen.
 * (expected viewport size 1500x500 which corresponds to 1920x1080
 * screen resolution)
 */
export function benchmarkRenderRule() {
    runBenchmark(renderRule, [100, 500, 1000, 2000, 3000], 10);
}

/**
 * How long does it take on average to render a completely dense rule on screen.
 * (corresponds to 189 elements displayed on the screen simlutaneously)
 */
export function benchmarkRenderRulePathological() {
    runBenchmark(renderRulePathological, [ 0 ], 10);
}

/**
 * How fast on average is the Snap.svg library at rendering elements.
 * (Render rectangles with a shadow, text and one arrow)
 */
export function benchmarkSpeedOfSnapsvgLibraryForComplexElements() {
    runBenchmark(createSvgElementsSnapSvgLibrary, [100, 500, 1000, 2000, 3000], 10);
}

/**
 * How fast on average is the custom layout algorithm.
 */
export function benchmarkLayout() {
    runBenchmark(layout, [100, 500, 1000, 2000, 3000], 10);
}

function runBenchmark(action: Function, parameters: any[], repetitions: number) {
    for (let i = 0; i < parameters.length; i ++) {
        runBenchmarkForParam(action, parameters[i], repetitions);
    }
}

function runBenchmarkForParam(action: Function, parameter: any, repetitions: number) {
    const times = [];
    for (let i = 0; i < repetitions; i++) {
        const start = performance.now();
        times[i] = action(parameter);
    }
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    console.log({
        parameter,
        'Times in ms': times,
        'Avg': avg
    });
}