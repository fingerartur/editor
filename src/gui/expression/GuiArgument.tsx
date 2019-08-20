import * as React from 'react';
import { Arg } from 'rule/expression/Arg';
import { Operation } from 'rule/expression/Operation';
import { Literal } from 'rule/expression/Literal';
import GuiOperation from './GuiOperation';
import { styleType } from './consts';
import { VariableAccess } from 'rule/expression/VariableAccess';
import GuiVariableAccess from './GuiVariableAccess';
import { Types } from 'rule/types/Types';
import ValueInput from './value/ValueInput';
import GuiLiteral from './GuiLiteral';
import { ArrayAccess } from 'rule/expression/ArrayAccess';
import GuiArrayAccess from './GuiArrayAccess';
import { IScope } from 'rule/IScope';
import { ILoadables } from 'client/ILoadables';
import { Value } from 'rule/expression/Value';

interface IProps {
    arg: Arg;
    scope: IScope;
    loadables: ILoadables;
    onValidationRequest: Function;
}
interface IState {
    isInputting: boolean;
    original: Value;
}

class GuiArgument extends React.Component<IProps, IState> {
    private span: HTMLSpanElement;

    constructor(props: any) {
        super(props);
        this.state = {
            isInputting: false,
            original: null 
        };
    }

    deleteValue = () => {
        this.props.arg.value = null;
        this.props.onValidationRequest();
    }

    focus = () => {
        this.span.focus();
    }

    edit = () => {
        const arg = this.props.arg;
        if (arg.value) {
            this.setState({ isInputting: true, original: arg.value });
            arg.value = null;
        }
    }

    render() {
        let arg = this.props.arg;       
        if (arg.value) {
            if (arg.value instanceof Operation) {
                return (
                    <GuiOperation
                        arg={arg}
                        scope={this.props.scope}
                        loadables={this.props.loadables}
                        onDelete={this.deleteValue}
                        onValidationRequest={this.props.onValidationRequest}
                    />
                );
            } else if (arg.value instanceof VariableAccess) { 
                return (
                    <GuiVariableAccess
                        arg={arg}
                        onDelete={this.deleteValue}
                        onClick={this.edit}
                    />
                );
            } else if (arg.value instanceof Literal) {
                return (
                    <GuiLiteral
                        arg={arg}
                        onDelete={this.deleteValue}
                        onClick={this.edit}
                    />
                );
            } else if (arg.value instanceof ArrayAccess) {
                return (
                    <GuiArrayAccess
                        arg={arg}
                        onDelete={this.deleteValue}
                        onClick={this.edit}
                    />
                );
            } else {
                throw new Error('bug unsupported type of value');
            }
            
        } else { // no value
            let type = '';
            if (arg.type) {
                type = Types.toString(arg.type);
            }
            let focusProps = {};
            if (!arg.value) {
                focusProps = {
                    tabIndex: 0,
                    onFocus: () => { this.setState({ isInputting: true }); }
                };
            }
            const original = this.state.original;
            let defaultValue = null;
            if (original instanceof Literal) {
                defaultValue = original.value;
            } else if (original instanceof VariableAccess) {
                defaultValue = original.toString();
            } else if (original instanceof ArrayAccess) {
                defaultValue = original.array.access;
            }
            return (
                <li>
                    {
                        this.state.isInputting ?
                        <ValueInput
                            defaultValue={defaultValue}
                            type={arg.type}
                            scope={this.props.scope}
                            loadables={this.props.loadables}
                            onInput={value => {
                                arg.value = value;
                                this.props.onValidationRequest();
                                this.setState({ isInputting: false, original: null });
                            }}
                            onCancel={() => {
                                this.props.arg.value = this.state.original;
                                this.setState({ isInputting: false });
                            }}
                            focused={true}
                        />
                        :
                        <span
                            className="e2e-expression-empty-argument"
                            onClick={() => { this.setState({ isInputting: true }); }}
                            tabIndex={0}
                            onFocus={() => { this.setState({ isInputting: true }); }}
                            ref={ref => this.span = ref}
                        >
                            <span style={{color: '#cccccc', fontWeight: 100}}>
                                {arg.name}
                            </span>
                            <span style={styleType}>{type}</span>
                        </span>
                    }
                </li>
            );
        }
    }
}

export default GuiArgument;