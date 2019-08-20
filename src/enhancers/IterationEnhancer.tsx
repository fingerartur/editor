import * as React from 'react';
import { Enhancer } from './Enhancer';
import GuiIterationPopup from 'gui/elements/GuiIterationPopup';
import { Iteration } from 'rule/elements/Iteration';
import { ILayoutPosition } from 'diagram/layout/ILayoutPosition';
import { Graphics } from 'diagram/graphics/Graphics';
import { Square } from './Square';
import { Sizes } from 'diagram/Sizes';
import { IInteractivityInfo } from './wraps/IInteractivityInfo';
import { IDropperPosition } from './wraps/IDropperPosition';
import { IElementPopupInfo } from './wraps/IElementPopupInfo';

export class IterationEnhancer extends Enhancer {
    constructor(
        private iteration: Iteration
    ) {
        super(iteration);
    }

    renderGuiPopup(config: IElementPopupInfo): any {
        const { declarations, scope, loadables, onClose, onRemove } = config;
        return (
            <GuiIterationPopup
                declarations={declarations}
                iteration={this.iteration}
                scope={scope}
                loadables={loadables}
                onRemove={onRemove}
                onClose={onClose}
            />
        );
    }

    renderSvg(graphics: Graphics, sizes: Sizes, position: ILayoutPosition): IInteractivityInfo {
        if (this.iteration.graphicalMetadata.isCollapsed) {
            return super.renderSvg(graphics, sizes, position);
        } else {
            const svg = this.renderElement(graphics, sizes, this.iteration, position);
            this.renderArrows(graphics, sizes, position);
            return {
                element: {
                    element: this.iteration,
                    svg
                },
                droppers: this.getDropperPositions(position)
            };
        }
    }

    private getDropperPositions(position: ILayoutPosition): IDropperPosition[] {
        const cycle = position.subrules[0];
        const result: IDropperPosition[] = [];
        const helper = this.iteration.cycle.getFirst().next;
        result.push({position: { x: cycle.x, y: position.y }, element: helper});
        result.push({position: { x: cycle.x, y: position.subruleEndY }, element: this.iteration});
        return result;
    }

    private renderArrows(graphics: Graphics, sizes: Sizes, position: ILayoutPosition): void {
        const rule = position.subrules[0];
        const x = position.x;
        const top = new Square(sizes, { x, y: position.y });
        const bottomOfRule = new Square(sizes, { x, y: rule.yEnd - sizes.getSquareHeight() });
        const bottom = new Square(sizes, { x, y: position.subruleEndY });
        const fontSize = sizes.getFontSize();
        const connectorRadius = sizes.getConnectorRadius();

        // cycle
        if (rule.positions.length > 0) {
            // top
            graphics.renderDownArrow(
                { x: top.xMiddle(), y: top.yBottom() },
                { x: top.xMiddle(), y: top.yBottomOfSquare() },
                fontSize,
                { arrow: true }
            );
            // bottom
            graphics.renderDownArrow(
                { x: top.xMiddle(), y: bottomOfRule.yBottom() },
                { x: top.xMiddle(), y: bottom.yBottom() - connectorRadius },
                fontSize,
                { arrow: true }
            );
        } else {
            // empty
            graphics.renderDownArrow(
                { x: top.xMiddle(), y: top.yBottom() },
                { x: top.xMiddle(), y: bottom.yBottom() - connectorRadius },
                fontSize,
                { arrow: true }
            );
        }

        // loop back
        graphics.renderArrow([
            { x: top.xMiddle() + connectorRadius, y: bottom.yBottom() },
            { x: top.xMiddle() + rule.width, y: bottom.yBottom() },
            { x: top.xMiddle() + rule.width, y: top.yMiddle() },
            { x: top.xRight(), y: top.yMiddle() }
        ],
        fontSize,
        { text: 'loop', arrow: true, arrowDirection: 'left' });
        
        // connector
        graphics.renderCircle({ x: bottom.xMiddle(), y: bottom.yBottom() }, connectorRadius);

        // arrow from connector
        graphics.renderDownArrow(
            { x: bottom.xMiddle(), y: bottom.yBottom() + connectorRadius },
            { x: bottom.xMiddle(), y: bottom.yBottomOfSquare() },
            fontSize,
            { arrow: false }
        );
    }
}