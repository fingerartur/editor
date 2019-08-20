import { Diagram } from 'diagram/Diagram';
import { generateRule } from '_testing/generateRule';
import { Rule } from 'rule/Rule';

export function renderRule(size: number): number {
    const rule = new Rule({
        id: 1,
        name: 'New rule',
        description: null,
        rule: generateRule(size).serialize(),
        declarations: null
    });
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    Object.defineProperty(svgElement, 'clientWidth', {value: 1500, writable: true});
    Object.defineProperty(svgElement, 'clientHeight', {value: 500, writable: true});
    const diagram = new Diagram(svgElement, rule, () => {});
    diagram.shiftDown();

    const start = performance.now();
    diagram.render(true); // the skipValidation flag is important because this rule is completely ivalid
    // and error messages would otherwise slow the performance down liearnly
    return performance.now() - start;
}