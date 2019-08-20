import { IRectangle } from './graphics/IRectangle';
import { IPoint } from './graphics/IPoint';

export class Viewport {
    constructor(
        public xMin: number,
        public xMax: number,
        public yMin: number,
        public yMax: number
    ) {}

    isBelow(rectangle: IRectangle): boolean {
        return this.yMin > rectangle.y + rectangle.height;
    }

    isAbove(rectangle: IRectangle): boolean {
        return this.yMax < rectangle.y;
    }

    isRightOf(rectangle: IRectangle): boolean {
        return this.xMin > rectangle.x + rectangle.width;
    }

    isLeftOf(rectangle: IRectangle): boolean {
        return this.xMax < rectangle.x;
    }

    contains(rectangle: IRectangle): boolean {
        return !this.isBelow(rectangle)
            && !this.isRightOf(rectangle)
            && !this.isAbove(rectangle)
            && !this.isLeftOf(rectangle);
    }

    containsArrow(xAxis: number): boolean {
        return this.xMin <= xAxis && this.xMax >= xAxis;
    }
    
    shiftVertically(shift: number): void {
        this.yMin += shift;
        this.yMax += shift;
    }

    shiftHorizontally(shift: number): void {
        this.xMin += shift;
        this.xMax += shift;
    }

    shiftTo(x: number, y: number): void {
        const width = this.getWidth();
        this.xMin = x;
        this.xMax = x + width;
        const height = this.getHeight();
        this.yMin = y;
        this.yMax = y + height;
    }

    shiftCenterTo(point: IPoint): void {
        const cornerX = Math.ceil(point.x - this.getWidth() / 2);
        const cornerY = Math.ceil(point.y - this.getHeight() / 2);
        this.shiftTo(cornerX, cornerY);
    }

    getRelativePoint(absolutePoint: IPoint): IPoint {
        return { x: absolutePoint.x - this.xMin, y: absolutePoint.y - this.yMin };
    }
    
    getWidth(): number {
        return this.xMax - this.xMin;
    }

    getHeight(): number {
        return this.yMax - this.yMin;
    }
}