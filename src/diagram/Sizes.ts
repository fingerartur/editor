const ELEMENT_WIDTH_PERCENTAGE = 0.8;
const ELEMENT_HEIGHT_PERCENAGE = 0.5;

export class Sizes {
    private fontSize = 8;
    private squareWidth = 70;
    private squareHeight = 60;
    private connectorRadius = 3;
    private multiplier = 1;
    private zoomer = 0.2;

    compute(size: number): number {
        return Math.max(1, Math.round(size * this.multiplier));
    }

    zoomIn(): void {
        if (this.multiplier > 5) {
            return;
        }

        this.multiplier += this.zoomer;
        if (this.multiplier > 0.9) {
            this.zoomer *= 2;
        }
    }

    zoomOut(): void {
        if (this.multiplier < 0.3) {
            return;
        }

        if (this.multiplier > 0.9) {
            this.zoomer /= 2;
        }
        this.multiplier -= this.zoomer;
    }

    getMultiplier(): number {
        return this.multiplier;
    }

    getFontSize(): number {
        return this.compute(this.fontSize);
    }

    getSquareWidth(): number {
        return this.compute(this.squareWidth);
    }

    getSquareHeight(): number {
        return this.compute(this.squareHeight);
    }

    getElementWidth(): number {
        return this.getSquareWidth() * ELEMENT_WIDTH_PERCENTAGE;
    }

    getElementHeight(): number {
        return this.getSquareHeight() * ELEMENT_HEIGHT_PERCENAGE;
    }

    getHorizontalGap(): number {
        return this.getSquareWidth() - this.getElementWidth();
    }

    getVerticalGap(): number {
        return this.getSquareHeight() - this.getElementHeight();
    }

    getConnectorRadius(): number {
        return this.compute(this.connectorRadius);
    }
}