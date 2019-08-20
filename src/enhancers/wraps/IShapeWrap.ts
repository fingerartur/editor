import { IPoint } from 'diagram/graphics/IPoint';

export interface IShapeWrap {
    renderShape: () => Snap.Element;
    renderBoundingBox: () => Snap.Element;
    renderHighlighter: (color: string) => Snap.Element;
    newArrowHeadPosition?: IPoint;
}