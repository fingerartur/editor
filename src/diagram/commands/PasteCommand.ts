import { Command } from 'utils/invoker/Command';
import { Element } from 'rule/elements/Element';

export class PasteCommand extends Command {
    constructor(
        private parent: Element,
        private pastedElements: Element[]
    ) {
        super();
    }
    
    do() {
        let parent = this.parent;
        this.pastedElements.forEach(element => {
            parent.insertAfter(element);
            parent = element;
        });
    }

    undo() {
        this.pastedElements.forEach(element => element.remove());
    }
}