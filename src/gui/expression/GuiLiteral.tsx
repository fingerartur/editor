import * as React from 'react';
import { Arg } from 'rule/expression/Arg';
import ErrorableDeletableSpan from './ErrorableDeletableSpan';
import { Types } from 'rule/types/Types';
import { translate } from 'react-i18next';
import { Literal } from 'rule/expression/Literal';

interface IProps {
    arg: Arg;
    onDelete: Function;
    onClick: Function;
    t?: Function;
}
interface IState {}

class GuiLiteral extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    getTitle = () => {
        if (this.props.arg.type) {
            return this.props.t('literal', { type: Types.toString(this.props.arg.type) });
        } else {
            return null;
        }
    }

    render() {
        const arg = this.props.arg;
        const literal = arg.value as Literal;
        return (
            <li>
                <ErrorableDeletableSpan
                    onDeleted={this.props.onDelete}
                    error={arg.error}
                    title={this.getTitle()}
                >
                    <span onClick={this.props.onClick as any} className="e2e-literal" data-e2e={literal.value}>
                        {literal.value}
                    </span>
                </ErrorableDeletableSpan>
            </li>
        );
    }
}

export default translate()(GuiLiteral) as any;