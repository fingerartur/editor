import { SubRule } from '../SubRule';
import { IElement } from './IElement';
import { IGraphicalMetadata } from './IGraphicalMetadata';
import { Enhancer } from 'enhancers/Enhancer';
import { IError } from '../validator/IError';

/**
 * When creating a subclass of Element, do not forget to update ./Deserializer.ts
 */
export abstract class Element {
    public text: string = null;
    public next: Element = null;
    public prev: Element = null;
    public errors: IError[] = [];
    public graphicalMetadata: IGraphicalMetadata = {
        isVisible: true,
        isCollapsed: false,
        isSelected: false,
        hasInvalidDescendant: false,
        shouldBlink: false
    };

    constructor(
        public parentRule: SubRule
    ) {}

    abstract getType(): string;
    abstract enhance(): Enhancer;
    abstract merge(element: any): void;
    abstract clone(): Element;
    abstract getIdsOfVariablesOnTheRight(): number [];
    abstract getIdsOfVariablesOnTheLeft(): number[];
    abstract replaceIds(map: Map<number, number>): void;

    insertAfter(followingElement: Element): void {
        if (!this.next) {
            throw new Error('next is null');
        }

        const next = this.next;
        this.next = followingElement;
        followingElement.prev = this;

        followingElement.next = next;
        next.prev = followingElement;
        followingElement.parentRule = this.parentRule;
    }

    /**
     * includes usages of variables and assignments to variables (including declarations)
     */
    getIdsOfVariables(): number[] {
        return this.getIdsOfVariablesOnTheLeft()
            .concat(this.getIdsOfVariablesOnTheRight());
    }
    
    remove(): void {
        if (!this.prev || !this.next) {
            throw new Error('cannot delete start/end');
        }

        this.prev.next = this.next;
        this.next.prev = this.prev;
    }

    getParent(): Element {
        if (this.parentRule) {
            return this.parentRule.getParent();    
        } else {
            return null;
        }
    }

    deserialize(serialization: IElement): void {
        this.text = serialization.text;
        this.errors = serialization.errors;
        if (!this.errors) {
            this.errors = [];
        }
    }

    serialize(): IElement {
        return {
            text: this.text,
            what: 'element',
            elementType: this.getType(),
            errors: this.errors
        };
    }

    getSubRules(): SubRule[] {
        return[];
    }

    clearErrors(): void {
        this.errors = [];
    }

    addError(error: IError): void {
        this.errors.push(error);
    }

    isValid(): boolean {    
        return this.errors.length === 0;
    }

    isMarked(): boolean {
        if (!this.graphicalMetadata.hasInvalidDescendant) {
            this.graphicalMetadata.hasInvalidDescendant = false;
        }
        return !this.isValid() || this.graphicalMetadata.hasInvalidDescendant === true;
    }
}