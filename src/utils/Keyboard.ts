import { Key } from 'ts-keycode-enum';

declare type ComboHandler = (event: KeyboardEvent) => void;

export class Keyboard {
    private mapCombosToHandlers = new Map<number[], Function[]>();
    private pressedKeys = new Set<number>();

    constructor(
        private domNode: HTMLElement | SVGElement
    ) {
        this.startListening();
    }

    on(keys: Key | Array<Key> | Array<Array<Key>>, callback: ComboHandler): void {
        let wrap: Array<Array<Key>>;
        if (typeof keys === 'number') {
            wrap = [[keys as Key]];
        } else if (keys.length > 0) {
            if (typeof keys[0] === 'number') {
                wrap = [keys as Array<Key>];
            } else {
                wrap = keys as Array<Array<Key>>;
            }
        }
        wrap.forEach((keyCombo: Array<Key>) => {
            this.onCombo(keyCombo, callback);
        });
    }

    startListening(): void {
        this.domNode.addEventListener('keydown', this.handleKeyDown);
        this.domNode.addEventListener('keyup', this.handleKeyUp);
    }

    stopListening(): void {
        this.domNode.removeEventListener('keydown', this.handleKeyDown);
        this.domNode.removeEventListener('keyup', this.handleKeyUp);
        this.pressedKeys.clear();
    }

    isComboPressed(combo: number[]): boolean {
        if (combo.length !== this.pressedKeys.size) {
            return false;
        }
        let result = true;
        combo.forEach(key => {
            if (!this.pressedKeys.has(key)) {
                result = false;
            }
        });
        return result;
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        this.pressedKeys.add(event.keyCode);

        this.mapCombosToHandlers.forEach((handlers, combo) => {
            if (this.isComboPressed(combo)) {
                handlers.forEach(handler => handler(event));
            }
        });
    }

    private handleKeyUp = (event: KeyboardEvent) => {
        this.pressedKeys.delete(event.keyCode);
    }

    private onCombo(combo: Array<Key>, callback: ComboHandler): void {
        if (!this.mapCombosToHandlers.has(combo)) {
            this.mapCombosToHandlers.set(combo, []);
        }
        const handlers = this.mapCombosToHandlers.get(combo);
        handlers.push(callback);
    }

    private getShortcutName(keys: Key[]): string {
        return 'S-' + keys.join('-');
    }
}
