import * as React from 'react';

interface IProps {}
interface IState {}
class Hello extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (<div>Hello</div>);
    }
}

class NormalInstantiation extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (<Hello/>);
    }
}

class DynamicInstantiation extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        const ComponentClass = Hello;
        return (<ComponentClass />);
    }
}