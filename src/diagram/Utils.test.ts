import { IRectangle } from './graphics/IRectangle';
import { Utils } from './Utils';

describe('utils', () => {
    let rectangle: IRectangle;
    beforeEach(() => {
        rectangle = {
            x: 10,
            y: 10,
            width: 20,
            height: 10
        }
    });

    it('tells if point is inside rectangle', () => {
        expect(Utils.rectangleContainsPoint(rectangle, { x: 10, y: 10 })).toBeTruthy();
        expect(Utils.rectangleContainsPoint(rectangle, { x: 20, y: 15 })).toBeTruthy();
        expect(Utils.rectangleContainsPoint(rectangle, { x: 0, y: 0 })).toBeFalsy();
    });

    it('tells if rectangle is inside rectangle', () => {
        expect(Utils.rectangleContainsRectangle(rectangle, { x: 11, y: 11, width: 1, height: 1 })).toBeTruthy();
        expect(Utils.rectangleContainsRectangle(rectangle, { x: 11, y: 11, width: 100, height: 1 })).toBeFalsy();
        expect(Utils.rectangleContainsRectangle(rectangle, { x: 0, y: 0, width: 1, height: 1 })).toBeFalsy();
    });
    
});