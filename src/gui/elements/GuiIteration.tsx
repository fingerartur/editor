import * as React from 'react';
import { Row, Col } from 'antd';
import { Iteration } from 'rule/elements/Iteration';
import { Trans } from 'react-i18next';
import DescriptionInput from './DescriptionInput';
import ValueInput from '../expression/value/ValueInput';
import { Value } from 'rule/expression/Value';
import { VariableAccess } from 'rule/expression/VariableAccess';
import { IVariable } from 'rule/expression/IVariable';
import VariableNameInput from './VariableNameInput';
import { IScope } from 'rule/IScope';
import { ILoadables } from 'client/ILoadables';

interface IProps {
    iteration: Iteration;
    scope: IScope;
    loadables: ILoadables;
}
interface IState {}

class GuiIteration extends React.Component<IProps, IState> {
    private valueInput: ValueInput;
    private variableInput: VariableNameInput;
    private description: DescriptionInput;

    private originalVariable: IVariable;
    constructor(props: any) {
        super(props);
        this.originalVariable = this.props.iteration.variable;
    }

    getVariable = (name: string): IVariable => {
        if (this.originalVariable && this.originalVariable.name === name) {
            return this.originalVariable;
        } else {
            return {
                id: null,
                type: null,
                name
            };
        }
    }

    focusIndexIfEmpty = () => {
        if (!this.props.iteration.value) {
            this.valueInput.focus();
        }
    }

    isVariableEditingEnabled = (): boolean => {
        const iteration = this.props.iteration;
        return !iteration.variable || iteration.hasErrorRedeclaration();
    }

    componentDidMount() {
        this.variableInput.focus();
    }

    render() {
        const variable = this.props.iteration.variable;
        const iteratedArray = this.props.iteration.value;
        let defaultName = '';
        if (variable) {
            defaultName = variable.name;
        }
        let defaultAccess = null;
        if (iteratedArray) {
            defaultAccess = iteratedArray.access;
        }
        return (
            <div>
                <DescriptionInput element={this.props.iteration} ref={ref => this.description = ref}/>
                <Row style={{ marginTop: '1em' }}>
                    <Col span={10}>
                        <div><Trans>iteration_var</Trans>:</div>
                        <VariableNameInput
                            disabled={!this.isVariableEditingEnabled()}
                            defaultName={defaultName}
                            availableNames={[]}
                            onChange={name => {
                                this.props.iteration.variable = this.getVariable(name);
                            }}
                            onEnterKey={this.focusIndexIfEmpty}
                            ref={ref => this.variableInput = ref}
                        />
                    </Col>
                    <Col span={4}/>
                    <Col span={10}>
                        <div><Trans>multivalued_var</Trans>:</div>
                        <ValueInput
                            defaultValue={defaultAccess}
                            type={{ name: null, isMultiValued: true }}
                            isDismissable={false}
                            scope={this.props.scope}
                            loadables={this.props.loadables}
                            onInput={(node: Value) => {
                                this.props.iteration.value = node ? (node as VariableAccess).serialize() : null;
                                this.description.focus();
                            }}
                            blurOnInput={true}
                            onCancel={() => {}}
                            ref={ref => this.valueInput = ref}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default GuiIteration;