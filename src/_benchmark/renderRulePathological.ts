import { Diagram } from 'diagram/Diagram';
import { generateFullRule } from '_testing/generateRule';
import { Rule } from 'rule/Rule';

export function renderRulePathological(): number {
    const rule = new Rule({
        id: 1,
        name: 'New rule',
        description: null,
        rule: generateFullRule(10).serialize(),
        declarations: null
    });
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    Object.defineProperty(svgElement, 'clientWidth', {value: 1500, writable: true});
    Object.defineProperty(svgElement, 'clientHeight', {value: 500, writable: true});
    const diagram = new Diagram(svgElement, rule, () => {});
    diagram.shiftDown(13);
    diagram.shiftRight(2);

    const start = performance.now();
    diagram.render(true); // the skipValidation flag is important because this rule is completely ivalid
    // and error messages would otherwise slow the performance down liearnly
    return performance.now() - start;
}