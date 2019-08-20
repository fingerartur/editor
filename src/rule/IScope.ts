import { Declaration } from 'rule/declarations/Declaration';

export interface IScope {
    visibleDeclarations: Declaration[];
    forbiddenVariableNames: Set<string>;
}