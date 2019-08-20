import * as React from 'react';
import { Enhancer } from './Enhancer';
import { Assign } from 'rule/elements/Assign';
import GuiAssignPopup from 'gui/elements/GuiAssignPopup';
import { IElementPopupInfo } from './wraps/IElementPopupInfo';

export class AssignEnhancer extends Enhancer {

    constructor(
        private assign: Assign
    ) {
        super(assign);
    }

    renderGuiPopup(config: IElementPopupInfo): any {
        const { scope, loadables, onClose, onRemove, declarations } = config;
        return (
            <GuiAssignPopup
                assign={this.assign}
                scope={scope}
                loadables={loadables}
                declarations={declarations}
                onClose={onClose}
                onRemove={onRemove}
            />
        );
    }
}