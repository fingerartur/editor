import * as React from 'react';
import { AutoComplete } from 'antd';
import { Key } from 'ts-keycode-enum';

interface IProps {
    availableNames: string[];
    onChange: (name: string) => void;
    defaultName: string;
    disabled?: boolean;
    onEnterKey?: Function;
}
interface IState {}

class VariableNameInput extends React.Component<IProps, IState> {
    private autocomplete: AutoComplete;
    private variableTemp: string;

    constructor(props: any) {
        super(props);
        this.variableTemp = this.props.defaultName;
    }

    blurAutocomplete = () => {
        this.autocomplete.blur();
    }

    focus = () => {
        this.autocomplete.focus();
        // bug: antd autocomplete.focus() does not work
    }

    handleKeydown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        if (e.keyCode === Key.Enter) {
            this.blurAutocomplete();
            if (this.props.onEnterKey) {
                this.props.onEnterKey();
            }
            e.stopPropagation();
        }
    }

    render() {
        return (
            <span
                onKeyDown={this.handleKeydown}
                onBlur={this.blurAutocomplete}
            >
                <AutoComplete
                    disabled={this.props.disabled}
                    defaultValue={this.variableTemp}
                    ref={ref => this.autocomplete = ref}
                    style={{ width: 200 }}
                    dataSource={this.props.availableNames}
                    filterOption={(value, option) => {
                        return option.key.toString().toLowerCase().startsWith(value.toLowerCase());
                    }}
                    onChange={(value) => {
                        this.variableTemp = value as string;
                        this.props.onChange(this.variableTemp);
                    }}
                    onSelect={this.blurAutocomplete}
                />
            </span>
        );
    }
}

export default VariableNameInput;