import * as React from 'react';
import { Expression } from 'rule/expression/Expression';
import GuiArgument from './GuiArgument';
import { Trans } from 'react-i18next';
import { IScope } from 'rule/IScope';
import { ILoadables } from 'client/ILoadables';

interface IProps {
    expression: Expression;
    scope: IScope;
    loadables: ILoadables;
    onChange: Function;
    shouldInferType: boolean;
}
interface IState {
    showValidationMessage: boolean;
}

class GuiExpression extends React.Component<IProps, IState> {
    private arg: GuiArgument;
    private expression: Expression;

    constructor(props: any) {
        super(props);
        this.expression = this.props.expression;
        if (!this.expression) {
            this.expression = new Expression(null);
        }
        this.state = {
            showValidationMessage: false
        };
    }

    inferType = () => {
        this.expression.inferType();
    }

    focus = () => {
        this.arg.focus();
    }

    validateExpression = () => {
        if (this.props.shouldInferType) {
            this.inferType();
        }

        // Validation is not performed, because the GUI prevents the input of invalid data
        // However, the code is still here and can be re-enabled if needed.

        // this.expression.validateArgs(this.props.wrap.typeConverter);
        // this.setState({
        //     showValidationMessage: true
        // });
        // setTimeout(() => {
        //     this.setState({ showValidationMessage: false });
        // }, 600);

        this.props.onChange();
    }

    render() {
        const validationStyle = {
            color: 'rgba(81, 203, 238, 1)',
            transition: 'opacity 0s linear',
            opacity: 1,
            marginTop: 7
        };
        if (!this.state.showValidationMessage) {
            validationStyle.opacity = 0;
            validationStyle.transition = 'opacity 0.3s linear';
        }
        const rootArgument = this.expression.getRoot();
        return (
            <>
                <ul className="tree e2e-expression">
                    <GuiArgument
                        arg={rootArgument}
                        scope={this.props.scope}
                        loadables={this.props.loadables}
                        onValidationRequest={this.validateExpression}
                        ref={ref => this.arg = ref}
                    />
                </ul>
                <div style={validationStyle}>
                    <small><Trans>validated</Trans></small>
                </div>
            </>
        );
    }
}

export default GuiExpression;