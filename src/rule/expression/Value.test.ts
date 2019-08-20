import { Literal } from './Literal';

describe('Value', () => {

    it('sets and gets type', () => {
        const value = new Literal({
            value: "12" 
        });
        value.setType(null);
        expect(value.getType()).toBeNull();
        value.setType({ name: "string" });
        expect(value.getType()).toEqual({ name: "string" });
    });
});