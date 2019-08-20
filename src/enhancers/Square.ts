import { IPoint } from 'diagram/graphics/IPoint';
import { Sizes } from 'diagram/Sizes';

export class Square {
    constructor(
        private sizes: Sizes,
        private leftTop?: IPoint
    ) {
        if (!this.leftTop) {
            this.leftTop = { x: 0, y: 0};
        }
    }

    xMiddle(): number {
        return this.leftTop.x + this.sizes.getElementWidth() / 2;
    }
    
    xRight(): number {
        return this.leftTop.x + this.sizes.getElementWidth();
    }
    
    yBottom(): number {
        return this.leftTop.y + this.sizes.getElementHeight();
    }

    yMiddle(): number {
        return this.leftTop.y + this.sizes.getElementHeight() / 2;
    }

    yBottomOfSquare(): number {
        return this.leftTop.y + this.sizes.getSquareHeight();
    }
}