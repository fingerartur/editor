import { Sets } from 'utils/Sets';
import { Element } from 'rule/elements/Element';
import { Traverser } from 'rule/traverser/Traverser';

export class Selection {
    private selected = new Set<Element>();
    constructor(
        public onChange: Function
    ) {}

    change(elements: Set<Element>) {
        this.execute(() => {
            this.selected = elements;
        });
    }

    add(elements: Set<Element>) {
        this.execute(() => {
            this.selected = Sets.union(this.selected, elements);
        });
    }

    remove(elements: Set<Element>) {
        this.execute(() => {
            this.selected = Sets.difference(this.selected, elements);
        });
    }

    clear() {
        this.execute(() => {
            this.selected.clear();
        });
    }

    getAll(): Set<Element> {
        return new Set(this.selected);
    }

    private execute(selectionChange: Function) {
        const before = new Set(this.selected);

        this.markSubElements(this.selected, false);
        this.selected.forEach(element => {
            element.graphicalMetadata.isSelected = false;
        });

        selectionChange();

        this.removeSubElements();
        this.selected.forEach(element => {
            element.graphicalMetadata.isSelected = true;
        });
        this.markSubElements(this.selected, true);

        if (!Sets.equal(this.selected, before)) {
            this.onChange();
        }
    }

    private removeSubElements(): void {
        const traverser = new Traverser();
        const subElements = new Set<Element>();
        this.selected.forEach(element => {
            traverser.traverseParents(element, traverserdElement => {
                this.selected.forEach(element2 => {
                    if (traverserdElement === element2) { // one of the other elements is a parent of this one
                        subElements.add(element);
                    }
                });
                return !subElements.has(element);
            }, { includeStart: false , includeEndType: false, skipInvalid: false });
        });
        subElements.forEach(element => {
            this.selected.delete(element);
        });
    }

    private markSubElements(elements: Set<Element>, selected: boolean): void {
        const traverser = new Traverser();
        elements.forEach(element => {
            traverser.diveDown(element, element2 => {
                element2.graphicalMetadata.hasSelectedParent = selected;
                return true;
            }, { includeEndType: false, includeStart: false, skipInvalid: false });
        });
    }
}