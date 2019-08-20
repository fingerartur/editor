import * as React from 'react';
import { Input } from 'antd';
import { Trans } from 'react-i18next';
import { Element } from 'rule/elements/Element';

interface IProps {
    element: Element;
}
interface IState {}

class DescriptionInput extends React.Component<IProps, IState> {
    private input: Input;

    focus = () => {
        this.input.focus();
    }

    render() {
        return (
            <>
                <Trans>description</Trans>:
                <Input
                    defaultValue={this.props.element.text}
                    onChange={(e) => {this.props.element.text = e.target.value; }}
                    className="e2e-element-description"
                    ref={ref => this.input = ref}
                />
            </>
        );
    }
}

export default DescriptionInput;