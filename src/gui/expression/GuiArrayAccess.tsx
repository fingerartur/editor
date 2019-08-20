import * as React from 'react';
import { Arg } from 'rule/expression/Arg';
import ErrorableDeletableSpan from './ErrorableDeletableSpan';
import { Types } from 'rule/types/Types';
import { translate } from 'react-i18next';
import { ArrayAccess } from 'rule/expression/ArrayAccess';

interface IProps {
    arg: Arg;
    onDelete: Function;
    onClick: Function;
    t?: Function;
}
interface IState {}

class GuiArrayAccess extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    getTitle = () => {
        if (this.props.arg.type) {
            return this.props.t('array_access', { type: Types.toString(this.props.arg.type) });
        } else {
            return null;
        }
    }

    render() {
        const arg = this.props.arg;
        const arrayAccess = arg.value as ArrayAccess;
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
                        {arrayAccess.toString()}
                    </span>
                </ErrorableDeletableSpan>
            </li>
        );
    }
}

export default translate()(GuiArrayAccess) as any;