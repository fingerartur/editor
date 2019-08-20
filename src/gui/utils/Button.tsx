import * as React from 'react';
import { Button as AntdButton } from 'antd';

declare type ClickHandler = (event: React.FormEvent<any>) => void;

interface IProps {
    onClick?: ClickHandler;
    title?: string;
    loading?: boolean;
    style?: any;
    size?: 'small' | 'default' | 'large';
}
interface IState {}

class Button extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        const onClick = this.props.onClick || (() => {});
        const loading = this.props.loading || false;
        const style = this.props.style || {};
        const title = this.props.title || '';
        return (
            <span title={title}>
                <AntdButton
                    style={style}
                    onClick={onClick}
                    loading={loading}
                    size={this.props.size || 'default'}
                >
                    {this.props.children}
                </AntdButton>
            </span>
        );
    }
}

export default Button;