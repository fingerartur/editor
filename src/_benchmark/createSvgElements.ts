/**
 * Create SVG rectangles using DOM API
 * 
 * 100 2 ms avg
 * 1K 20 ms avg
 * 10K 140 ms avg
 * 100K 2.5 s avg
 */
export function benchmarkPureSvg(count: number): number {
    const namespace = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(namespace, 'svg');
    const t = performance.now();
    for (let i = 0; i < count; i++) {
        var rect = document.createElementNS(namespace, 'rect');
        rect.setAttributeNS(null, 'x', 10 + '');
        rect.setAttributeNS(null, 'y', i + '');
        rect.setAttributeNS(null, 'height', '100');
        rect.setAttributeNS(null, 'width', '100');
        svg.appendChild(rect);
    }
    return performance.now() - t;
}