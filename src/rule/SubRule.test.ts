import { Assign } from './elements/Assign';
import { End } from './elements/End';
import { SubRule } from './SubRule';
import { Element } from './elements/Element';
import { ISubRule } from './ISubRule';
import { IElement } from './elements/IElement';

describe('SubRule', () => {
    const serialization: ISubRule = {
        what: 'sub-rule',
        elements: [
            {
                what: 'element',
                elementType: 'end'
            },
            {
                what: 'element',
                elementType: 'assign',
                text: 'Initialize variables about goods',
                assignments: []
            } as IElement,
            {
                what: 'element',
                elementType: 'end'
            }
        ]
    };
    let rule: SubRule;
    beforeEach(() => {
        rule = new SubRule(null);
    });

    it('deserializes', () => {
        rule = new SubRule(null, serialization);
        const start = rule.getFirst();
        const assign = start.next;
        const end = assign.next;
        expect(start instanceof End).toBeTruthy();
        expect(assign instanceof Assign).toBeTruthy();
        expect(end instanceof End).toBeTruthy();
    });

    it('constructs', () => {
        expect(rule.getParent()).toBeNull();
    });

    it('creates start element', () => {
        const first = rule.getFirst();
        expect(first instanceof End).toBeTruthy();
        expect(first.prev).toBeNull();
        expect(first.parentRule).toBe(rule);
    });

    it('creates end element', () => {
        const last = rule.getLast();
        expect(last instanceof End).toBeTruthy();
        expect(last.next).toBeNull();
        expect(last.parentRule).toBe(rule);
    });

    it('creates ONLY start and end elements', () => {
        const first = rule.getFirst();
        const last = rule.getLast();
        expect(first.next).toBe(last);
        expect(last.prev).toBe(first);
    });
    
    it('accepts a parent element', () => {
        const elem = new Assign(null);
        rule = new SubRule(elem);
        expect(rule.getParent()).toBe(elem);
    });

    it('tells if it is empty', () => {
        expect(rule.isEmpty()).toBeTruthy();
        rule.getFirst().insertAfter(new Assign(null));
        expect(rule.isEmpty()).toBeFalsy();
    });

    it('can be walked', () => {
        const elements: Element[] = [];
        rule = new SubRule(null, serialization);
        rule.walk((element) => {
            elements.push(element);
            return true;
        });
        expect(elements[0] instanceof End).toBeTruthy();
        expect(elements[1] instanceof Assign).toBeTruthy();
        expect(elements[2] instanceof End).toBeTruthy();
        expect(elements.length).toBe(3);
    });

    it('walk can be cancelled', () => {
        const elements: Element[] = [];
        rule = new SubRule(null, serialization);
        rule.walk((element) => {
            elements.push(element);
            return false;
        });
        expect(elements.length).toBe(1);
    });

    it('serializes', () => {
        rule.getFirst().insertAfter(new Assign(null));
        const expected: ISubRule = {
            what: 'sub-rule',
            elements: [
                { what: 'element', elementType: 'start' },
                { what: 'element', elementType: 'assign' },
                { what: 'element', elementType: 'end' }
            ]
        };
        const result = rule.serialize();
        expect(result.what).toBe('sub-rule');
        expect(result.elements.length).toBe(3);
        expect(result.elements[0].what).toBe('element');
        expect(result.elements[1].what).toBe('element');
        expect(result.elements[2].what).toBe('element');
    });
});