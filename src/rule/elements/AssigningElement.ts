import { Element } from './Element';
import { ErrorCodes } from '../validator/ErrorCodes';

/**
 * Anything that assigns values to variables (e.g. Assignment, Iteration, ...)
 */
export abstract class AssigningElement extends Element {
    
    getVariable(): number {
        return this.getIdsOfVariablesOnTheLeft()[0];
    }

    /**
     * All its variables of the left are declarations
     */
    abstract isDeclaration(): boolean;

    hasErrorRedeclaration(): boolean {
        return this.errors.find(error => error.code === ErrorCodes.REDECLARATION_OF_NAME) !== undefined;
    }
}