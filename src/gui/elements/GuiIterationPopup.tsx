import * as React from 'react';
import { Iteration } from 'rule/elements/Iteration';
import GuiIteration from './GuiIteration';
import Modal from '../utils/Modal';
import { translate } from 'react-i18next';
import { Declarations } from 'rule/declarations/Declarations';
import { IVariable } from 'rule/expression/IVariable';
import { IType } from 'rule/types/IType';
import { ILoadables } from 'client/ILoadables';
import { IScope } from 'rule/IScope';

interface IProps {
    declarations: Declarations;
    iteration: Iteration;
    scope: IScope;
    loadables: ILoadables;
    onClose: Function;
    onRemove: Function;
    t?: Function;
}
interface IState {
}

export class GuiIterationPopup extends React.Component<IProps, IState> {
    private clone: Iteration;
    constructor(props: any) {
        super(props);
        this.state = {};
        this.clone = this.props.iteration.clone() as Iteration;
    }

    validate = (): string => {
        const t = this.props.t;
        const variable = this.clone.variable;
        if (!variable || !variable.name.trim()) {
            return t('error_iteration_varname_required');
        }
        variable.name = variable.name.trim();
        if (this.nameIsTaken(variable.name)) {
            return t('error_iteration_varname_taken');
        } else if (!this.clone.value) {
            return t('error_multivalued_variable_required');
        } else {
            this.save();
            return null;
        }
    }

    nameIsTaken = (name: string): boolean => {
        const visibleDeclarations = this.props.scope.visibleDeclarations;
        let result = false;
        if (visibleDeclarations.find(declaration => declaration.name === name) !== undefined) {
            result = true;
        }
        const variable = this.props.iteration.variable;
        if (variable && variable.name === name) {
            result = false;
        }
        return result;
    }

    save = () => {
        if (!this.clone.variable.id) {
            this.clone.variable = this.declareIterationVariable();    
        }
        this.props.iteration.merge(this.clone);
    }

    declareIterationVariable = (): IVariable => {
        const name = this.clone.variable.name;
        const type: IType = { name: this.clone.value.type.name, isMultiValued: false };
        const id = this.props.declarations.create(name, type);
        return { id, name, type, isDeclaration: true };
    }

    originalIsInvalid = (): boolean => {
        return this.props.iteration.variable == null;
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
            <div>
                <Modal
                    onBeforeSave={this.validate}
                    onSave={this.props.onClose}
                    onCancel={this.onCancel}
                >
                    <GuiIteration
                        iteration={this.clone}
                        scope={this.props.scope}
                        loadables={this.props.loadables}
                    />
                </Modal>
            </div>
        );
    }
}

export default translate()(GuiIterationPopup) as any;