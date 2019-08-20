import * as React from 'react';
import { Trans, translate } from 'react-i18next';

interface IProps {
    visible?: boolean;
    text: string;
}
interface IState {}

class Badge extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        if (!this.props.text) {
            return null;
        }
        if (this.props.visible === false) {
            return null;
        }

        return (
            <div style={{position: 'absolute' }}>
                <span
                    style={{
                        color: 'white',
                        backgroundColor: '#23c6fc', // blue
                        borderRadius: 8,
                        padding: '3px 6px',
                        zIndex: 1,
                        fontSize: '0.8em',
                        position: 'relative',
                        top: -15,
                        left: 140,
                    }}
                >
                    <Trans>{this.props.text}</Trans>
                </span>
            </div>
        );
    }
}

export default translate()(Badge) as any;