import { IElement } from './IElement';
import { Assign } from './Assign';
import { If } from './If';
import { SubRule } from '../SubRule';
import { IIf } from './IIf';
import { IIteration } from './IIteration';
import { Iteration } from './Iteration';
import { End } from './End';
import { Element } from './Element';
import { IAssign } from './IAssign';
import { IterationHelper } from './IterationHelper';

declare type Constructor = (parentRule: SubRule, serialization: IElement) => Element;

class Deserializer {
    private constructors = new Map<string, Constructor>();

    /**
     * Add deserializations here, when inheriting from Element
     */
    constructor() {
        this.constructors.set('start', (parentRule: SubRule, serialization: IElement) => new End(parentRule, serialization)); // may be redundant
        this.constructors.set('end', (parentRule: SubRule, serialization: IElement) => new End(parentRule, serialization));
        this.constructors.set('assign', (parentRule: SubRule, serialization: IElement) => new Assign(parentRule, serialization as IAssign));
        this.constructors.set('if', (parentRule: SubRule, serialization: IElement) => new If(parentRule, serialization as IIf));
        this.constructors.set('iteration', (parentRule: SubRule, serialization: IElement) => new Iteration(parentRule, serialization as IIteration));
        this.constructors.set('iterationHelper', (parentRule: SubRule, serialization: IElement) => new IterationHelper(parentRule));
    }

    deserializeElement(serialization: IElement, parentRule: SubRule): Element {
        const type = serialization.elementType;
        const converter = this.constructors.get(type);
        if (!converter) {
            throw new Error('bug: deserialization is not implemented for ' + type);
        }
        return converter(parentRule, serialization);
    }

    getCreatableElementTypes(): string[] {
        return Array.from(this.constructors.keys())
            .filter(name => name !== 'start' && name !== 'end' && name !== 'iterationHelper');
    }

    getConstructor(elementType: string): Constructor {
        const elementConstructor = this.constructors.get(elementType);
        if (!elementConstructor) {
            throw new Error('bug: no constructor for: ' + elementType);
        }
        return elementConstructor;
    }
}

export const deserializer = new Deserializer();