import { Enhancer } from './Enhancer';
import { End } from 'rule/elements/End';
import { IElementPopupInfo } from './wraps/IElementPopupInfo';

export class EndEnhancer extends Enhancer {

    constructor(
        private end: End
    ) {
        super(end);
    }

    renderGuiPopup(config: IElementPopupInfo): any {
        return null;
    }
}