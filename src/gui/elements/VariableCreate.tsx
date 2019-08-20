import * as React from 'react';
import { Declaration } from 'rule/declarations/Declaration';
import VariableNameInput from './VariableNameInput';
import { IVariable } from 'rule/expression/IVariable';

interface IProps {
    visibleDeclarations: Declaration[];
    variable: IVariable;
    onChange: Function;
    onEnterKey?: Function;
    disabled: boolean;
}
interface IState {}

class VariableCreate extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    setVariable = (data: IVariable) => {
        const variable = this.props.variable;
        Object.assign(variable, data);
        variable.isDeclaration = false;
    }

    changeVariable = (name: string) => {
        const declaration = this.props.visibleDeclarations
            .find(declaration2 => declaration2.name === name);
        if (declaration) {
            this.setVariable(declaration);
        } else {
            this.setVariable({ id: null, name, type: null });
        }
        this.props.onChange();
    }

    render() {
        const availableNames = this.props.visibleDeclarations
            .map(declaration => declaration.name);
        const variable = this.props.variable;
        return (
            <VariableNameInput
                disabled={this.props.disabled}
                defaultName={variable.name}
                availableNames={availableNames}
                onChange={this.changeVariable}
                onEnterKey={this.props.onEnterKey}
            />
        );
    }
}

export default VariableCreate;