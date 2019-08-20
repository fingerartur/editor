import { IWrapElementAndSvg } from './IWrapElementAndSvg';
import { IDropperPosition } from 'enhancers/wraps/IDropperPosition';

export interface IInteractivityInfo {
    elements: IWrapElementAndSvg[];
    droppers: IDropperPosition[];   
}