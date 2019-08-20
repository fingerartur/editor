import { ILayoutPosition } from '../layout/ILayoutPosition';
import { Graphics } from '../graphics/Graphics';
import { Sizes } from '../Sizes';
import { IInteractivityInfo } from './IInteractivityInfo';
import { IWrapElementAndSvg } from './IWrapElementAndSvg';
import { IDropperPosition } from 'enhancers/wraps/IDropperPosition';

export class Renderer {
    static render(positions: ILayoutPosition[], graphics: Graphics, sizes: Sizes): IInteractivityInfo {
        let nextId = 1;
        const elementInfos: IWrapElementAndSvg[] = [];
        let dropperInfos: IDropperPosition[] = [];
        positions.forEach(position => {
            const info = position.element.enhance().renderSvg(graphics, sizes, position);
            info.element.svg.shape.attr({ 'class': `e2e-element-${nextId++}` });
            elementInfos.push(info.element);
            dropperInfos = dropperInfos.concat(info.droppers);
        });
        return {
            elements: elementInfos,
            droppers: dropperInfos
        };
    }
}
