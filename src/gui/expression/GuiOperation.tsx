import { Types } from 'rule/types/Types';
import * as React from 'react';
import ErrorableDeletableSpan from './ErrorableDeletableSpan';
import { Arg } from 'rule/expression/Arg';
import GuiArgument from './GuiArgument';
import { Operation } from 'rule/expression/Operation';
import { translate } from 'react-i18next';
import { IScope } from 'rule/IScope';
import { ILoadables } from 'client/ILoadables';

interface IProps {
    arg: Arg;
    scope: IScope;
    loadables: ILoadables;
    onValidationRequest: Function;
    onDelete: Function;
    t?: Function;
}
interface IState {}

class GuiOperation extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    getTitle = () => {
        if (this.props.arg.type) {
            return this.props.t('operation', { type: Types.toString(this.props.arg.type) });
        } else {
            return null;
        }
    }

    render(): JSX.Element { // type annotation here is needed by TSC
        const error = this.props.arg.error;
        const operation = this.props.arg.value as Operation;
        return (
            <li>
                <ErrorableDeletableSpan
                    onDeleted={this.props.onDelete}
                    error={error}
                    title={this.getTitle()}
                >
                    {operation.sign || operation.name}
                </ErrorableDeletableSpan>
                <ul>
                    {operation.args.map(arg2 =>
                        <GuiArgument
                            key={arg2.name + arg2.type}
                            arg={arg2} 
                            scope={this.props.scope}
                            loadables={this.props.loadables}
                            onValidationRequest={this.props.onValidationRequest}
                        />
                    )}
                </ul>
            </li>
        );
    }
}

export default translate()(GuiOperation) as any;