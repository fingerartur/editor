import { Declarations } from 'rule/declarations/Declarations';
import { IType } from 'rule/types/IType';
import { globalDeclarations } from './globalDeclarations';

const typeString: IType = { name: 'string' };
const typeInt: IType = { name: 'int' };
const typeFloat: IType = { name: 'float' };

export const declarations = new Declarations({ nextId: 1000, declarations: globalDeclarations});
declarations.create('A', typeString);
declarations.create('B', typeString);
declarations.create('C', typeString);
declarations.create('D', typeString);
declarations.create('x1', typeInt);
declarations.create('x2', typeInt);
declarations.create('x3', typeInt);
declarations.create('x4', typeInt);
declarations.create('zoom', typeFloat);

export const newDeclarations = new Declarations({ nextId: 1000, declarations: globalDeclarations});