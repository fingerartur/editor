import * as React from 'react';
let Worker = require('worker!./worker.js');

interface IProps {}
interface IState {}

class GuiWorker extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    startWebWorker = () => {
        const worker = new Worker('worker.js');
        worker.onmessage = (message: string) => {
            alert(message);
        };
    }

    render() {
        return (
            <div>
                <button onClick={this.startWebWorker}>run worker</button>
            </div>
        );
    }
}

export default GuiWorker;