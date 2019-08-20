import * as Snap from 'snapsvg-cjs';
import { LINE_COLOR } from '../consts';
import { IRectangle } from './IRectangle';
import { IPoint } from './IPoint';
import { IArrowOptions } from '../renderer/IArrowOptions';
import { Sizes } from '../Sizes';
const textWidth = require('text-width');

export class Graphics {
    public BLUR_FILTER: any;
    public BLUR_FILTER_DROPPER: any;

    static wrapText(text: string, lineLength: number): string[] {
        text = text.trim();
        const split = text.split(' ');
        let letters = 0;
        let maxChars = 0;
        for (let i = 0; i < split.length; i++) {
          letters += split[i].length;
          if (letters > lineLength) {
            maxChars = Math.max(maxChars, letters - split[i].length);
            split[i - 1] += '\n';
            letters = split[i].length;
          }
        }
        if (maxChars === 0) {
          maxChars = text.length;
        }
        return split.join(' ').replace('\n ', '\n').split('\n');
    }

    static textWidth(text: string, fontSize: number): number {
        return textWidth(text, {
            family: 'Arial',
            size: fontSize
        });
    }

    constructor(
        private svg: Snap.Paper,
        private sizes: Sizes
    ) {
        this.initialize();
    }

    initialize(): void {
        this.BLUR_FILTER = this.svg.filter(Snap.filter.blur(2, 2));
        this.BLUR_FILTER_DROPPER = this.svg.filter(Snap.filter.blur(5, 1));
    }

    renderText(x: number, y: number, text: string): Snap.Element {
        const result = this.svg.text(x, y, text);
        return result;
    }

    renderButton(x: number, y: number, text: string, attrs: any): Snap.Element {
        const rect = { x, y, width: 18, height: 18 };
        const rectangle = this.renderRectangle(rect, 2);
        rectangle.attr({
            fill: '#daf993', // light green
            stroke: '#000',
            strokeWidth: 1,
            ...attrs
        });
        const textSvg = this.renderText(x + 6, y + 13, text);
        const g = this.group([
            rectangle,
            textSvg
        ]);
        g.attr({
            style: 'user-select: none;',
            cursor: 'pointer'
        });
        g.node.onmousedown = () => {
            rectangle.attr({
                fill: '#daddcc'     
            });
        };
        g.node.onmouseup = () => {
            rectangle.attr({
                fill: attrs.fill ? attrs.fill : '#daf993', 
            }); 
        };
        return g;
    }

    renderLabel(x: number, y: number, text: string): Snap.Element {
        const rect = { x, y, width: text.length * 7 + 10, height: 20};
        const rectangle = this.renderRectangle(rect, 2);
        rectangle.attr({
            fill: '#daf993', // light green
            stroke: '#000',
            strokeWidth: 1,            
        });
        const textSvg = this.renderText(x + 6, y + 15, text);
        const g = this.group([
            rectangle,
            textSvg
        ]);
        g.attr({
            style: 'user-select: none;', // prevent unwanted selection of text
        });
        return g;
    }

    renderElementText(x: number, y: number, text: string): Snap.Element {
        const fontSize = this.sizes.getFontSize();
        const letterCount = Math.round(this.sizes.getElementWidth() / fontSize * 1.5);
        const lines = Graphics.wrapText(text, letterCount);
        let svgs = [];
        const xOffset = this.sizes.compute(6);
        const yOffset = this.sizes.compute(10);
        for (let i = 0; i < Math.min(4, lines.length); i++) {
            const result = this.renderText(x + xOffset, y + yOffset + i * (fontSize), lines[i]);
            result.attr({
                style: 'font-size: ' + fontSize + '; font-family: Arial;'
            });
            svgs.push(result);
        }
        return this.group(svgs);
    }
    
