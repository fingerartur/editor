import * as React from 'react';
import { Icon, Tooltip } from 'antd';

interface IProps {
    title: string;
    onDeleted: Function;
    error: string;
}
interface IState {
    deleteButtonVisible: boolean;
}

class ErrorableDeletableSpan extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            deleteButtonVisible: false,
        };
    }  

    render() {
        const normalStyle = { marginRight: '24px' };
        const errorStyle = {
            marginRight: '24px',
            border: '1px solid red',
            borderRadius: '10px',
            padding: '0 5px'
        }; 
        let style = normalStyle;
        if (this.props.error) {
            style = errorStyle;
        }

        return (
            <span
                onMouseEnter={() => {
                    this.setState({
                        deleteButtonVisible: true
                    });
                }}
                onMouseLeave={() => {
                    this.setState({ 
                        deleteButtonVisible: false
                    });
                }}
            >
                <Tooltip title={this.props.title}>
                    <span style={style}>{this.props.children}</span>
                </Tooltip>
                {
                    this.state.deleteButtonVisible ?
                    <>
                        <span
                            onClick={() => { this.props.onDeleted(); }}
                            style={{ padding: 4, borderRadius: 20, cursor: 'pointer'}}
                            className="e2e-arg-delete"
                        >
                            <Icon
                                style={{ color: 'red' }}
                                type="close-circle"
                            />
                        </span>
                        <br/>
                        {
                            this.props.error ?
                            <small style={{ color: 'red', fontStyle: 'italic', fontSize: 13 }}>
                                {this.props.error}
                            </small>
                            : null
                        }
                    </>
                    : null
                }
            </span>
        );
    }
}

export default ErrorableDeletableSpan;