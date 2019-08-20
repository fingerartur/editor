import { IDropperPosition } from './IDropperPosition';
import { IWrapElementAndSvg } from 'diagram/renderer/IWrapElementAndSvg';

export interface IInteractivityInfo {
    element: IWrapElementAndSvg;
    droppers: IDropperPosition[];
}