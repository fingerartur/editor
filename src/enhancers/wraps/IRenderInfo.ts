import { IPoint } from 'diagram/graphics/IPoint';

export interface IRenderInfo {
    boundingBox: Snap.Element;
    shape: Snap.Element;
    position: IPoint;
}