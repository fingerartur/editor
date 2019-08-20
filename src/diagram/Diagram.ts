import { Key } from 'ts-keycode-enum';
import * as Snap from 'snapsvg-cjs';
import { Rule } from 'rule/Rule';
import { Viewport } from './Viewport';
import { SubRule } from 'rule/SubRule';
import { Element } from 'rule/elements/Element';
import { DeleteCommand } from './commands/DeleteCommand';
import { Keyboard } from 'utils/Keyboard';
import { ClipBoard } from './ClipBoard';
import { Graphics } from './graphics/Graphics';
import { Interactivity } from './interactivity/Interactivity';
import { Layout } from './layout/Layout';
import { Renderer } from './renderer/Renderer';
import { Sizes } from './Sizes';
import { Utils } from './Utils';
import { RubberBand } from './interactivity/selection/RubberBand';
import { Selection } from './interactivity/selection/Selection';
import { SelectCommand } from './commands/SelectCommand';
import { Validator } from 'rule/validator/Validator';
import { Traverser } from 'rule/traverser/Traverser';
import { CommandInvoker } from 'utils/invoker/CommandInvoker';
import { MultiCommand } from 'utils/invoker/MultiCommand';
import { notification } from 'antd';
import { IDragInfo } from './interactivity/IDragInfo';
import { PasteCommand } from './commands/PasteCommand';
import { AutoCorrect } from 'rule/auto-correct/AutoCorrect';
import { Command } from 'utils/invoker/Command';

declare type EditElementHandler = (element: Element) => void;
declare type ElementCreatedHandler = EditElementHandler;

const SHIFT_OFFSET = 100;

export class Diagram {
    private svg: Snap.Paper;
    private timeStart: number = null;
    private viewPort: Viewport;
    private rule: SubRule;
    private invoker: CommandInvoker;
    private keyboard: Keyboard;
    
    private interactivity: Interactivity;
    private graphics: Graphics;
    private sizes: Sizes;
    private isEnabledInfo = true;

    private clipboard = new ClipBoard();
    private rubberBand: RubberBand;
    private selection: Selection;

    private validator: Validator;
    private lastFoundElementOrder = 0;
    private lastSearchedString: string;

    public onEdit: EditElementHandler = () => {};
    public onCreate: ElementCreatedHandler = () => {};
    
    constructor(
        private anchor: SVGElement,
        private masterRule: Rule,
        private t: Function, // translation function
    ) {
        this.validator = new Validator(this.masterRule, this.t);
        this.rule = masterRule.rule;
        this.svg = Snap(this.anchor);
        this.clear();
        this.sizes = new Sizes();
        this.viewPort = new Viewport(0, anchor.clientWidth, 0, anchor.clientHeight);
        this.graphics = new Graphics(this.svg, this.sizes);
        this.invoker = new CommandInvoker();
        this.startListeningToKeyboardCombos();
        this.selection = new Selection(() => { this.render(); });
        this.rubberBand = new RubberBand(this.svg.node, this.graphics, (elements) => {
            if (this.selection.getAll().size > 0 || elements.size > 0) {
                this.invoker.invoke(new SelectCommand(elements, this.selection));
            }
        });
        
        this.makeFocusable();
        this.focus();

        this.svg.node.onmouseenter = () => {
            this.rubberBand.finish();
        };

        this.svg.node.onkeydown = (event: KeyboardEvent) => {
            if (event.keyCode === Key.PageDown || event.keyCode === Key.DownArrow) {
                this.shiftDown();
            } else if (event.keyCode === Key.PageUp || event.keyCode === Key.UpArrow) {
                this.shiftUp();
            } else if (event.keyCode === Key.RightArrow) {
                this.shiftRight();
            } else if (event.keyCode === Key.LeftArrow) {
                this.shiftLeft();
            } else if (event.keyCode === Key.Delete) {
                this.removeSelectedElements();
                this.render();
            }
        };
        this.onEdit = () => {};

        this.svg.node.onwheel = (event: WheelEvent) => {
            if (event.deltaY > 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }
        };
    }

    shiftRight(times: number = 1) {
        this.viewPort.shiftHorizontally(SHIFT_OFFSET * times);
        this.render();
    }

    shiftLeft() {
        this.viewPort.shiftHorizontally(-SHIFT_OFFSET);
        this.render();
    }

