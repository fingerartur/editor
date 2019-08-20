import * as React from 'react';
import { Icon, Popover } from 'antd';

class Action extends React.Component<{ text: string; }, {}> {
    render() {
        return (
            <span style={{color: '#cccccc', marginLeft: '1em', fontStyle: 'italic', float: 'right'}}>
                {this.props.text}
            </span>
        );
    }
}

interface IProps {}
interface IState {}

class Legend extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        
        const content = (
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                <li>Ctrl + C <Action text="Copy"/></li>
                <li>Ctrl + V <Action text="Paste"/></li>
                <li>Ctrl + Z <Action text="Undo"/></li>
                <li>Ctrl + Shift + Z <Action text="Redo"/></li>
                <li>Del <Action text="Delete"/></li>
                <li>Ctrl + + <Action text="Zoom in"/></li>
                <li>Ctrl + - <Action text="Zoom out"/></li>
                <li>&larr;, &uarr;, &rarr;, &darr;<Action text="Browse"/></li>
            </ul>
        );
        return (
            <Popover content={content} title="Shortcuts" placement="bottomRight">
                <Icon type="question-circle-o" style={{ float: 'right' }}/>
            </Popover>
        );
    }
}

export default Legend;