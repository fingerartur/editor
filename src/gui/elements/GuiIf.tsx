import * as React from 'react';
import GuiExpression from '../expression/GuiExpression';
import { If } from 'rule/elements/If';
import DescriptionInput from './DescriptionInput';
import { IScope } from 'rule/IScope';
import { ILoadables } from 'client/ILoadables';

interface IProps {
    if: If;
    scope: IScope;
    loadables: ILoadables;
}
interface IState {}

class GuiIf extends React.Component<IProps, IState> {
    private description: DescriptionInput;
    private expression: GuiExpression;

    constructor(props: any) {        
        super(props);
    }

    componentDidMount() {
        if (this.props.if.getCondition().isEmpty()) {
            this.expression.focus();
        }
    }

    render() {
        const ifElement = this.props.if;
        return (
            <div>
                <DescriptionInput element={ifElement} ref={ref => this.description = ref}/>
                <div style={{ margin: '10px 0 0 6px' }}>
                    <GuiExpression
                        expression={ifElement.getCondition()}
                        scope={this.props.scope}
                        loadables={this.props.loadables}
                        onChange={() => {
                            if (ifElement.getCondition().isComplete()) {
                                this.description.focus();
                            }
                            this.forceUpdate();
                        }}
                        shouldInferType={false}
                        ref={ref => this.expression = ref}
                    />
                </div>
            </div>
        );
    }
}

export default GuiIf;