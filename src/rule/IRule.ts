import { ISubRule } from './ISubRule';
import { IDeclarations } from './declarations/IDeclarations';

export interface IRule {
    id: number;
    name: string;
    description: string;
    rule: ISubRule;
    declarations: IDeclarations;
}