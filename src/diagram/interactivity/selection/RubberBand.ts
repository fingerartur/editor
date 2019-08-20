import { IWrapElementAndSvg } from 'diagram/renderer/IWrapElementAndSvg';
import { StretchableRectangle } from './StretchableRectangle';
import { Graphics } from 'diagram/graphics/Graphics';
import { Events } from 'utils/Events';
import { End } from 'rule/elements/End';
import { Utils } from 'diagram/Utils';
import { IRectangle } from 'diagram/graphics/IRectangle';
import { Element } from 'rule/elements/Element';

declare type SelectHandler = (elements: Set<Element>) => void;

export class RubberBand {
    private rubber: StretchableRectangle;
    private elementWraps: IWrapElementAndSvg[];
    constructor(
        private svgNode: HTMLElement,
        private graphics: Graphics,
        public onSelect: SelectHandler
    ) {
        this.svgNode.addEventListener(Events.MOUSE_DOWN, this.createRubber);
        this.svgNode.addEventListener(Events.MOUSE_MOVE, this.stretchRubber);
        this.svgNode.addEventListener(Events.MOUSE_UP, this.selectAndDestoryRubber);
    }

    destroy(): void {
        this.svgNode.removeEventListener(Events.MOUSE_DOWN, this.createRubber);
        this.svgNode.removeEventListener(Events.MOUSE_MOVE, this.stretchRubber);
        this.svgNode.removeEventListener(Events.MOUSE_UP, this.selectAndDestoryRubber);
    }

    setVisibleElements(wraps: IWrapElementAndSvg[]): void {
        this.elementWraps = wraps.filter(wrap => !(wrap.element instanceof End));
    }

    finish(): void {
        this.selectAndDestoryRubber();
    }

    private createRubber = (event: MouseEvent) => {
        // is an arrow function in order to correctly bind 'this'
        const point = Utils.relativeCoordinates(this.svgNode, event);
        if (event.target === this.svgNode) {
            this.rubber = new StretchableRectangle(this.graphics, point.x, point.y);
        }
    }

    private stretchRubber = (event: MouseEvent) => {
        if (!this.rubber) {
            return;
        }

        const point = Utils.relativeCoordinates(this.svgNode, event);
        this.rubber.stretch(point.x, point.y);
    }

    private selectAndDestoryRubber = () => {
        if (!this.rubber) {
            return;
        }

        const elements = this.getElementsInsideRubber();
        this.onSelect(elements);

        this.rubber.destroy();
        this.rubber = null;
    }
    
    private getElementsInsideRubber(): Set<Element> {
        const result: Element[] = [];
        this.elementWraps.forEach(wrap => {
            const elementRect = wrap.svg.boundingBox;
            const rect: IRectangle = {
                x: +elementRect.attr('x'),
                y: +elementRect.attr('y'),
                width: +elementRect.attr('width'),
                height: +elementRect.attr('height')
            };
            if (Utils.rectangleContainsRectangle(this.rubber.getBoundingBox(), rect)) {
                result.push(wrap.element);
            }
        });
        return new Set(result);
    }
}