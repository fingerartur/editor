import { ILayoutPosition } from './ILayoutPosition';

export interface ILayoutSubrule {
    x: number;
    width: number;
    yStart: number;
    yEnd: number;
    positions: ILayoutPosition[];
}