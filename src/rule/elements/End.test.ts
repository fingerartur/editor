import { Element } from './Element';
import { SubRule } from '../SubRule';
import { End } from './End';
import { Assign } from './Assign';

describe('End', () => {
    let parent: Element;
    let end: End;
    beforeEach(() => {
        parent = new Assign(null);
        end = new End(new SubRule(parent));
    });

    it('constructs', () => {
        //
    });

    it('has element type "end"', () => {
        expect(end.getType()).toBe("end");
    });

    it('is not visible', () => {
        expect(end.graphicalMetadata.isVisible).toBeFalsy();
    });

    it('does not hold any variables', () => {
        expect(end.getIdsOfVariables()).toEqual([]);
    });

    it('has an enhancer', () => {
        expect(end.enhance()).not.toBeNull();
    });

    it('serializes', () => {
        expect(end.serialize()).toMatchObject({
            what: 'element',
            elementType: 'end'
        });
    });

    it('deserializes', () => {
        end = new End(new SubRule(parent), { what: 'element', elementType: 'end', text: 'start' });
        expect(end.text).toBe('start');
    });
});