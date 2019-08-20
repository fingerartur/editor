import { IRectangle } from 'diagram/graphics/IRectangle';
import { Graphics } from 'diagram/graphics/Graphics';

export class StretchableRectangle {
    private band: Snap.Element;
    private originX: number;
    private originY: number;

    constructor(graphics: Graphics, x: number, y: number) {
        const rect = {x, y, width: 1, height: 1};
        this.band = graphics.renderRectangle(rect);
        this.band.attr({
            fill: 'blue',
            'fill-opacity': 0.2,
            'stroke-width': 1,
            stroke: 'blue'
        });

        this.originX = x;
        this.originY = y;
    }

    stretch(newX: number, newY: number): void {
        const x = Math.min(this.originX, newX);
        const y = Math.min(this.originY, newY);
        const width = Math.abs(newX - this.originX);
        const height = Math.abs(newY - this.originY);
        this.band.attr({ width, height, x, y });
    }

    getBoundingBox(): IRectangle {
        return this.band.getBBox();
    }

    destroy(): void {
        this.band.remove();
    }
}
