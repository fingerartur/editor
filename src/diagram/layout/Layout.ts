import { SubRule } from 'rule/SubRule';
import { Viewport } from '../Viewport';
import { ILayoutPosition } from './ILayoutPosition';
import { ILayoutResult } from './ILayoutResult';
import { ILayoutSubrule } from './ILayoutSubrule';
import { Sizes } from '../Sizes';
import { End } from 'rule/elements/End';

export class Layout {

    static layout(rule: SubRule, viewport: Viewport, sizes: Sizes): ILayoutPosition[] {
        const result =  this.layoutRule(rule, viewport, sizes, 3, 1);
        return this.toPositions(result);
    }

    /**
     * Chessboard layout.
     * Side effect: computes element.graphicalMetadata.position for all elements.
     * @returns layout for elements inside the viewport.
     */
    private static layoutRule(rule: SubRule, viewport: Viewport, sizes: Sizes, startIndexX: number, startIndexY: number): ILayoutResult {
        let nextIndexX = startIndexX;
        let nextIndexY = startIndexY;
        let maxWidthYet = 1;
        let positions: ILayoutPosition[] = [];

        rule.walk(element => {
            const rectAbsolute = {
                x: nextIndexX * sizes.getSquareWidth(),
                y: nextIndexY * sizes.getSquareHeight(),
                width: sizes.getElementWidth(),
                height: sizes.getElementHeight()
            };

            // side effect:
            element.graphicalMetadata.position = { x: rectAbsolute.x, y: rectAbsolute.y };

            const isInsideViewport = viewport.contains(rectAbsolute);
            const relativePoint = viewport.getRelativePoint({ x: rectAbsolute.x, y: rectAbsolute.y });
            const position: ILayoutPosition = {
                x: relativePoint.x,
                y: relativePoint.y,
                element,
                hasArrow: true,
                hasDropper: true,
                isInsideViewport,
                hasConnectorInsideViewport: false,
                hasArrowCrossingViewport: false
            };
            const subrules = element.getSubRules();

            if (!element.graphicalMetadata.isVisible) {
                return true;
            }

            if (element instanceof End && isInsideViewport) {
                if (element.next === null) {
                    position.hasDropper = false;
                    position.hasArrow = false;
                }
                positions.push(position);
                nextIndexY ++;
            } else if (element.graphicalMetadata.isCollapsed || subrules.length === 0) {
                if (isInsideViewport) {
                    if (element.next instanceof End && !element.next.graphicalMetadata.isVisible) {
                        position.hasArrow = false;
                    }
                    positions.push(position);
                }
                nextIndexY ++;
            } else {
                positions.push(position);
                position.subrules = [];
                nextIndexY ++;
                let maxSubRuleHeight = 0;
                const subruleStartY = position.y + sizes.getSquareHeight();
                let cumulativeWidthOfPreviousSubrules = 0;
                let arrowAxes: number[] = [];

                subrules.forEach((subrule) => {
                    const result = this.layoutRule(subrule, viewport, sizes, startIndexX + cumulativeWidthOfPreviousSubrules, nextIndexY);                
                    const subruleLayout: ILayoutSubrule = {
                        x: position.x + cumulativeWidthOfPreviousSubrules * sizes.getSquareWidth(),
                        width: result.widthPoints * sizes.getSquareWidth(),
                        yStart: subruleStartY,
                        yEnd: subruleStartY + result.heightPoints * sizes.getSquareHeight(),
                        positions: result.positions
                    };
                    position.subrules.push(subruleLayout);
                    cumulativeWidthOfPreviousSubrules += result.widthPoints;
                    maxSubRuleHeight = Math.max(maxSubRuleHeight, result.heightPoints);

                    arrowAxes.push(subruleLayout.x + viewport.xMin + sizes.getSquareWidth() / 2);
                });

                if (position.subrules.length === 1) {
                    cumulativeWidthOfPreviousSubrules += 1;
                }
                maxWidthYet = Math.max(maxWidthYet, cumulativeWidthOfPreviousSubrules);
                position.subruleEndY = subruleStartY + maxSubRuleHeight * sizes.getSquareHeight();
                position.hasDropper = false;
                position.hasArrow = false;
                nextIndexY += maxSubRuleHeight;
                nextIndexY ++; // space for connector of arrows

                const connectorPositionAbsolute = {
                    x: position.x + viewport.xMin + sizes.getSquareWidth() / 2,
                    y: position.subruleEndY + viewport.yMin + sizes.getSquareHeight() / 2,
                    width: 1,
                    height: 1
                };
                position.hasConnectorInsideViewport = viewport.contains(connectorPositionAbsolute);

                if (viewport.isBelow(rectAbsolute) && viewport.isAbove(connectorPositionAbsolute)) {
                    arrowAxes.forEach(axis => {
                        if (viewport.containsArrow(axis)) {
                            position.hasArrowCrossingViewport = true;
                        }
                    });
                }
            }
            return true;
        });

        return {
            widthPoints: maxWidthYet,
            heightPoints: nextIndexY - startIndexY,
            positions
        };
    }

    private static toPositions(result: ILayoutResult): ILayoutPosition[] {
        return this.flattenPositions(result.positions)
            .filter(position => position.isInsideViewport || position.hasConnectorInsideViewport || position.hasArrowCrossingViewport);
    }

    private static flattenPositions(positions: ILayoutPosition[]): ILayoutPosition[] {
        let result: ILayoutPosition[] = [];
        positions.forEach(position => {
            result.push(position);
            if (position.subrules) {
                position.subrules.forEach(subrule => {
                    result = result.concat(this.flattenPositions(subrule.positions));
                });
            }
        });
        return result;
    }
}