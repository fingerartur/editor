import * as React from 'react';

interface IProps {
    text: string;
}
interface IState {}

class ListHeader extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (<div style={{ fontSize: '0.8em', color: 'grey', paddingLeft: '1em', backgroundColor: '#eee' }}>{this.props.text}</div>);
    }
}

export default ListHeader;