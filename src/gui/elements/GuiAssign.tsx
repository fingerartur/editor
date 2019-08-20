import * as React from 'react';
import { Assign } from 'rule/elements/Assign';
import DescriptionInput from './DescriptionInput';
import VariableLabel from './VariableLabel';
import VariableCreate from './VariableCreate';
import GuiExpression from '../expression/GuiExpression';
import { IScope } from 'rule/IScope';
import { ILoadables } from 'client/ILoadables';

interface IProps {
    assign: Assign;
    scope: IScope;
    loadables: ILoadables;
}
interface IState {
    expressionAsText: string;
}

class GuiAssign extends React.Component<IProps, IState> {
    private expression: GuiExpression;
    private description: DescriptionInput;

    constructor(props: any) {        
        super(props);
        this.state = {
            expressionAsText: this.props.assign.expression.toString()
        };
    }

    updateExpressionType = () => {
        const assign = this.props.assign;
        assign.expression.getRoot().type = assign.variable.type;
        this.forceUpdate();
    }

    isVariableNameTaken = (): boolean => {
        const variable = this.props.assign.variable;
        return variable && variable.name && this.props.scope.forbiddenVariableNames.has(variable.name);
    }

    jumpFocus = () => {
        if (this.props.assign.expression.isEmpty()) {
            this.expression.focus();
        } else {
            this.description.focus();
        }
    }

    isVariableEditingEnabled = (): boolean => {
        const assign = this.props.assign;
        const variable = assign.variable;
        return !variable || !variable.isDeclaration || assign.hasErrorRedeclaration();
    }

    render() {
        const assign = this.props.assign;
        return (
            <div>
                <DescriptionInput element={this.props.assign} ref={ref => this.description = ref}/>
                <div>
                    <VariableLabel
                        variable={assign.variable}
                        isTaken={this.isVariableNameTaken()}
                    />
                    <div>
                        <VariableCreate
                            variable={assign.variable}
                            visibleDeclarations={this.props.scope.visibleDeclarations}
                            onChange={this.updateExpressionType}
                            onEnterKey={this.jumpFocus}
                            disabled={!this.isVariableEditingEnabled()}
                        />
                        <b style={{ margin: '0 10px' }}>:=</b>
                        <small>{this.state.expressionAsText}</small>
                    </div>
                    <div style={{ margin: '10px 0 0 6px' }}>
                        <GuiExpression
                            onChange={() => {
                                this.setState({ expressionAsText: assign.expression.toString() });
                                if (assign.expression.isComplete()) {
                                    this.description.focus();
                                }
                            }}
                            expression={assign.expression}
                            scope={this.props.scope}
                            loadables={this.props.loadables}
                            shouldInferType={assign.isDeclaration() && assign.expression.getType() === null}
                            ref={ref => this.expression = ref}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default GuiAssign;