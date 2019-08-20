import { IElementPopupInfo } from './wraps/IElementPopupInfo';
import { ILayoutPosition } from 'diagram/layout/ILayoutPosition';
import { Element } from 'rule/elements/Element';
import { IRectangle } from 'diagram/graphics/IRectangle';
import { Graphics } from 'diagram/graphics/Graphics';
import { Square } from './Square';
import { Sizes } from 'diagram/Sizes';
import { IShapeWrap } from './wraps/IShapeWrap';
import { IInteractivityInfo } from './wraps/IInteractivityInfo';
import { IDropperPosition } from './wraps/IDropperPosition';
import { IRenderInfo } from './wraps/IRenderInfo';
import { HIGHLIGHT_BLUE, HIGHLIGHT_RED, HIGHLIGHT_GREEN } from 'diagram/graphics/consts';

export abstract class Enhancer {
    constructor(
        private element: Element
    ) {}

    abstract renderGuiPopup(config: IElementPopupInfo): any;
    
    renderSvg(graphics: Graphics, sizes: Sizes, position: ILayoutPosition): IInteractivityInfo {
        const droppers: IDropperPosition[] = [];
        const svg = this.renderElement(graphics, sizes, this.element, position);
        if (position.hasDropper) {
            droppers.push({ element: this.element, position });
        }
        return {
            element: {
                element: this.element,
                svg
            },
            droppers
        };
    }

    getRect(position: ILayoutPosition, sizes: Sizes, boost?: IRectangle): IRectangle {
        if (!boost) {
            boost = { x: 0, y: 0, width: 0, height: 0 };
        }
        const widthBoost = sizes.compute(boost.width);
        const heightBoost = sizes.compute(boost.height);
        const rect: IRectangle = {
            x: position.x - widthBoost / 2,
            y: position.y - heightBoost / 2,
            width: sizes.getElementWidth() + widthBoost,
            height: sizes.getElementHeight() + heightBoost
        };
        return rect;
    }

    renderElement(graphics: Graphics, sizes: Sizes, element: Element, position: ILayoutPosition, shape?: IShapeWrap): IRenderInfo {
        const rect = this.getRect(position, sizes);        
        if (!shape) {
            shape = {
                renderShape: () => graphics.renderElementRectangle(rect),
                renderBoundingBox: () => graphics.renderRectangle(rect),
                renderHighlighter: (color: string) => graphics.renderRectangleHighlight(rect, color),
                newArrowHeadPosition: null,
            };
        }

        const boundingBox = shape.renderBoundingBox();
        boundingBox.attr({ visibility: 'hidden' });
    
        const { x, y } = position;
        let elementText = element.text;
        if (!elementText) {
            elementText = '';
        }
        const text = graphics.renderElementText(x, y, elementText);
        text.attr({ cursor: 'pointer' });
        const svgShape = graphics.group([
            shape.renderShape(),
            text
        ]);

        if (element.graphicalMetadata.isSelected || element.graphicalMetadata.hasSelectedParent) {
            shape.renderHighlighter(HIGHLIGHT_BLUE);
        }

        if (element.graphicalMetadata.shouldBlink) {
            const highlight = shape.renderHighlighter(HIGHLIGHT_GREEN);
            element.graphicalMetadata.shouldBlink = false;
            setTimeout(() => {
                highlight.remove();
            }, 1000);
        }

        if (element.isMarked()) {
            const highlight = shape.renderHighlighter(HIGHLIGHT_RED);
            if (element.errors.length === 0) {
                highlight.attr({ stroke: '#db3e3e' });
            }
        }

        if (shape.newArrowHeadPosition) {
            // this is just a hack, which corrects arrow position for larger-than normal svg elements
            // (e.g. the diamond shape of IF element covers the arrow, therefore here I render it again)
            graphics.renderTriangleDown(shape.newArrowHeadPosition);
        }
        
        if (position.hasArrow) {
            const square = new Square(sizes, {x, y});
            const start = {x: square.xMiddle(), y: square.yBottom() };
            const end = { x: square.xMiddle(), y: square.yBottomOfSquare() };
            const arrow = graphics.renderDownArrow(start, end, sizes.getFontSize());
        }
        return {
            boundingBox,
            shape: svgShape,
            position
        };
    }
}