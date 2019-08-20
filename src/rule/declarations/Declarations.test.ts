import { declarations } from './../../client/mockData/declarations';
import { Declarations } from './Declarations';
import { IType } from '../types/IType';
import { Types } from '../types/Types';

describe('Declarations', () => {
    const typeInt: IType = {name: 'int'};
    const serialization = {
        nextId: 1000,
        declarations: [
            {
                id: 1,
                name: 'x',
                type: typeInt
            },
            {
                id: 2,
                name: 'y',
                type: typeInt
            }
        ]
    };

    let typeStringArray: IType;
    
    let declarations: Declarations;
    beforeEach(() => {
        typeStringArray = {name: 'string', isMultiValued: true};        
        declarations = new Declarations();
    });

    it('constructs', () => {
        //
    });

    it('deserializes', () => {
        declarations = new Declarations(serialization);
        const declarationArray = declarations.getAll();
        expect(declarationArray.length).toBe(2);
        expect(declarationArray[0].id).toBe(1);
        expect(declarationArray[1].id).toBe(2);
        const id = declarations.create('newVariable', typeInt);
        expect(id).toBe(1000);
    });

    it('can create a declaration based on name and type', () => {
        const result = declarations.create('countItems', typeStringArray);
        expect(result).toBe(1000);
    });

    it('can create a declaration of existing name', () => {
        const id1 = declarations.create('totalSold', typeStringArray);
        const declaration1 = declarations.get(id1);
        expect(declaration1.name).toBe('totalSold');
        expect(Types.areEqual(declaration1.type, typeStringArray)).toBeTruthy();

        const id2 = declarations.create('totalSold', typeInt);
        const declaration2 = declarations.get(id2);
        expect(declaration2.name).toBe('totalSold');
        expect(Types.areEqual(declaration2.type, typeInt)).toBeTruthy();
    });

    it('returns a unique ID of a newly create declaration', () => {
        const id1 = declarations.create('countCars', typeStringArray);
        const id2 = declarations.create('X', typeInt);
        expect(id1).not.toBe(id2);
    });

    it('returns null when trying to get a non-existing declaration', () => {
        expect(declarations.get(-1)).toBeNull();
    });

    it('can remove an existing declaration based on its ID', () => {
        const id = declarations.create('countCars', typeStringArray);
        expect(declarations.get(id)).not.toBeNull();
        declarations.remove(id);
        expect(declarations.get(id)).toBeNull();
    });

    it('throws when trying to remove non-existing declarations', () => {
        expect(() => {
            declarations.remove(1);
        }).toThrow();
    });

    it('can return an array of all declarations', () => {
        declarations.create('carNames', typeStringArray);
        declarations.create('countCars', typeInt);
        const result = declarations.getAll();
        expect(result.length).toBe(2);
        expect(result[0].name).toBe('carNames');
        expect(result[1].name).toBe('countCars');
    });

    it('can return declarations based on an array of IDs', () => {
        const id1 = declarations.create('carNames', typeStringArray);
        const id2 = declarations.create('countCar', typeInt);
        const id3 = declarations.create('countPeople', typeInt);
        const id4 = declarations.create('countMoney', typeInt);
        const result = declarations.getMany([ id2, id3 ]);
        expect(result.length).toBe(2);
        expect(result[0].name).toBe('countCar');
        expect(result[1].name).toBe('countPeople');
    });

    it('serializes', () => {
        declarations.create('carNames', typeStringArray);
        declarations.create('countCars', typeInt);
        const result = declarations.serialize();
        expect(result.nextId).toBe(1002);
        expect(result.declarations.length).toBe(2);
        expect(result.declarations[0].name).toBe('carNames');
        expect(result.declarations[1].name).toBe('countCars');
    });

    it('returns global declarations (those with ID < 1000)', () => {
        declarations = new Declarations(serialization);
        const globalIds = declarations.getGlobalDeclarations().map(declaration => declaration.id).sort();
        expect(globalIds).toEqual([ 1, 2 ]);
    });

    it('can duplicate a declaration', () => {
        declarations = new Declarations(serialization);
        const id = declarations.duplicate(1);
        expect(id).toEqual(1000);
        const declaration = declarations.get(id);
        expect(declaration.id).toBe(1000);
        expect(declaration.name).toBe('x');
        expect(Types.areEqual(declaration.type, { name: "int" })).toBeTruthy();
    });

    it('thors when trying to duplicate a non-existing declaration', () => {
        expect(() => {
            declarations.duplicate(3);
        }).toThrow();        
    });
});