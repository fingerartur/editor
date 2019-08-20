import { Diagram } from 'diagram/Diagram';
import { generateRule } from '_testing/generateRule';
import { Rule } from 'rule/Rule';

export function exportSvg(size: number): number {
    const rule = new Rule({
        id: 1,
        name: 'New rule',
        description: null,
        rule: generateRule(size).serialize(),
        declarations: null
    });
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const diagram = new Diagram(svgElement, rule, () => {});
    
    const start = performance.now();

    diagram.exportAsDataUrl();

    return performance.now() - start;
}