import { Element } from './Element';
import { SubRule } from '../SubRule';
import { Expression } from '../expression/Expression';
import { IIf } from './IIf';
import { Types } from '../types/Types';
import { IfEnhancer } from 'enhancers/IfEnhancer';
import { HardwiredTypes } from '../types/HardwiredTypes';
import { Cloner } from '../Cloner';

export class If extends Element {
    private condition: Expression;
    private branchTrue: SubRule;
    private branchFalse: SubRule;
    
    constructor(
        parentRule: SubRule,
        serialization?: IIf
    ) {
        super(parentRule);
        if (serialization) {
            this.deserialize(serialization);
        } else {
            this.initialize();
        }
    }

    setCondition(condition: Expression): void {
        const booleanType = { name: HardwiredTypes.BOOL };
        if (!Types.areEqual(condition.getType, booleanType) || !Types.areEqual(condition.getRoot().type, booleanType)) {
            throw Error('bug: condiiton must be of boolean type');
        }
        this.condition = condition;
    }

    getCondition(): Expression {
        return this.condition;
    }

    getBranchTrue(): SubRule {
        return this.branchTrue;
    }

    getBranchFalse(): SubRule {
        return this.branchFalse;
    }

    serialize(): IIf {
        const result = super.serialize() as IIf;
        result.condition = this.condition.serialize();
        result.branchTrue = this.branchTrue.serialize();
        result.branchFalse = this.branchFalse.serialize();
        return result;
    }

    getType(): string {
        return 'if';
    }

    getSubRules(): SubRule[] {
        return[ this.branchFalse, this.branchTrue ];
    }

    enhance(): IfEnhancer {
        return new IfEnhancer(this);
    }

    clone(): If {
        return new If(null, Cloner.clone(this) as any);
    }

    merge(ifElement: If): void {
        this.condition = ifElement.condition;
        this.text = ifElement.text;
    }

    getIdsOfVariablesOnTheLeft(): number[] {
        return [];
    }

    getIdsOfVariablesOnTheRight(): number[] {
        if (this.condition) {
            return this.condition.getIdsOfVariables();
        } else {
            return [];
        }
    }

    replaceIds(map: Map<number, number>): void {
        this.condition.replaceIds(map);
    }

    deserialize(serialization: IIf): void {
        super.deserialize(serialization);
        this.condition = new Expression(serialization.condition);
        this.branchTrue = new SubRule(this, serialization.branchTrue);
        this.branchFalse = new SubRule(this, serialization.branchFalse);
    }

    private initialize(): void {
        this.branchTrue = new SubRule(this);
        this.branchFalse = new SubRule(this);
        this.condition = new Expression({
            what: 'expression',
            root: {
                name: 'condition',
                type: { name: HardwiredTypes.BOOL, isMultiValued: false },
                value: null,
                error: null
            }
        });
        this.text = 'If';
    }
}