import * as React from 'react';

interface IProps {}
interface IState {}

class KeyEventBarrier extends React.Component<IProps, IState> {
    render() {
        return (
            <div
                onKeyPress={e => e.stopPropagation()}
                onKeyDown={e => e.stopPropagation()}
                onKeyUp={e => e.stopPropagation()}
            >
                {this.props.children}
            </div>
        );
    }
}

export default KeyEventBarrier;