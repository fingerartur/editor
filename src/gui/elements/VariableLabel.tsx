import * as React from 'react';
import { Trans } from 'react-i18next';
import { Types } from 'rule/types/Types';
import { IVariable } from 'rule/expression/IVariable';

interface IProps {
    variable: IVariable;
    isTaken: boolean;
}
interface IState {}

class VariableLabel extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        let text = <Trans>enter_var_name</Trans>;
        let color = 'black';
        if (this.props.isTaken) {
            text = <Trans>var_name_overshadows</Trans>;
            color = 'red';
        } else if (this.props.variable.id) {
            text = <>{Types.toString(this.props.variable.type)}</>;
            color = '#00b4e6'; // blue
        } else if (this.props.variable.name) {
            text = <Trans>creating_a_new_variable</Trans>;
            color = '#00b900'; // green
        }

        return (
            <>
                <small><Trans>var_name</Trans></small>
                <small style={{color, marginLeft: '0.7em'}}>{text}</small>
            </>
        );
    }
}

export default VariableLabel;