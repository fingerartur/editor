import { AssigningElement } from '../elements/AssigningElement';
import { Traverser } from '../traverser/Traverser';
import { Declarations } from '../declarations/Declarations';
import { Element } from '../elements/Element';

export class AutoCorrect {
    private traverser = new Traverser();
    constructor(
        private declarations: Declarations
    ) {}
    
    autocorrectDeclarations(pastedElements: Element[]): void {
        const elements = new Set<Element>(pastedElements);
        const ids = this.getIdsOfDeclarationsBelow(elements);
        const idMap = this.redeclare(ids);
        this.replaceIds(elements, idMap);
    }

    redeclare(ids: Set<number>): Map<number, number> {
        const result = new Map<number, number>();
        ids.forEach(id => {
            const originalDeclaration = this.declarations.get(id);
            const newId = this.declarations.create(originalDeclaration.name, {...originalDeclaration.type});
            result.set(id, newId);
        });
        return result;
    }

    replaceIds(elements: Set<Element>, ids: Map<number, number>): void {
        elements.forEach(element => {
            this.traverser.diveDown(element, element2 => {
                element2.replaceIds(ids);
                return true;
            },
            {
                includeStart: true,
                includeEndType: false,
                skipInvalid: false
            });
        });
    }

    getIdsOfDeclarationsBelow(elements: Set<Element>): Set<number> {
        const ids = new Set<number>();
        elements.forEach(element => {
            this.traverser.diveDown(element, element2 => {
                if (element2 instanceof AssigningElement && element2.isDeclaration()) {
                    element2.getIdsOfVariablesOnTheLeft().forEach(id => ids.add(id));
                }
                return true;
            },
            {
                includeStart: true,
                includeEndType: false,
                skipInvalid: false
            });
        });
        return ids;
    }
}