import { Element } from './elements/Element';
import { End } from './elements/End';
import { ISubRule } from './ISubRule';
import { IElement } from './elements/IElement';
import { deserializer } from './elements/Deserializer';

/**
 * return false to stop walking
 */
declare type WalkHandler = (element: Element) => boolean;

export class SubRule {
    private first: Element;
    private last: Element;
    
    constructor(
        private parent: Element,
        serialization?: ISubRule
    ) {
        if (serialization) {
            this.deserialize(serialization);
        } else {
            this.createEmptySubRule();
        }
    }

    getFirst(): Element {
        return this.first;
    }
    
    getLast(): Element {
        return this.last;
    }

    getParent(): Element {
        return this.parent;
    }

    isEmpty(): boolean {
        return this.first.next === this.last;
    }

    serialize(): ISubRule {
        let elements: IElement[] = [];
        this.walk(element => {
            elements.push(element.serialize());
            return true;
        });
        return {
            what: 'sub-rule',
            elements
        };
    }

    walk(handler: WalkHandler): void {
        let element = this.first;
        while (element) {
            const ok = handler(element);
            if (!ok) {
                return;
            }
            element = element.next;
        }
    }

    private deserialize(serialization: ISubRule): void {
        const elements = serialization.elements;
        this.first = deserializer.deserializeElement(elements[0], this);
        let previous = this.first;
        let element: Element;
        for (let i = 1; i < elements.length; i++) {
            element = deserializer.deserializeElement(elements[i], this);
            previous.next = element;
            element.prev = previous;
            previous = element;
        }
        this.last = element;
    }

    private createEmptySubRule(): void {
        this.first = new End(this, { text: 'start' });
        this.last = new End(this, { text: 'end' });
        this.first.next = this.last;
        this.last.prev = this.first;
    }
} 