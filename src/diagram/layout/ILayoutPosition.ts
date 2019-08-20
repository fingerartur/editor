import { Element } from 'rule/elements/Element';
import { ILayoutSubrule } from './ILayoutSubrule';

export interface ILayoutPosition {
    x: number;
    y: number;
    element: Element;
    hasArrow: boolean;
    hasDropper: boolean;
    subrules?: ILayoutSubrule[];
    subruleEndY?: number;
    isInsideViewport: boolean;
    hasConnectorInsideViewport: boolean;
    hasArrowCrossingViewport: boolean;
}