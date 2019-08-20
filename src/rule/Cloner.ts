import { ISerializable } from './ISerializable';

export class Cloner {
    
    static clone(data: ISerializable): ISerializable {
        return Cloner.cloneObject(data.serialize());
    }

    static cloneObject(data: any): any {
        return JSON.parse(JSON.stringify(data));
    }
}