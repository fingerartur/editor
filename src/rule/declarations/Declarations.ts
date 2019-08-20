import { Declaration } from './Declaration';
import { IDeclarations } from './IDeclarations';
import { IType } from '../types/IType';
import { Types } from '../types/Types';

export const LOCAL_VARIABLES_FIRST_ID = 1000;
/**
 * IDs 0-999 are reserverd for global variables, 1000+ are local variables
 */
export class Declarations {
    private nextId = LOCAL_VARIABLES_FIRST_ID;
    private map = new Map<number, Declaration>();

    constructor(serialization?: IDeclarations) {
        if (!serialization) {
            return;
        }
        if (serialization.nextId < LOCAL_VARIABLES_FIRST_ID) {
            throw new Error('bug: nextId must be at least ' + LOCAL_VARIABLES_FIRST_ID);
        }
        
        this.deserialize(serialization);
    }

    /**
     * @return id of the newly created declaration
     */
    create(variableName: string, type: IType): number {
        const id = this.nextId;
        this.map.set(id, new Declaration({ id, name: variableName, type }));
        this.nextId++;
        return id;
    }

    /**
     * @return id of the newly created declaration
     */
    duplicate(id: number): number {
        const declaration = this.get(id);
        if (!declaration) {
            throw new Error('bug: trying to duplicate a non-existing declaration');
        }
        return this.create(declaration.name, Types.clone(declaration.type));
    }

    get(id: number): Declaration {
        let result = this.map.get(id);
        if (!result) {
            result = null;
        }
        return result;
    }

    getGlobalDeclarations(): Declaration[] {
        const result: Declaration[] = [];
        this.map.forEach((value, key) => {
            if (key < LOCAL_VARIABLES_FIRST_ID) {
                result.push(value);
            }
        });
        return result;
    }

    getMany(ids: number[]): Declaration[] {
        return ids.map(id => this.get(id));
    }

    getAll(): Declaration[] {
        return Array.from(this.map.values());
    }

    remove(id: number): void {
        if (!this.map.has(id)) {
            throw new Error('bug: trying to remove non-existing declaration');
        }
        this.map.delete(id);
    }

    serialize(): IDeclarations {
        return {
            nextId: this.nextId,
            declarations: this.getAll().map(declaration => declaration.serialize())
        };
    }

    private deserialize(serialization: IDeclarations): void {
        this.nextId = serialization.nextId;
        serialization.declarations.forEach(serializedDeclaration => {
            const declaration = new Declaration(serializedDeclaration);
            this.map.set(declaration.id, declaration);
        });        
    }
}