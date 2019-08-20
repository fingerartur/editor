import { Command } from './Command';

export class CommandInvoker {
  private queue: Command[] = [];
  private cursor = 0; // first empty field

  invoke(command: Command): void {
    command.do();
    this.queue[this.cursor] = command;
    this.cursor++;
    this.clearFutureRedos();
  }

  canUndo(): boolean {
    return this.cursor > 0;
  }

  canRedo(): boolean {
    return this.cursor < this.queue.length;
  }

  undo(): void {
    if (this.canUndo()) {
      this.cursor--;
      this.queue[this.cursor].undo();
    }
  }

  undoAndErase(): void {
    this.undo();
    this.clearFutureRedos();
  }

  redo(): void {
    if (this.canRedo()) {
      this.queue[this.cursor].do();
      this.cursor++;
    }    
  }

  private clearFutureRedos(): void {
    if (this.cursor < this.queue.length) {
      this.queue = this.queue.slice(0, this.cursor);
    }
  }
}