    shiftUp() {
        this.viewPort.shiftVertically(-SHIFT_OFFSET);
        this.render();
    }

    shiftDown(times: number = 1) {
        this.viewPort.shiftVertically(SHIFT_OFFSET * times);
        this.render();
    }

    goBackToStart() {
        this.viewPort.shiftHorizontally(-this.viewPort.xMin);
        this.viewPort.shiftVertically(-this.viewPort.yMin);
        this.render();
    }

    focus(): void {
        this.svg.node.focus();
    }

    destroy(): void {
        this.keyboard.stopListening();
        this.rubberBand.destroy();
        this.clear();
    }

    enableInfo(enable: boolean): void {
        this.isEnabledInfo = enable;
    }

    removeSelectedElements(): void {
        const commands: Command[] = [ new SelectCommand(new Set<Element>(), this.selection) ];
        const selected = this.selection.getAll();
        selected.forEach(element => {
            commands.push(new DeleteCommand(element));
        });
        this.invoker.invoke(new MultiCommand(commands));
        this.render();
    }

    render(skipValidation: boolean = false): void {
        let invalidElements = new Set<Element>();
        if (!skipValidation) {
            invalidElements = this.validator.validate();
        }

        this.clear();
        this.graphics.initialize();
        this.startTimer();

        const positions = Layout.layout(this.rule, this.viewPort, this.sizes);
        // this.renderTimeAndCount();
        
        const interactivityInfo = Renderer.render(positions, this.graphics, this.sizes);

        // interactivity
        this.interactivity = new Interactivity(this.svg.node, this.graphics, this.sizes);
        this.interactivity.onClick = this.onEdit;
        this.interactivity.onCollapse = () => {
            this.render();
        };
        
        this.interactivity.onDrop = (parent: Element, info: IDragInfo) => {
            this.invoker.invoke(
                new MultiCommand([
                    new PasteCommand(parent, info.elements),
                    new SelectCommand(new Set<Element>(), this.selection)
                ])
            );
            if (info.isNew) {
                this.onCreate(info.elements[0]);
            } else {
                new AutoCorrect(this.masterRule.declarations).autocorrectDeclarations(info.elements);
            }
            this.render();
        };

        this.interactivity.addInteractivity(interactivityInfo);
        this.rubberBand.setVisibleElements(interactivityInfo.elements);
        
        if (this.isEnabledInfo) {
            this.renderTimeAndCount();
        }
        this.renderBackToStart();
        // this.shiftRule(0, 0);

        this.renderErrorFinder(invalidElements);
    }

    cancelNewlyCreatedElement() {
        this.invoker.undoAndErase();
    }

    undo() {
        if (this.invoker.canUndo()) {
            this.invoker.undo();
        } else {
            notification.error({
                message: null,
                description: this.t('cannot_undo')
            });
        }
    }

    exportAsDataUrl(): string {
        const t0 = performance.now();
        const mil = 1000000;
        const viewPort = new Viewport(0, mil, 0, mil);
        const sizes = new Sizes();
        const positions = Layout.layout(this.rule, viewPort, sizes);
        let width = 0;
        let height = 0;
        positions.forEach(position => {
            width = Math.max(width, position.x);
            height = Math.max(height, position.y);
        });
        width += 2 * sizes.getSquareWidth();
        height += 2 * sizes.getSquareHeight();
        const svg = Snap(width, height);
        svg.node.style.display = 'none';
        const graphics = new Graphics(svg, sizes);

        Renderer.render(positions, graphics, sizes);
        // maybe render collapsers

        const dataUrl = Utils.getSvgDataUrl(svg.node);
        svg.node.remove();
        console.log('export time in ms: ', performance.now() - t0);
        return dataUrl;
    }

    zoomIn() {
        this.sizes.zoomIn();
        this.render();
    }

    zoomOut() {
        this.sizes.zoomOut();
        this.render();
    }

