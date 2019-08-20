import * as React from 'react';
import GuiAssign from './GuiAssign';
import { Declarations } from 'rule/declarations/Declarations';
import { Assign } from 'rule/elements/Assign';
import { IVariable } from 'rule/expression/IVariable';
import Modal from '../utils/Modal';
import { translate } from 'react-i18next';
import { IType } from 'rule/types/IType';
import { IScope } from 'rule/IScope';
import { ILoadables } from 'client/ILoadables';

interface IProps {
    assign: Assign;
    scope: IScope;
    loadables: ILoadables;
    declarations: Declarations;
    onClose?: Function;
    onRemove?: Function;
    t?: Function;
}
interface IState {
}

class GuiAssignPopup extends React.Component<IProps, IState> {
    private clone: Assign;
    constructor(props: any) {
        super(props);
        this.state = {};
        this.clone = this.props.assign.clone();
        if (!this.clone.variable) {
            this.clone.variable = { name: null, id: null, type: null };
        }
    }

    isNameForbidden = (): boolean => {
        return this.props.scope.forbiddenVariableNames
            .has(this.clone.variable.name);
    }

    isTypeMismatch = (): boolean => {
        return this.clone.expression.hasTypeMismatch(this.props.loadables.typeConverter);
    }
    
    validate = (): string => {
        const t = this.props.t;
        if (!this.clone.variable.name) {
            return t('error_varname_required');
        } else if (this.isNameForbidden()) {
            return t('error_var_overshadowing');
        } else if (!this.clone.expression.isComplete()) {
            return t('error_expression_unfinished');
        } else if (this.isTypeMismatch()) {
            return t('error_expression_type_mismatch');
        } else {
            this.save();
            if (this.props.assign.text === 'Assign') {
                this.props.assign.text = this.generateTitle();
            }
            return null;
        }
    }

    save(): void {
        const assign = this.clone;
        if (assign.variable.id === null) {
            const type = this.clone.expression.inferType();
            const variable = this.declareNewVariable(assign, type);
            assign.variable = variable;
        }
        this.props.assign.merge(assign);
    }

    declareNewVariable(assign: Assign, type: IType): IVariable {
        const name = assign.variable.name;
        const id = this.props.declarations.create(name, type);
        return { id, name, type, isDeclaration: true };
    }

    generateTitle = () => {
        return 'Assign to ' + this.clone.variable.name;
    }

    originalIsInvalid = (): boolean => {
        return this.props.assign.variable === null;
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
                <GuiAssign
                    assign={this.clone}
                    scope={this.props.scope}
                    loadables={this.props.loadables}
                />
            </Modal>                
        );
    }
}

export default translate()(GuiAssignPopup) as any;