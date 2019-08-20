import { IElement } from './elements/IElement';

export interface ISubRule {
    what: 'sub-rule';
    elements: IElement[];
}