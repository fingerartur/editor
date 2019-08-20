import { Element } from 'rule/elements/Element';
import { IRenderInfo } from 'enhancers/wraps/IRenderInfo';

export interface IWrapElementAndSvg {
    element: Element;
    svg: IRenderInfo;
}