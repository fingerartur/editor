import { AddTwoCommand } from './examples/AddTwoCommand';
import { Counter } from './examples/Counter';

describe('Command', () => {
    let counter: Counter;
    let command: AddTwoCommand;
    beforeEach(() => {
        counter = new Counter();
        command = new AddTwoCommand(counter);
    });

    it('can do an action', () => {
        expect(counter.number).toBe(0);
        command.do();
        expect(counter.number).toBe(2);
    });

    it('can undo an action', () => {
        expect(counter.number).toBe(0);
        command.undo();
        expect(counter.number).toBe(-2);
    });
});