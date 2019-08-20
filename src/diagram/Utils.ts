import { IPoint } from './graphics/IPoint';
import { IRectangle } from './graphics/IRectangle';

export class Utils {

    static relativeCoordinates(element: HTMLElement, event: MouseEvent): IPoint {
        const bbox = element.getBoundingClientRect();
        return {
            x: event.clientX - bbox.left,
            y: event.clientY - bbox.top
        };
    }

    static rectangleContainsPoint(container: IRectangle, point: IPoint): boolean {
        return container.x <= point.x && container.x + container.width >= point.x
            && container.y <= point.y && container.y + container.height >= point.y;
    }

    static rectangleContainsRectangle(container: IRectangle, rectangle: IRectangle): boolean {
        const left = rectangle.x;
        const right = rectangle.x + rectangle.width;
        const top = rectangle.y;
        const bottom = rectangle.y + rectangle.height;
        return Utils.rectangleContainsPoint(container, {x: left, y: top })
            && Utils.rectangleContainsPoint(container, {x: left, y: bottom })
            && Utils.rectangleContainsPoint(container, {x: right, y: top })
            && Utils.rectangleContainsPoint(container, {x: right, y: bottom });
    }

    static getSvgDataUrl(svgElement: Element): string {
        // Add custom style:
        // const style = document.createElement('style');
        // style.textContent = '/* <![CDATA[ */ * { font-family: Arial, sans-serif } /* ]]> */';
        // const firstSvgGroupElement = svgElement.querySelector('g');
        // firstSvgGroupElement.insertBefore(style, firstSvgGroupElement.firstChild);
    
        let svg = (new XMLSerializer()).serializeToString(svgElement);
        // add namespaces
        if (!svg.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
          svg = svg.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!svg.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
          svg = svg.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }
        // add xml declaration
        svg = '<?xml version="1.0" standalone="no"?>\r\n' + svg;
        // convert svg source to data URL scheme
        const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        return dataUrl;

        // due credit for part of this solution:
        // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
    }
}