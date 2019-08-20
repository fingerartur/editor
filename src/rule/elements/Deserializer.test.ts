import { IterationHelper } from './IterationHelper';
import { SubRule } from '../SubRule';
import { Iteration } from './Iteration';
import { IIteration } from './IIteration';
import { IIf } from './IIf';
import { End } from './End';
import { Assign } from './Assign';
import { IAssign } from './IAssign';
import { deserializer } from './Deserializer';
import { If } from './If';

describe('Deserializer', () => {

    it('constructs', () => {
        //
    });

    describe('can deserialize', () => {

        it('Assign', () => {
            const result = deserializer.deserializeElement({
                what: "element",
                elementType: "assign",
                variable: null,
                expression: null
            } as IAssign, null);
            expect(result instanceof Assign);
        });

        it('End', () => {
            const result = deserializer.deserializeElement({
                what: "element",
                elementType: "end",
            }, null);
            expect(result instanceof End);
        });

        it('If', () => {
            const result = deserializer.deserializeElement({
                what: "element",
                elementType: "if",
                condition: null,
                branchTrue: null,
                branchFalse: null
            } as IIf, null);
            expect(result instanceof If);
        });
        
        it('Iteration', () => {
            const result = deserializer.deserializeElement({
                what: "element",
                elementType: "iteration",
                cycle: null,
                variable: null,
                array: null
            } as IIteration, null);
            expect(result instanceof Iteration);
        });

        it('IterationHelper', () => {
            const result = deserializer.deserializeElement({
                what: "element",
                elementType: "iterationHelper"
            }, null);
            expect(result instanceof IterationHelper);
        });
    });

    it('returns creatable element types', () => {
        expect(deserializer.getCreatableElementTypes().sort()).toEqual([ 'assign', 'if', 'iteration']);
    });
});