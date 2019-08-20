import { IPoint } from 'diagram/graphics/IPoint';
import { Element } from 'rule/elements/Element';

export interface IDropperPosition {
    element: Element;
    position: IPoint;
}