import { Element } from 'rule/elements/Element';

export interface IDragInfo {
    isNew: boolean;
    thumbnail: Snap.Element;
    elements: Element[];
}