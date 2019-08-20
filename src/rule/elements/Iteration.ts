import { AssigningElement } from './AssigningElement';
import { IIteration } from './IIteration';
import { IVariable } from '../expression/IVariable';
import { SubRule } from '../SubRule';
import { IterationEnhancer } from 'enhancers/IterationEnhancer';
import { IVariableAccess } from '../expression/IVariableAccess';
import { Cloner } from '../Cloner';
import { IterationHelper } from './IterationHelper';

export class Iteration extends AssigningElement {
    public variable: IVariable;
    public value: IVariableAccess;
    public cycle: SubRule;

    constructor(
        parentRule: SubRule,
        serialization?: IIteration
    ) {
        super(parentRule);
        if (serialization) {
            this.deserialize(serialization);
        } else {
            this.initialize();
        }
    }

    merge(iteration: Iteration): void {
        this.variable = iteration.variable;
        this.value = iteration.value;
        this.text = iteration.text;
        this.check();
    }

    check(): void {
        if (
            this.variable.type.name !== this.value.type.name
            || this.variable.type.isMultiValued
            || !this.value.type.isMultiValued
        ) {
            throw new Error('bug: wrong data');
        }
    }

    getIdsOfVariablesOnTheLeft(): number[] {
        return [];
        // the iteration variable is not visible here
        // instead it is only visible inside the sub-rule (see IterationHelper)
    }

    getIdsOfVariablesOnTheRight(): number[] {
        if (this.value) {
            return [ this.value.id ];
        } else {
            return [];
        }
    }

    serialize(): IIteration {
        const result = super.serialize() as IIteration;
        result.variable = this.variable;
        result.value = this.value;
        result.cycle = this.cycle.serialize();
        return result;
    }

    getType(): string {
        return 'iteration';
    }

    getSubRules(): SubRule[] {
        return [ this.cycle ];
    }

    enhance(): IterationEnhancer {
        return new IterationEnhancer(this);
    }

    clone(): Iteration {
        return new Iteration(null, Cloner.clone(this) as any);
    }

    isDeclaration(): boolean {
        return false;
    }

    replaceIds(map: Map<number, number>): void {
        if (this.variable) {
            const newId = map.get(this.variable.id);
            if (newId) {
                this.variable.id = newId;
            }
        }
        if (this.value) {
            const newId = map.get(this.value.id);
            if (newId) {
                this.value.id = newId;
            }
        }
    }

    deserialize(serialization: IIteration): void {
        super.deserialize(serialization);
        this.variable = serialization.variable;
        this.value = serialization.value;
        this.cycle = new SubRule(this, serialization.cycle);
        
        let helper = this.cycle.getFirst().next;
        if (helper instanceof IterationHelper) {
            helper.master = this;    
        } else {
            this.createHelper();
        }
    }

    private initialize(): void {
        this.value = null;
        this.cycle = new SubRule(this);
        this.createHelper();        
        this.text = 'Iteration';
    }

    private createHelper(): IterationHelper {
        const helper = new IterationHelper(this.cycle);
        helper.master = this;
        this.cycle.getFirst().insertAfter(helper);
        return helper;
    }
}