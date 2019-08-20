import * as React from 'react';
import { Row, Col, Input } from 'antd';
import { Key } from 'ts-keycode-enum';
import Button from './utils/Button';
import { Customizations } from 'customizations/Customizations';

interface IProps {
    onLogin: (customizations: Customizations) => void;
}
interface IState {}

const USERS = [ '1', '2' ];

class Login extends React.Component<IProps, IState> {
    private name = '';
    constructor(props: any) {
        super(props);
    }

    logIn = async () => {
        if (USERS.indexOf(this.name) === -1) {
            alert('allowed names are: ' + USERS);
            return;   
        }

        const customizations = await Customizations.loadCustomizationsFor(this.name);
        this.props.onLogin(customizations);
    }

    /**
     * Enterprise customer 1 is represented by login name 1
     * Enterprise customer 2 is represented by login name 2
     */
    getVersionName = (userId: string) => {
        return userId;
    }

    render() {
        const labelStyle = { textAlign: 'right', paddingRight: '1em' };
        return (
            <div
                style={{ marginTop: '4em', paddingBottom: '6em' }}
                onKeyDown={(event) => {
                    if (event.keyCode === Key.Enter) {
                        this.logIn();
                    }
                }}
            >
                <Row>
                    <Col span={8} style={labelStyle}>Name:</Col>
                    <Col span={16}>
                        <Input
                            placeholder="Username" 
                            onChange={(event) => { this.name = event.target.value; }} 
                        />
                    </Col>
                </Row>
                <Row style={{ marginTop: '0.2em' }}>
                    <Col span={8} style={labelStyle}>Password:</Col>
                    <Col span={16}>
                        <Input
                            placeholder="Password" 
                            type="password"
                            disabled={true}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={8}/>
                    <Col span={16}>
                        <Button onClick={this.logIn} style={{ marginTop: '1em' }}>Log in</Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Login;