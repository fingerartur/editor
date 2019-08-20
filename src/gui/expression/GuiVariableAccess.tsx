import * as React from 'react';
import { Arg } from 'rule/expression/Arg';
import ErrorableDeletableSpan from './ErrorableDeletableSpan';
import { Types } from 'rule/types/Types';
import { VariableAccess } from 'rule/expression/VariableAccess';
import { translate } from 'react-i18next';

interface IProps {
    arg: Arg;
    onDelete: Function;
    onClick: Function;
    t?: Function;
}
interface IState {}

class GuiVariableAccess extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    getTitle = () => {
        if (this.props.arg.type) {
            return this.props.t('variable', { type: Types.toString(this.props.arg.type) });
        } else {
            return null;
        }
    }

    render() {
        const arg = this.props.arg;
        const variable = arg.value as VariableAccess;
        return (
            <li>
                <ErrorableDeletableSpan
                    onDeleted={this.props.onDelete}
                    error={arg.error}
                    title={this.getTitle()}
                >
                    <span
                        style={{ fontWeight: 'bold' }}
                        onClick={this.props.onClick as any}
                    >
                        {variable.access}
                    </span>
                </ErrorableDeletableSpan>
            </li>
        );
    }
}

export default translate()(GuiVariableAccess) as any;