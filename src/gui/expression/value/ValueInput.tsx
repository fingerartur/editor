import * as React from 'react';
import { Key } from 'ts-keycode-enum';
import { VariableAccessFilter } from './VariableAccessFilter';
import { OperationFilter } from './OperationFilter';
import { AutocompleteType } from './AutocompleteType';
import { Index } from './Index';
import { AccessGenerator } from './AccessGenerator';
import { Value } from 'rule/expression/Value';
import { HardwiredTypes } from 'rule/types/HardwiredTypes';
import { IType } from 'rule/types/IType';
import { IVariableAccess } from 'rule/expression/IVariableAccess';
import { OperationTypeFilter } from './OperationTypeFilter';
import { IOperationGroup } from 'rule/expression/IOperationGroup';
import  Badge from './Badge';
import { ArrayAccess } from 'rule/expression/ArrayAccess';
import { Arg } from 'rule/expression/Arg';
import MultiBadge from './MultiBadge';
import { Parser } from './Parser';
import Offer from './Offer';
import KeyEventBarrier from './KeyEventBarrier';
import ArrayIndexInput from './ArrayIndexInput';
import { ILoadables } from 'client/ILoadables';
import { IScope } from 'rule/IScope';
import { VariableAccess } from 'rule/expression/VariableAccess';

/**
 * type can be null, type.name can be null, type.isMultiValued can be null
 */
interface IProps {
    defaultValue?: string;
    type: IType;
    scope: IScope;
    loadables: ILoadables;
    onInput: (input: Value) => void;
    onCancel: () => void;
    isDismissable?: boolean;
    focused?: boolean;
    blurOnInput?: boolean;
}
interface IState {
    text: string;
    type: AutocompleteType;
    isFocused: boolean;
    literalTypes: string[];
}

class ValueInput extends React.Component<IProps, IState> {
    private input: HTMLInputElement;
    private accessFilter: VariableAccessFilter;
    private operationFilter: OperationFilter;
    private index: Index;
    private offerable: Value;
    private ignoreBlur = false;
    private isFinished = false;

    constructor(props: any) {
        super(props);
        this.state = {
            text: '',
            type: null,
            isFocused: this.props.focused,
            literalTypes: []
        };
        const { type, scope, loadables }  = this.props;
        this.accessFilter = this.getAccessFilter(type, scope, loadables);
        this.operationFilter = this.getOperationFilter(type, loadables);
        this.index = new Index(this.accessFilter, this.operationFilter);
    }

    componentDidMount() {
        if (this.state.isFocused) {
            this.input.focus();
        }
        const value = this.props.defaultValue;
        if (value != null) {
            this.setCursorPosition(value.length + 1);
            this.tryParseOutOfferable(value);
        }
        this.input.onblur = () => {
            if (this.ignoreBlur) {
                this.ignoreBlur = false;
                return;
            }
            this.setState({ isFocused: false });
            this.finishInput(this.offerable);
        };
    }

    focus = () => {
        this.input.focus();
        this.setState({ isFocused: true });
    }

    getAccessFilter = (inputType: IType, scope: IScope, loadables: ILoadables) => {
        let type: IType = null;
        if (inputType) {
            type = {...inputType};
            if (!type.isMultiValued) {
                type.isMultiValued = null;
            }
        }
        const accesses = new AccessGenerator(scope, loadables).generate(type);
        return new VariableAccessFilter(accesses);
    }

    getOperationFilter = (type: IType, loadables: ILoadables) => {
        let operationGroups: IOperationGroup[];
        if (type) {
            operationGroups = new OperationTypeFilter(loadables.operations, type, loadables.typeConverter).filter();
        } else {
            operationGroups = loadables.operations;
        }
        return new OperationFilter(operationGroups);
    }

    areFiltersEmpty = () => {
        return this.accessFilter.isEmpty() && this.operationFilter.isEmpty();
    }

    finishInput = (offerable: Value) => {
        if (this.isFinished) {
            return;
        }

        this.isFinished = true;
        this.props.onInput(offerable); // can be null
        if (this.state.isFocused) {
            this.setState({ isFocused: false });
            if (this.props.blurOnInput) {
                this.input.blur();
            }
        }
    }

    keyDownHandler = (e: any) => {
        if (e.keyCode === Key.UpArrow) {
            e.preventDefault();
            this.index.decrement();
        } else if (e.keyCode === Key.DownArrow) {
            this.index.increment();
        } else if (e.keyCode === Key.Enter || e.keyCode === Key.Tab) {
            e.preventDefault();
            if (this.offerable) {
                this.finishInput(this.offerable);
            }
            if (!this.areFiltersEmpty()) {
                this.complete();
            }
        } else if (e.keyCode === Key.Escape) {
            this.isFinished = true;
            this.props.onCancel();
        }
        this.forceUpdate();
    }

