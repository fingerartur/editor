import { Element } from 'rule/elements/Element';
import { Command } from 'utils/invoker/Command';

export class DeleteCommand extends Command {
    private previous: Element;
    constructor(
        private element: Element
    ) {
        super();
    }
    
    do() {
        this.element.graphicalMetadata.isSelected = false;
        this.previous = this.element.prev;
        this.element.remove();
    }

    undo() {
        this.previous.insertAfter(this.element);
    }
}