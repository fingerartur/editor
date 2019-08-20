import { AssigningElement } from './AssigningElement';
import { SubRule } from '../SubRule';
import { Iteration } from './Iteration';
import { Enhancer } from 'enhancers/Enhancer';
import { IElement } from './IElement';
import { IError } from '../validator/IError';

/**
 * Holds the iteration variable of an iteraion element.
 * Acts as a proxy for functions concerning declared variables and validation.
 * 
 * It does not need to be part of the serialization sent to the
 * server component. (All the data is inside the Iteration element).
 */
export class IterationHelper extends AssigningElement {
    /**
     * master is set by the Iteration element
     * (at creation and after deserialization)
     */
    public master: Iteration;

    constructor(
        parentRule: SubRule
    ) {
        super(parentRule);
        this.graphicalMetadata.isVisible = false;
    }

    merge(): void {
        return;
    }

    getIdsOfVariablesOnTheLeft(): number[] {
        if (this.master.variable) {
            return [ this.master.variable.id ];
        } else {
            return [];
        }
    }

    getIdsOfVariablesOnTheRight(): number [] {
        return [];
    }

    serialize(): IElement {
        return {
            what: 'element',
            elementType: this.getType()
        };
    }

    getType(): string {
        return 'iterationHelper';
    }

    /**
     * will never be displayed, does not need an enhancer
     */
    enhance(): Enhancer {
        return null;
    }

    clone(): IterationHelper {
        return new IterationHelper(null);
    }

    isDeclaration(): boolean {
        return this.master.variable != null;
    }

    addError(error: IError): void {
        this.master.addError(error);
    }

    clearErrors(): void {
        this.master.clearErrors();
    }

    replaceIds(map: Map<number, number>): void {
        return;
    }
}