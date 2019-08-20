import { IScope } from './IScope';
import { SubRule } from './SubRule';
import { Element } from './elements/Element';
import { Declarations } from './declarations/Declarations';
import { AssigningElement } from './elements/AssigningElement';
import { IRule } from './IRule';
import { IRuleInfo } from './IRuleInfo';
import { Declaration } from './declarations/Declaration';
import { Traverser } from './traverser/Traverser';

export class Rule {
    public rule: SubRule;
    public declarations: Declarations;
    public id: number;
    public name: string;
    public description: string;

    private traverser = new Traverser();

    constructor(serialization?: IRule) {
        if (serialization) {
            Object.assign(this, serialization);
            this.rule = new SubRule(null, serialization.rule);
            this.declarations = new Declarations(serialization.declarations);
        } else {
            this.rule = new SubRule(null);
            this.declarations = new Declarations();
        }
        this.rule.getFirst().graphicalMetadata.isVisible = true;
        this.rule.getLast().graphicalMetadata.isVisible = true;
    }

    getRoot(): Element {
        return this.rule.getFirst();
    }
    
    getScopeOf(element: Element): IScope {
        const visibleDeclarations = this.getVisibleDeclarationsFor(element);
        const forbiddenVariableNames = new Set<string>(this.getNamesOfDeclarationsBelow(element));
        return {
            visibleDeclarations,
            forbiddenVariableNames
        };
    }

    /**
     * element's own declarations are not included
     */
    getVisibleDeclarationsFor(element: Element): Declaration[] {
        const localVarIds = this.getVisibleLocalVarIds(element);
        return this.declarations.getMany(localVarIds)
            .concat(this.declarations.getGlobalDeclarations());
    }

    /**
     * start is not included
     */
    getVisibleLocalVarIds(start: Element): number[] {
        let result = new Set<number>();
        this.traverser.traverseUp(start, (element) => {
            if (element instanceof AssigningElement) {
                const ids = element.getIdsOfVariablesOnTheLeft();
                ids.forEach(id => {
                    result.add(id);
                });
            }
            return true;
        },
        {
            includeEndType: false,
            includeStart: false,
            skipInvalid: true
        });
        return Array.from(result.values());
    }

    /**
     * start is not included
     */
    getIdsOfVariablesBelow(start: Element): number[] {
        const ids = new Set<number>();
        this.traverser.traverseDown(start, element => {
            element.getIdsOfVariables().forEach(id => {
                ids.add(id);
            });
            return true;
        },
        {
            includeEndType: false,
            includeStart: false,
            skipInvalid: true
        });
        return Array.from(ids.values());
    }

    /**
     * start is not included
     */
    getIdsOfDeclarationsBelow(start: Element): number[] {
        const ids = new Set<number>();
        this.traverser.traverseDown(start, element => {
            if (element instanceof AssigningElement && element.isDeclaration()) {
                element.getIdsOfVariablesOnTheLeft().forEach(id => ids.add(id));
            }
            return true;
        },
        {
            includeEndType: false,
            includeStart: false,
            skipInvalid: true
        });
        return Array.from(ids.values());
    }

    /**
     * start is not included
     */
    getNamesOfDeclarationsBelow(start: Element): string[] {
        const names = new Set<string>();
        this.getIdsOfDeclarationsBelow(start).forEach(id => {
            names.add(this.declarations.get(id).name);
        });
        return Array.from(names);
    }

    serialize(): IRule {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            declarations: this.declarations.serialize(),
            rule: this.rule.serialize()
        };
    }

    getInfo(): IRuleInfo {
        return {
            id: this.id,
            name: this.name,
            description: this.description
        };
    }

    uncollapseAllAncestors(element: Element): void {
        this.traverser.traverseParents(element, element2 => {
            element2.graphicalMetadata.isCollapsed = false;
            return true;
        }, {
            includeEndType: false,
            includeStart: false,
            skipInvalid: false
        });
    }
}