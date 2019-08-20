import { IRectangle } from '../graphics/IRectangle';
import { Graphics } from '../graphics/Graphics';
import { Element } from 'rule/elements/Element';
import { IDragInfo } from './IDragInfo';
import { Utils } from '../Utils';
import { deserializer } from 'rule/elements/Deserializer';
import { Sizes } from '../Sizes';
import { IPoint } from '../graphics/IPoint';
import { IDropperPosition } from 'enhancers/wraps/IDropperPosition';
import { IWrapElementAndSvg } from '../renderer/IWrapElementAndSvg';
import { IInteractivityInfo } from '../renderer/IInteractivityInfo';
import { LINE_COLOR } from '../consts';

declare type DropHandler = (parent: Element, info: IDragInfo) => void;
declare type ElementHandler = (element: Element) => void;

/**
 * Draggers, Droppers, callbacks (on click, on collapse)
 */
export class Interactivity {
    public onClick: ElementHandler;
    public onCollapse: Function;
    public onDrop: DropHandler;

    private dragInfo: IDragInfo;
    private droppers: Snap.Element[] = [];
    private isShowingDroppers = false;

    constructor(
        private svgNode: HTMLElement,
        private graphics: Graphics,
        private sizes: Sizes,
    ) {
        this.svgNode.onmousemove = (event: MouseEvent) => {
            if (this.dragInfo) {
                this.moveThumbnail(event);
            }
        };
        this.svgNode.onmouseup = () => {
            if (this.dragInfo) { 
                this.dragInfo.thumbnail.remove();
                this.dragInfo = null;
                this.hideDroppers();
            }
        };
    }

    addInteractivity(info: IInteractivityInfo): void {
        const { droppers, elements } = info;
        this.addDroppers(droppers);
        this.addClickHandlers(elements);
        this.addTooltips(elements);
        this.addCollapsers(elements);
        this.renderDraggers();
        this.renderZoom();
    }

    addDroppers(infos: IDropperPosition[]): void {
        infos.forEach(info => this.addDropper(info));
    }

    addClickHandlers(wraps: IWrapElementAndSvg[]): void {
        wraps.forEach(wrap => {
            wrap.svg.shape.node.onclick = () => {
                this.onClick(wrap.element);
            };
        });
    }

    addTooltips(wraps: IWrapElementAndSvg[]): void {
        wraps.forEach(wrap => this.addTooltip(wrap));
    }

    addCollapsers(wraps: IWrapElementAndSvg[]): void {
        wraps.forEach(wrap => this.addCollapser(wrap));
    }

    showDroppers(): void {
        this.droppers.forEach(dropper => {
            dropper.attr({
                opacity: 0.2
            });
        });
        this.isShowingDroppers = true;
    }

    isDragging(): boolean {
        return this.isShowingDroppers;
    }

    hideDroppers(): void {
        this.droppers.forEach(dropper => {
            dropper.attr({
                opacity: 0
            });
        });
        this.isShowingDroppers = false;
    }

    initialize(): void {
        this.droppers = [];
    }

    renderDraggers(): void {
        const names = deserializer.getCreatableElementTypes();
        let x = 5;
        let y = 50;
        names.forEach(name => {
            this.renderDragger(x, y, name);
            y += 25;
        });
    }

    renderZoom(): void {
        const text = 'zoom' + ' ' + Math.ceil(this.sizes.getMultiplier() * 100) + '%';
        const xText = this.svgNode.clientWidth - Graphics.textWidth(text, 12) - 30;
        const y = 20;
        this.graphics.renderText(xText, y, text);
    }

    startDragging(elements: Element[], isNew: boolean): void {
        const rect = { x: 0, y: 0, width: 16, height: 7};
        const miniature = this.graphics.renderRectangle(rect, 1);
        miniature.attr({
            fill: '#daf993',
            stroke: '#000',
            opacity: 0.6,
            strokeWidth: 1
        });
        this.dragInfo = {
            thumbnail: miniature,
            elements,
            isNew
        };
        this.showDroppers();
    }

    private renderDragger(x: number, y: number, name: string): void {
        const dragger = this.graphics.renderLabel(x, y, name);
        dragger.attr({
            'data-type': 'creator',
            'data-name': name,
            cursor: 'grab'
        });
        dragger.node.onmousedown = (event: MouseEvent) => {
            const element = this.elementFromType(name);
            this.startDragging([ element ], true);
            this.moveThumbnail(event);
        };
    }

    private addDropper(info: IDropperPosition): void {
        const rect = this.getDropperRect(info.position, this.sizes);
        const dropper = this.graphics.renderRectangle(rect);
        dropper.attr({
            opacity: 0,
            fill: '#09d3ff' // blue
        });
        dropper.node.onmouseenter = () => {
            if (this.isShowingDroppers) {
                dropper.attr({
                    opacity: 1,
                    filter: this.graphics.BLUR_FILTER_DROPPER
                });
            }
        };
        dropper.node.onmouseout = () => {
            if (this.isShowingDroppers) {
                dropper.attr({
                    opacity: 0.2,
                    filter: null
                });
            }
        };
        dropper.node.onmouseup = () => {
            if (this.dragInfo) {
                this.onDrop(info.element, this.dragInfo);
            }
        };
        this.droppers.push(dropper);
    }

    private addCollapser(wrap: IWrapElementAndSvg): void {
        const element = wrap.element;
        if (element.getSubRules().length > 0) {
            const {x, y} = wrap.svg.position;
            const collapser = this.graphics.renderCollapser(x, y, element.graphicalMetadata.isCollapsed);
            collapser.node.onclick = () => {
                element.graphicalMetadata.isCollapsed = !element.graphicalMetadata.isCollapsed;
                this.onCollapse();
            };
        }
    }

    private addTooltip(wrap: IWrapElementAndSvg): void {
        const text = this.graphics.renderHoveringText(wrap.svg.position.x + 5, wrap.svg.position.y + 10, wrap.element.text, 20, LINE_COLOR);

        let errorMessage = null;
        const errors = wrap.element.errors;
        if (errors.length > 0) {
            errorMessage = errors[0].message;
        }
        
        let tooltip: Snap.Element;
        if (errorMessage) {
            const error = this.graphics.renderHoveringText(wrap.svg.position.x + 5, wrap.svg.position.y + 30, errorMessage, 10, '#e60000'); // red
            tooltip = this.graphics.group([
                text,
                error
            ]);
        } else {
            tooltip = text;
        }
        tooltip.attr({ visibility: 'hidden' });

        wrap.svg.shape.hover(() => {
            if (this.isDragging()) {
                return;
            }

            tooltip.attr({ visibility: 'visible' });
        }, () => {
            tooltip.attr({ visibility: 'hidden' });
        });
    }

    private getDropperRect(position: IPoint, sizes: Sizes): IRectangle {
        const { x, y } = position;
        const offset = sizes.compute(5);
        return {
            x: x + offset,
            y: y + sizes.getElementHeight() + offset,
            width: sizes.getElementWidth() - 2 * offset,
            height: sizes.getVerticalGap() - 2 * offset
        };
    }

    private elementFromType(type: string): Element {
        const converter = deserializer.getConstructor(type);
        return converter(null, null);
    }

    private moveThumbnail(event: MouseEvent): void {
        const point = Utils.relativeCoordinates(this.svgNode, event);
        const x = point.x - 7;
        const y = point.y - 15;
        this.dragInfo.thumbnail.transform('translate(' + x + ', ' + y + ')');
    }
}