    renderHoveringText(x: number, y: number, text: string, fontSize: number, fontColor: string): Snap.Element {
        const result = this.svg.g();
        const widthOfText = textWidth(text, {
            family: 'Arial',
            size: fontSize
        });
        const rect = {
            x: x + this.sizes.compute(100),
            y: y,
            width: widthOfText + 10,
            height: 22
        };
        const hoveringTitleRect = this.renderRectangle(rect, 2);
        hoveringTitleRect.attr({
            fill: '#e6e6ff',
            strokeWidth: 0,
            stroke: '#ccccff'
        });
        const hoveringTitleText = this.renderText(x + this.sizes.compute(100) + 5, y + 16, text);
        hoveringTitleText.attr({
            fontSize,
            fill: fontColor
        });
        result.add(hoveringTitleRect);
        result.add(hoveringTitleText);
        return result;
    }

    renderElementDiamond(rect: IRectangle): Snap.Element {
        const rectShadow = { ...rect};
        rectShadow.x -= this.sizes.compute(2);
        rectShadow.y += this.sizes.compute(3);
        const shadow = this.renderDiamond(rectShadow);
        shadow.attr({
            fill: 'grey',
            strokeWidth: 0,
            filter: this.BLUR_FILTER
        });
        const result = this.renderDiamond(rect);
        result.attr({
            cursor: 'pointer',
            fill: '#fff2cc', // beige
            stroke: LINE_COLOR,
            strokeWidth: this.sizes.compute(1)
        });
        return result;
    }

    getShadowAttributes(): any {
        return {
            fill: 'grey',
            strokeWidth: 0,
            filter: this.BLUR_FILTER
        };
    }

    renderElementRectangle(rect: IRectangle): Snap.Element {
        const radius = this.sizes.compute(5);
        const rectShadow = { ...rect};
        rectShadow.x -= this.sizes.compute(2);
        rectShadow.y += this.sizes.compute(3);
        const shadow = this.renderRectangle(rectShadow, radius);
        shadow.attr({
            fill: 'grey',
            strokeWidth: 0,
            filter: this.BLUR_FILTER
        });
        const result = this.renderRectangle(rect, radius);
        result.attr({
            cursor: 'pointer',
            fill: '#fff2cc', // beige
            stroke: LINE_COLOR,
            strokeWidth: this.sizes.compute(1)
        });
        return result;
    }

    renderRectangle(rect: IRectangle, borderRadius?: number): Snap.Element {
        if (rect.width < 0 || rect.height < 0 || borderRadius < 0) {
            throw new Error('bad rect value');
        }

        if (!borderRadius) {
            borderRadius = 0;
        }
        const result = this.svg.rect(rect.x, rect.y, rect.width, rect.height, borderRadius, borderRadius);
        return result;
    }

    renderDiamond(rect: IRectangle): Snap.Element {
        const halfWidth = rect.width / 2;
        const halfHeight = rect.height / 2;
        const result = this.svg.polygon([
            rect.x, rect.y + halfHeight,
            rect.x + halfWidth, rect.y,
            rect.x + rect.width, rect.y + halfHeight,
            rect.x + halfWidth, rect.y + rect.height,
            rect.x, rect.y + halfHeight
        ]);
        return result;
    }

    renderDiamondHighlight(rect: IRectangle, color: string): Snap.Element {
        rect = this.getHighlightRect(rect);
        const selection = this.renderDiamond(rect);
        this.addHighlightAttrs(selection, color);
        return selection;
    }

    renderRectangleHighlight(rect: IRectangle, color: string): Snap.Element {
        rect = this.getHighlightRect(rect);
        const selection = this.renderRectangle(rect, this.sizes.compute(8));
        this.addHighlightAttrs(selection, color);
        return selection;
    }

    getHighlightThickness(): number {
        return Math.max(4, this.sizes.compute(4));
    }

    addHighlightAttrs(element: Snap.Element, color: string): any {
        element.attr({
            strokeWidth: this.getHighlightThickness(),
            opacity: 0.4,
            fill: 'none',
            stroke: color
        });
    }

    getHighlightRect(rect: IRectangle): IRectangle {
        const result = { ...rect };
        const correction = this.sizes.compute(1);
        const thickness = this.getHighlightThickness();
        const offset = thickness - correction;
        const boost = 2 * offset;
    
        result.x -= offset;
        result.y -= offset;
        result.width += boost;
        result.height += boost;
        return result;
    }

