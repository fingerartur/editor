import { Element } from './Element';
import { SubRule } from '../SubRule';
import { IElement } from './IElement';
import { EndEnhancer } from 'enhancers/EndEnhancer';

export class End extends Element {
    constructor(
        parentRule: SubRule,
        serialization?: IElement
    ) {
        super(parentRule);
        if (serialization) {
            super.deserialize(serialization);
        }
        this.graphicalMetadata.isVisible = false;
    }

    getType(): string {
        return 'end';
    }

    enhance(): EndEnhancer {
        return new EndEnhancer(this);
    }

    /**
     * never used
     */
    clone(): Element {
        return null;
    }

    /**
     * never used
     */
    merge(element: any): void {
        return;
    }
    
    getIdsOfVariablesOnTheLeft(): number[] {
        return [];
    }

    getIdsOfVariablesOnTheRight(): number[] {
        return [];
    }

    replaceIds(map: Map<number, number>): void {
        return;
    }
}