    find(description: string): void {
        if (this.lastSearchedString !== description) {
            this.lastFoundElementOrder = 0;
        }
        this.lastSearchedString = description;
        const start = this.rule.getFirst();
        const pattern = description.trim().toLocaleLowerCase();
        let foundElement: Element;
        let countFoundElements = 0;
        new Traverser().traverseDown(start, (element: Element) => {
            const text = element.text.toLocaleLowerCase().trim();
            if (text.match(pattern)) {
                countFoundElements++;
                if (countFoundElements > this.lastFoundElementOrder) {
                    this.lastFoundElementOrder++;
                    foundElement = element;
                    return false;
                }
            }
            return true;
        },
        {
            includeEndType: false,
            includeStart: true,
            skipInvalid: false
        });

        if (!foundElement && this.lastFoundElementOrder > 0) {
            this.lastFoundElementOrder = 0;
            this.find(description);
        }

        if (foundElement) {
            foundElement.graphicalMetadata.shouldBlink = true;
            this.scrollToElement(foundElement);
            console.log('Found', foundElement);
        } else {
            console.log('Found nothing --');
        }
    }

    private getCountElements(): number {
        const start = this.rule.getFirst();
        let count = 2;
        new Traverser().traverseDown(start, (element: Element) => {
            count ++;
            return true;
        },
        {
            includeEndType: false,
            includeStart: false,
            skipInvalid: false
        });
        return count;
    }

    private startListeningToKeyboardCombos(): void {
        this.keyboard = new Keyboard(this.anchor);
        
        this.keyboard.on([ Key.Ctrl, Key.Z ], () => {
            this.undo();
            this.render();
        });

        this.keyboard.on([ Key.Ctrl, Key.X ], () => {
            this.clipboard.copyTo(this.selection.getAll());
            this.removeSelectedElements();
            this.render();
        });

        this.keyboard.on([ Key.Ctrl, Key.Shift, Key.Z ], () => {
            if (this.invoker.canRedo()) {
                this.invoker.redo();
                this.render();
            } else {
                notification.error({
                    message: null,
                    description: this.t('cannot_redo')
                });
            }
        });

        this.keyboard.on([ Key.Ctrl, Key.C ], () => {
            this.clipboard.copyTo(this.selection.getAll());
        });

        this.keyboard.on([ Key.Ctrl, Key.V ], () => {
            const pasted = Array.from(this.clipboard.pasteFrom());
            this.interactivity.startDragging(pasted, false);
        });

        this.keyboard.on([ Key.Ctrl, Key.PlusSign ], e => {
            this.zoomIn();
            e.preventDefault();
        });

        this.keyboard.on([ Key.Ctrl, Key.Dash ], e => {
            this.zoomOut();
            e.preventDefault();
        });
    }

    private makeFocusable(): void {
        this.svg.node.tabIndex = 0;
    }

    private clear(): void {
        this.svg.clear();
    }

    private renderBackToStart(): void {
        const text = this.svg.text(10, 20, this.t('back_to_start'));
        text.attr({
            cursor: 'pointer'
        });
        text.node.onclick = () => {
            this.goBackToStart();
        };
    }

    private scrollToElement = (element: Element): void => {
        this.masterRule.uncollapseAllAncestors(element);
        Layout.layout(this.rule, this.viewPort, this.sizes);
        const position = element.graphicalMetadata.position;

        position.x += this.sizes.getElementWidth() / 2;
        position.y += this.sizes.getElementHeight() / 2;
        this.viewPort.shiftCenterTo(position);

        this.render();
    }

    private renderErrorFinder(invalidElements: Set<Element>): void {
        let offset = 0;
        invalidElements.forEach(element => {
            const message = element.errors[0].message;
            const text = this.svg.text(this.viewPort.getWidth() - Graphics.textWidth(message, 10) - 10, 35 + offset, message);
            text.node.onclick = () => {
                this.scrollToElement(element);
            };
            text.attr({
                cursor: 'pointer',
                fill: 'red',
                'font-size': 10,
                'font-style': 'italic'
            });
            text.node.onmouseenter = () => {
                text.attr({
                    'text-decoration': 'underline'
                });
            };
            text.node.onmouseleave = () => {
                text.attr({
                    'text-decoration': 'none'
                });
            };
            offset += 11;
        });
    }

    private startTimer(): void {
        this.timeStart = performance.now();
    }

    private renderTimeAndCount(): void {
        const count = this.getCountElements();
        if (!this.timeStart) {
            return;
        }
        const ms = Math.round(performance.now() - this.timeStart);
        const elements = this.t('elements');
        const text = count + ' ' + elements + ', ' + ms + ' ms';
        this.svg.text(this.viewPort.getWidth() - Graphics.textWidth(text, 12) - 30, this.viewPort.getHeight() - 10, text);
    }
}