    renderCollapser(x: number, y: number, isCollapsed: boolean): Snap.Element {
        const xOffset = this.sizes.compute(1);
        const yOffset = this.sizes.compute(2);
        const collapser = this.svg.circle(x - xOffset, y + yOffset, this.sizes.compute(6));
        collapser.attr({
            stroke: LINE_COLOR,
            strokeWidth: this.sizes.compute(1)
        });
        let hat;
        if (isCollapsed) {
            const width = this.sizes.compute(6);
            const height = this.sizes.compute(4);
            hat = this.renderHatDown(x - xOffset, y + yOffset * 2, width, height);
            collapser.attr({ fill: '#d1fccf' }); // green
        } else {
            const thirdOfWidth = this.sizes.compute(2);
            hat = this.svg.polyline([x - thirdOfWidth * 2, y + yOffset, x + thirdOfWidth, y + yOffset]);
            collapser.attr({ fill: '#ffcccc' }); // red
        }
        hat.attr({
            strokeWidth: this.sizes.compute(1),
            stroke: LINE_COLOR
        });
        const group = this.group([
            collapser,
            hat
        ]);
        group.attr({ cursor: 'pointer' });
        return group;
    }

    renderHatDown(x: number, y: number, width: number, height: number): Snap.Element {
        const dx = width / 2;
        return this.svg.polyline([ x, y, x + dx, y - height, x, y, x - dx, y - height ]);
    }

    renderCircle(center: IPoint, radius: number): Snap.Element {
        const circle = this.svg.circle(center.x, center.y, radius);
        circle.attr({
            stroke: 'black',
            fill: 'white'
        });
        return circle;
    }

    group(elements: Snap.Element[]): Snap.Element {
        const result = this.svg.g();
        elements.forEach(element => {
            result.add(element);
        });
        return result;
    }

    renderDownArrow(start: IPoint, end: IPoint, fontSize: number, options?: IArrowOptions): Snap.Element {
        return this.renderArrow([ start, end ], fontSize, options);
    }

    renderArrow(points: IPoint[], fontSize: number, options?: IArrowOptions): Snap.Element {
        const start = points[0];
        const end = points[points.length - 1];
        const line: number[] = [];
        points.forEach(point => {
            line.push(point.x);
            line.push(point.y);
        });

        let color = LINE_COLOR;
        if (options && options.color) {
            color = options.color;
        }
        const arrowLine = this.svg.polyline(line);
        arrowLine.attr({
            fill: 'none', // needed
            stroke: color,
            strokeWidth: 1
        });
        const g = this.svg.g();
        g.add(arrowLine);

        if (!options || options.arrow) {
            let arrow;
            if (!options || !options.arrowDirection || options.arrowDirection === 'down') {
                arrow = this.renderTriangleDown(end);
            } else if (options.arrowDirection === 'left') {
                arrow = this.renderTriangleLeft(end);
            } else {
                throw new Error('arrow direction unimplemented');
            }
            g.add(arrow);    
        }

        const offset = this.sizes.compute(10);
        if (options && options.text) {
            const text = this.renderText(start.x + offset, start.y + offset, options.text);
            text.attr({
                color: LINE_COLOR,
                style: 'font-size: ' + fontSize
            });
            g.add(text);
        }
        return g;
    }

    renderTriangleDown(tip: IPoint): Snap.Element {
        const halfWidth = this.sizes.compute(4);
        const height = this.sizes.compute(7);
        return this.svg.polyline([ tip.x, tip.y, tip.x + halfWidth, tip.y - height, tip.x - halfWidth, tip.y - height, tip.x, tip.y ]);
    }

    renderTriangleLeft(tip: IPoint): Snap.Element {
        const halfHeight = this.sizes.compute(4);
        const width = this.sizes.compute(7);
        return this.svg.polyline([ tip.x, tip.y, tip.x + width, tip.y + halfHeight, tip.x + width, tip.y - halfHeight, tip.x, tip.y ]);
    }
}