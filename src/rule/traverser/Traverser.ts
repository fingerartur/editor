import { ITraversalOptions } from './ITraversalOptions';
import { End } from '../elements/End';
import { Element } from '../elements/Element';
import { TraversalStoppedException } from './TraversalStoppedException';

/**
 * @return false to stop the traversal
 */
declare type TraverseHandler = (element: Element) => boolean;

export class Traverser {

    traverseParents(start: Element, callback: TraverseHandler, options: ITraversalOptions): void {
        try {
            let element = start;
            while (element) {
                this.applyCallback(element, start, callback, options);
                element = element.getParent();
            }    
        } catch (e) {
            if (!(e instanceof TraversalStoppedException)) {
                throw e;
            }
        }
    }

    /**
     * Traverses previous elements, parent elements and their previous elements etc., going all the way up to the root.
     */
    traverseUp(start: Element, callback: TraverseHandler, options: ITraversalOptions): void {
        try {
            let element: Element = start;
            while (true) {
                while (true) {
                    this.applyCallback(element, start, callback, options);
                    if (element.prev) {
                        element = element.prev;
                    } else {
                        break;
                    }
                }

                const parent = element.getParent();
                if (parent) {
                    element = parent;
                } else {
                    return;
                }
            }
        } catch (e) {
            if (!(e instanceof TraversalStoppedException)) {
                throw e;
            }
        }
    }

    /**
     * Traverses this element and all following elements and all their sub-rules.
     * Order of traversal: element, all its sub-rules from left to righ (recursively), next element, etc.
     */
    traverseDown(start: Element, callback: TraverseHandler, options: ITraversalOptions): void {
        try {
            this.dive(start, callback, options);
            options.includeStart = true;
            let element = start.next;
            while (element) {
                this.dive(element, callback, options);
                element = element.next;
            }
        } catch (e) {
            if (!(e instanceof TraversalStoppedException)) {
                throw e;
            }
        }
    }

    /**
     * Traverses this element and all its sub-rules.
     * Order of traversal: element, all its sub-rules from left to righ (recursively).
     */
    diveDown(start: Element, callback: TraverseHandler, options: ITraversalOptions): void {
        try {
            this.dive(start, callback, options);
        } catch (e) {
            if (!(e instanceof TraversalStoppedException)) {
                throw e;
            }
        }
    }

    /**
     * @throws TraversalStoppedException
     */
    private dive(start: Element, callback: TraverseHandler, options: ITraversalOptions): void {
        this.applyCallback(start, start, callback, options);
        options.includeStart = true;
        start.getSubRules().forEach(subRule => {
            subRule.walk(element => {
                this.dive(element, callback, options);
                return true;
            });
        });
    }

    /**
     * @throws TraversalStoppedException
     */
    private applyCallback(element: Element, startElement: Element, callback: TraverseHandler, options: ITraversalOptions): void {
        let shouldSkip = (!options.includeStart && element === startElement)
            || (options.skipInvalid && !element.isValid())
            || (!options.includeEndType && element instanceof End);
        if (!shouldSkip) {
            const ok = callback(element);
            if (!ok) {
                throw new TraversalStoppedException();
            }
        }
    }    
}