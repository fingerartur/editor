import * as React from 'react';
import { Enhancer } from './Enhancer';
import GuiIfPopup from 'gui/elements/GuiIfPopup';
import { If } from 'rule/elements/If';
import { Graphics } from 'diagram/graphics/Graphics';
import { ILayoutPosition } from 'diagram/layout/ILayoutPosition';
import { Square } from './Square';
import { Sizes } from 'diagram/Sizes';
import { IShapeWrap } from './wraps/IShapeWrap';
import { IPoint } from 'diagram/graphics/IPoint';
import { IInteractivityInfo } from './wraps/IInteractivityInfo';
import { IDropperPosition } from './wraps/IDropperPosition';
import { IElementPopupInfo } from './wraps/IElementPopupInfo';

export class IfEnhancer extends Enhancer {

    constructor(
        private ifElement: If
    ) {
        super(ifElement);
    }

    renderGuiPopup(config: IElementPopupInfo): any {
        const { scope, loadables, onClose, onRemove } = config;
        return (
            <GuiIfPopup
                if={this.ifElement}
                scope={scope}
                loadables={loadables}
                onClose={onClose}
                onRemove={onRemove}
            />
        );
    }

    renderSvg(graphics: Graphics, sizes: Sizes, position: ILayoutPosition): IInteractivityInfo {
        if (this.ifElement.graphicalMetadata.isCollapsed) {
            return super.renderSvg(graphics, sizes, position);
        } else {
            const rect = this.getRect(position, sizes, {x: 0, y: 0, width: 22, height: 18});
            const arrowHeadPosition: IPoint = { x: rect.x + rect.width / 2, y: rect.y };
            const diamond: IShapeWrap = {
                renderShape: () => graphics.renderElementDiamond(rect),
                renderBoundingBox: () => graphics.renderRectangle(rect),
                renderHighlighter: (color: string) => graphics.renderDiamondHighlight(rect, color),
                newArrowHeadPosition: arrowHeadPosition
            };
            this.renderArrows(graphics, sizes, position);
            const svg = this.renderElement(graphics, sizes, this.ifElement, position, diamond);
            return {
                element: {
                    element: this.ifElement,
                    svg
                },
                droppers: this.getDropperPositions(position)
            };
        }
    }

    private getDropperPositions(position: ILayoutPosition): IDropperPosition[] {
        const ruleFalse = position.subrules[0];
        const ruleTrue = position.subrules[1];
        const result: IDropperPosition[] = [];
        result.push({position: {x: ruleFalse.x, y: position.y}, element: this.ifElement.getBranchFalse().getFirst()});
        result.push({position: {x: ruleTrue.x, y: position.y}, element: this.ifElement.getBranchTrue().getFirst()});
        result.push({position: {x: position.x, y: position.subruleEndY}, element: this.ifElement});
        return result;
    }

    private renderArrows(graphics: Graphics, sizes: Sizes, position: ILayoutPosition): void {
        const ruleFalse = position.subrules[0];
        const x = position.x;
        const allTop = new Square(sizes, { x, y: position.y });
        const falseBottom = new Square(sizes, { x, y: ruleFalse.yEnd - sizes.getSquareHeight() });
        const allBottom = new Square(sizes, { x, y: position.subruleEndY });
        const fontSize = sizes.getFontSize();
        const connectorRadius = sizes.getConnectorRadius();

        // false branch (left)
        if (ruleFalse.positions.length > 0) {
            // top
            graphics.renderDownArrow(
                { x: allTop.xMiddle(), y: allTop.yBottom() },
                { x: allTop.xMiddle(), y: allTop.yBottomOfSquare() },
                fontSize,
                { text: 'no', arrow: true }
            );
            // bottom
            graphics.renderDownArrow(
                { x: falseBottom.xMiddle(), y: falseBottom.yBottom() },
                { x: falseBottom.xMiddle(), y: allBottom.yBottom() - connectorRadius },
                fontSize,
                { arrow: true }
            );
        } else {
            // empty
            graphics.renderDownArrow(
                { x: allTop.xMiddle(), y: allTop.yBottom() },
                { x: allTop.xMiddle(), y: allBottom.yBottom() - connectorRadius },
                fontSize,
                { text: 'no', arrow: true }
            );
        }

        const ruleTrue = position.subrules[1];
        const trueBottom = new Square(sizes, { x: ruleTrue.x, y: ruleTrue.yEnd - sizes.getSquareHeight() });
        // true branch (right)
        if (ruleTrue.positions.length > 0) {
            // top
            graphics.renderArrow([
                { x: allTop.xRight(), y: allTop.yMiddle() },
                { x: trueBottom.xMiddle(), y: allTop.yMiddle() },
                { x: trueBottom.xMiddle(), y: allTop.yBottomOfSquare() },
            ],
            fontSize,
            { text: 'yes', arrow: true });
            // bottom
            graphics.renderArrow([
                { x: trueBottom.xMiddle(), y: trueBottom.yBottom() },
                { x: trueBottom.xMiddle(), y: allBottom.yBottom() },
                { x: allBottom.xMiddle() + connectorRadius, y: allBottom.yBottom() },
            ],
            fontSize,
            { arrow: true, arrowDirection: 'left' });
        } else {
            // empty
            graphics.renderArrow([
                { x: allTop.xRight(), y: allTop.yMiddle() },
                { x: trueBottom.xMiddle(), y: allTop.yMiddle() },
                { x: trueBottom.xMiddle(), y: allBottom.yBottom() },
                { x: allBottom.xMiddle() + connectorRadius, y: allBottom.yBottom() }
            ],
            fontSize,
            { text: 'yes', arrow: true, arrowDirection: 'left' });
        }

        // connector
        graphics.renderCircle({ x: allBottom.xMiddle(), y: allBottom.yBottom() }, connectorRadius);

        // arrow from connector
        graphics.renderDownArrow(
            { x: allBottom.xMiddle(), y: allBottom.yBottom() + connectorRadius },
            { x: allBottom.xMiddle(), y: allBottom.yBottomOfSquare() },
            fontSize,
            { arrow: false }
        );
    }
}