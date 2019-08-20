import { AssignEnhancer } from 'enhancers/AssignEnhancer';
import { SubRule } from '../SubRule';
import { Cloner } from '../Cloner';
import { AssigningElement } from './AssigningElement';
import { IVariable } from '../expression/IVariable';
import { Expression } from '../expression/Expression';
import { IAssign } from './IAssign';

export class Assign extends AssigningElement {
    public variable: IVariable;
    public expression: Expression;
    
    constructor(
        parentRule: SubRule,
        serialization?: IAssign
    ) {
        super(parentRule);
        if (serialization) {
            this.deserialize(serialization);
        } else {
            this.initialize();
        }
    }

    getType(): string {
        return 'assign';
    }

    serialize(): IAssign {
        const result = super.serialize() as IAssign;
        result.variable = this.variable;
        result.expression = this.expression.serialize();
        return result;
    }

    enhance(): AssignEnhancer {
        return new AssignEnhancer(this);
    }

    clone(): Assign {
        return new Assign(null, Cloner.clone(this) as any);
    }

    getIdsOfVariablesOnTheLeft(): number[] {
        let result = [];
        if (this.variable && this.variable.id != null) {
            result.push(this.variable.id);
        }
        return result;
    }

    getIdsOfVariablesOnTheRight(): number[] {
        if (this.expression) {
            return this.expression.getIdsOfVariables();
        } else {
            return [];
        }
    }

    merge(assign: Assign): void {
        this.text = assign.text;
        this.variable = assign.variable;
        this.expression = assign.expression;
    }

    isDeclaration(): boolean {
        return this.variable && this.variable.isDeclaration;
    }

    replaceIds(map: Map<number, number>): void {
        if (this.variable) {
            const newId = map.get(this.variable.id);
            if (newId) {
                this.variable.id = newId;
            }
        }
        if (this.expression) {
            this.expression.replaceIds(map);
        }
    }

    deserialize(serialization: IAssign): void {
        super.deserialize(serialization);
        this.variable = serialization.variable;
        this.expression = new Expression(serialization.expression);
    }

    private initialize(): void {
        this.variable = null;
        this.expression = new Expression();
        this.text = 'Assign';
    }
}