    keyUpHandler = (e: any) => {
        if (e.keyCode === Key.Quote) {
            this.input.value = '""';
            this.setCursorPosition(1);
        }
    }

    setCursorPosition = (position: number) => {
        this.input.selectionStart = position;
        this.input.selectionEnd = position;
    }

    complete = () => {
        const { index, type } = this.index.get();
        let text;
        if (type === AutocompleteType.VARIABLE_ACCESS) {
            const access = this.accessFilter.get(index);
            text = access.prefix;
        } else if (type === AutocompleteType.OPERATION) {
            const operation = this.operationFilter.get(index);
            text = operation.name;
        }
        this.changeText(text);
        if ((this.props.type && this.offerable && (this.props.type.isMultiValued === this.offerable.getType().isMultiValued))
            || (!this.props.type && this.offerable && !(this.offerable instanceof VariableAccess))) {
            this.finishInput(this.offerable);
        }
    }

    filter = (filter: string) => {
        this.accessFilter.filterBy(filter);
        this.operationFilter.filterBy(filter);
    }

    changeText = (text: string) => {
        this.input.value = text;
        this.offerable = null;
        this.tryParseOutOfferable(text.trim());
        this.setState({ text });
    }

    tryParseOutOfferable = (text: string) => {
        this.filter(text);
        this.index.reset();
        const parser = new Parser(this.props.loadables.typeConverter, this.props.type, this.accessFilter, this.operationFilter);
        const result = parser.parse(text);
        if (result) {
            let literalTypes: string[] = [];
            if (result.literalTypes) {
                literalTypes = result.literalTypes;
            }
            this.setState({ type: result.type, literalTypes });
            this.offerable = result.value;
            if (result.type === AutocompleteType.ARRAY_ACCESS) {
                this.setState({ isFocused: false });
                this.ignoreBlur = true;
            }
        } else {
            this.setState({ type: null, literalTypes: [] });
            this.offerable = null;
        }
    }

    offerArrayAccess = (index: Value) => {
        if (!index) { // when input loses focus
            if (this.props.type && !this.props.type.isMultiValued) {
                this.finishInput(null);
            } else {
                this.finishInput(this.offerable);
            }
        } else {
            const indexArg = new Arg({ name: 'index', type: { name: HardwiredTypes.INT }, value: index.serialize() });
            this.offerable = new ArrayAccess({
                array: this.offerable.serialize() as IVariableAccess,
                index: indexArg.serialize()
            });
            this.finishInput(this.offerable);
        }
    }

    render(): JSX.Element {
        let style = {};
        if (this.state.isFocused) {
            style = {
                boxShadow: '0 0 5px rgba(81, 203, 238, 1)',
                border: '1px solid rgba(81, 203, 238, 1)',
            };
        }
        return (
            <KeyEventBarrier>
                <Badge text={this.state.type} visible={this.state.isFocused}/>
                <input
                    defaultValue={this.props.defaultValue}
                    style={{
                        height: 25,
                        borderRadius: 7,
                        border: '1px solid grey',
                        outline: 'none',
                        ...style
                    }}
                    ref={ref => this.input = ref}
                    onChange={e => this.changeText(e.target.value)}     
                    onFocus={() => { this.setState({ isFocused: true }); }}
                    onKeyDown={this.keyDownHandler}
                    onKeyUp={this.keyUpHandler}
                    className="e2e-value-input"
                />
                <MultiBadge
                    visible={AutocompleteType.LITERAL && this.state.literalTypes.length > 0}
                    texts={this.state.literalTypes}
                    onSelect={(type: string) => {
                        this.offerable.setType({ name: type });
                        this.finishInput(this.offerable);
                    }}
                    onMouseDown={() => {
                        this.ignoreBlur = true;
                    }}
                />
                <ArrayIndexInput
                    visible={this.state.type === AutocompleteType.ARRAY_ACCESS}
                    scope={this.props.scope}
                    loadables={this.props.loadables}
                    onInput={this.offerArrayAccess}
                    onCancel={() => {
                        if (this.props.type) {
                            this.props.onCancel();
                        } else {
                            this.setState({ type: AutocompleteType.VARIABLE_ACCESS });
                            this.input.focus();
                        }
                    }}
                />
                <Offer
                    accessFilter={this.accessFilter}
                    operationFilter={this.operationFilter}
                    index={this.index}
                    footer={this.props.isDismissable ? <div style={{ backgroundColor: 'white', position: 'relative', top: 5 }}>Press <b>Esc</b> to dismiss.</div> : null}
                    visible={this.state.isFocused}
                    onMouseUp={() => {
                        this.input.focus();
                    }}
                    onMouseDown={() => {
                        this.ignoreBlur = true;
                    }}
                    onSelect={index => {
                        this.index.set(index);
                        this.complete();
                    }}
                />
            </KeyEventBarrier>
        );
    }
}

export default ValueInput;