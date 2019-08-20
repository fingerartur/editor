import * as React from 'react';
import { Input, Button, Icon } from 'antd';
import { Trans } from 'react-i18next';
import Legend from './Legend';
import { Key } from 'ts-keycode-enum';

interface IProps {
    style?: any;
    name: string;
    description: string;
    onSave: (name: string, description: string) => void;
}
interface IState {
    isEditing: boolean;
}

class Header extends React.Component<IProps, IState> {
    private name: string;
    private description: string;

    constructor(props: any) {
        super(props);
        this.state = {
            isEditing: false
        };
        this.name = this.props.name;
        this.description = this.props.description;
    }

    save = () => {
        this.props.onSave(this.name, this.description);
        this.setState({ isEditing: false });
    }

    edit = () => {
        this.setState({ isEditing: true });
    }

    render() {
        return (
            <div style={this.props.style || {}}>
                {
                    this.state.isEditing ?
                    <>
                        <div
                            onKeyDown={(event) => {
                                if (event.keyCode === Key.Enter) {
                                    this.save();
                                }
                            }}
                        >
                            <span>
                                <Trans>name</Trans>:
                                <Input onChange={event => { this.name = event.target.value; }} defaultValue={this.name}/>
                            </span>
                            <span>
                                <Trans>description</Trans>:
                                <Input onChange={event => { this.description = event.target.value; }} defaultValue={this.description}/>
                            </span>
                        </div>
                        <Button
                            onClick={this.save}
                            style={{ marginTop: 10 }}
                            size="small"
                        >
                            <Trans>save</Trans>
                        </Button>
                    </>
                    :
                    <>
                        <strong onClick={this.edit}>{this.name}</strong>
                        <span onClick={this.edit} style={{ color: 'grey', fontStyle: 'italic', marginLeft: '1.5em', fontSize: '80%' }}>
                            {this.description}
                        </span>
                        <Icon
                            type="edit"
                            onClick={this.edit}
                            style={{ cursor: 'pointer', marginLeft: '2em' }}
                        />
                        <Legend/>
                    </>
                }
            </div>
        );
    }
}

export default Header;