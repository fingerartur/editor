import * as React from 'react';
import GuiIf from './GuiIf';
import { If } from 'rule/elements/If';
import Modal from '../utils/Modal';
import { translate } from 'react-i18next';
import { IScope } from 'rule/IScope';
import { ILoadables } from 'client/ILoadables';

interface IProps {
    if: If;
    scope: IScope;
    loadables: ILoadables;
    onClose: Function;
    onRemove: Function;
    t?: Function;
}
interface IState {
}

class GuiIfPopup extends React.Component<IProps, IState> {
    private clone: If;
    constructor(props: any) {
        super(props);
        this.clone = this.props.if.clone();
    }
    
    validate = (): string => {
        if (!this.clone.getCondition().isComplete()) {
            return this.props.t('condition_unfinished');
        } else {
            this.props.if.merge(this.clone);
            return null;
        }
    }

    originalIsInvalid = (): boolean => {
        return this.props.if.getCondition().isEmpty();
    }

    onCancel = () => {
        if (this.originalIsInvalid()) {
            this.props.onRemove();
        } else {
            this.props.onClose();
        }
    }
    
    render() {
        return (
                <Modal
                    onBeforeSave={this.validate}
                    onSave={this.props.onClose}
                    onCancel={this.onCancel}
                >
                    <GuiIf
                        if={this.clone}
                        scope={this.props.scope}
                        loadables={this.props.loadables}
                    />
                </Modal>
        );
    }
}

export default translate()(GuiIfPopup) as any;