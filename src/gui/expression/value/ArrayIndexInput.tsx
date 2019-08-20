import * as React from 'react';
import ValueInput from './ValueInput';
import { HardwiredTypes } from 'rule/types/HardwiredTypes';
import { Value } from 'rule/expression/Value';
import { IScope } from 'rule/IScope';
import { ILoadables } from 'client/ILoadables';

interface IProps {
    visible: boolean;
    scope: IScope;
    loadables: ILoadables;
    onInput: (value: Value) => void;
    onCancel: () => void;
}
interface IState {}

class ArrayIndexInput extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        if (!this.props.visible) {
            return null;
        }
        return (
            <div>
                <div>Index:</div>
                <ValueInput
                    type={{ name: HardwiredTypes.INT, isMultiValued: false }}
                    scope={this.props.scope}
                    loadables={{...this.props.loadables, operations: []}}
                    onInput={this.props.onInput}
                    onCancel={this.props.onCancel}
                    isDismissable={true}
                    focused={true}
                />
            </div>
        );
    }
}

export default ArrayIndexInput;