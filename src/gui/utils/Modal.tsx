import * as React from 'react';
import { Modal as AntdModal, notification } from 'antd';
import { Key } from 'ts-keycode-enum';
import { translate } from 'react-i18next';

interface IProps {
    /**
     * prevents closing by returning an error message (null means no error, can close)
     */
    onBeforeSave: () => string;
    onSave?: () => void;
    onCancel?: () => void;
    onBeforeCancel?: () => string;
    t?: Function;
}
interface IState {
    isVisible: boolean;
}

/**
 * Pops up immediately
 * Gets closed on Enter key
 */
export class Modal extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isVisible: true
        };
    }

    save = () => {
        if (this.props.onBeforeSave) {
            const error = this.props.onBeforeSave();
            if (error) {
                notification.error({
                    message: this.props.t('error'),
                    description: error
                });
                return;
            }
        }

        this.setState({ isVisible: false });
        if (this.props.onSave) {
            this.props.onSave();
        }
    }

    cancel = () => {
        if (this.props.onBeforeCancel) {
            const error = this.props.onBeforeCancel();
            if (error) {
                notification.error({
                    message: this.props.t('error'),
                    description: error
                });
                return;
            }
        }

        this.setState({ isVisible: false });
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }
    
    render() {
        return (
            <div
                onKeyDown={(e) => {
                    if (e.keyCode === Key.Enter) {
                        this.save();
                    }
                }}
            >
                <AntdModal
                    visible={this.state.isVisible}
                    onOk={this.save}
                    onCancel={this.cancel}
                >
                    {this.props.children}
                </AntdModal>
            </div>
        );
    }
}

export default translate()(Modal) as any;
