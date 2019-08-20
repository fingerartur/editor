import { Element } from '../elements/Element';
import { Rule } from '../Rule';
import { AssigningElement } from '../elements/AssigningElement';
import { Traverser } from '../traverser/Traverser';
import { Declaration } from '../declarations/Declaration';
import { ErrorCodes } from './ErrorCodes';
import { IterationHelper } from 'rule/elements/IterationHelper';

export class Validator {
    public invalids = new Set<Element>();
    private traverser = new Traverser();
    constructor(
        private rule: Rule,
        private t: Function // translation function
    ) {}
    
    /**
     * This method assumes arbitrary copying/pasting/deleting of elements, therefore the following errors may occur:
     *      1. an undeclared variable is assigned to
     *      2. an undeclared variable is used as a value (e.g. in an expression)
     *      3. redeclaration of a variable with the same name
     * 
     *      The following should never happen, but is checked anyway for added security:
     *      4. redeclaration of a variable with the same ID and name
     * 
     * This methods runs in Θ(n^2)
     * n ... #elements
     * 
     * @returns a set of invalid elements
     */
    validate(): Set<Element> {
        this.invalids.clear();

        const start = this.rule.getRoot();
        this.traverser.traverseDown(start, element => {
            this.clearErrors(element);

            const declarations = this.rule.getVisibleDeclarationsFor(element);
            const ids = new Set<number>(declarations.map(declaration => declaration.id));

            if (this.usesUndeclaredValue(element, ids)) {
                element.addError({
                    code: ErrorCodes.UNDECLARED_VARIABLE_USED_AS_VALUE,
                    message: this.t('validation_undeclared_var_value')
                });
            } else if (element instanceof AssigningElement) {
                if (this.redeclaresVariable(element, ids)) {
                    element.addError({
                        code: ErrorCodes.REDECLARATION_OF_ID,
                        message: this.t('validation_redeclared_id')
                    });
                } else if (this.redeclaresVisibleVariableName(element, declarations)) {
                    element.addError({
                        code: ErrorCodes.REDECLARATION_OF_NAME,
                        message: this.t('validation_redeclared_name')
                    });
                } else if (this.assignsToUndeclared(element, ids)) {
                    element.addError({
                        code: ErrorCodes.UNDECLARED_VARIABLE_ASSIGNED_TO,
                        message: this.t('validation_undeclared_var_assigned_to')
                    });
                }
            }
            
            let erroneousElement = null;
            if (!element.isValid()) {
                erroneousElement = element;
            }
            if (element instanceof IterationHelper && !element.master.isValid()) {
                erroneousElement = element.master;
            }
            if (erroneousElement) {
                this.markParentsOf(erroneousElement);
                this.invalids.add(erroneousElement);
            }
            
            return true;
        },
        {
            skipInvalid: false,
            includeEndType: false,
            includeStart: false
        });
        
        return this.invalids;
    }

    usesUndeclaredValue(element: Element, declarationIds: Set<number>): boolean {
        let result = false;
        element.getIdsOfVariablesOnTheRight().forEach(id => {
            if (!declarationIds.has(id)) {
                result = true;
            }
        });
        return result;
    }

    assignsToUndeclared(element: AssigningElement, declarationIds: Set<number>): boolean {
        let result = false;
        if (!element.isDeclaration()) {
            element.getIdsOfVariablesOnTheLeft().forEach(id => {
                if (!declarationIds.has(id)) {
                    result = true;
                }
            });
        }
        return result;
    }

    redeclaresVariable(element: AssigningElement, declarationIds: Set<number>): boolean {
        let result = false;
        if (element.isDeclaration()) {
            element.getIdsOfVariablesOnTheLeft().forEach(id => {
                if (declarationIds.has(id)) {
                    result = true;
                }
            });
        }
        return result;
    }

    redeclaresVisibleVariableName(element: AssigningElement, declarations: Declaration[]): boolean {
        let result = false;
        if (element.isDeclaration()) {
            element.getIdsOfVariablesOnTheLeft().forEach(id => {
                const name = this.rule.declarations.get(id).name;
                const found = declarations.find(declaration =>
                    name === declaration.name && id !== declaration.id
                );
                if (found) {
                    result = true;
                }
            });
        }
        return result;
    }

    clearErrors(element: Element): void {
        element.clearErrors();
        element.graphicalMetadata.hasInvalidDescendant = false;
    }

    markParentsOf(element: Element): void {
        this.traverser.traverseParents(element, elem => {
            elem.graphicalMetadata.hasInvalidDescendant = true;
            return true;
        },
        {
            includeEndType: false,
            includeStart: false,
            skipInvalid: true
        });
    }
}