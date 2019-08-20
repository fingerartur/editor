import { Element } from 'rule/elements/Element';
import { Selection } from '../interactivity/selection/Selection';
import { Command } from 'utils/invoker/Command';

export class SelectCommand extends Command {
    private before: Set<Element>;
    constructor(
        private elements: Set<Element>,
        private selection: Selection
    ) {
        super();
    }
    
    do() {
        this.before = this.selection.getAll();
        this.selection.change(this.elements);
    }

    undo() {
        this.selection.change(this.before);
    }
}