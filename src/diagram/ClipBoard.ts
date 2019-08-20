import { Element } from 'rule/elements/Element';

export class ClipBoard {
    private elements = new Set<Element>();

    copyTo(elements: Set<Element>): void {
        this.elements = elements;
    }

    pasteFrom(): Set<Element> {
        let result = new Set<Element>();
        this.elements.forEach(element => {
            result.add(element.clone());
        });
        return result;
    }
}