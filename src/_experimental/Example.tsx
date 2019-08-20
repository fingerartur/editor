// import * as React from 'react';

// interface IProps {
//     name: string;
// }
// interface IState {
//     wasGreeted: boolean;
// }
// class Hello extends React.Component<IProps, IState> {
//     constructor(props: any) {
//         super(props);
//         this.state = {
//             wasGreeted: false
//         };
//         this.sayHi = this.sayHi.bind(this);
//     }

//     sayHi(): void {
//         if (!this.state.wasGreeted) {
//             alert('Hi ' + this.props.name);
//             this.setState({ wasGreeted: true });
//         }
//     }

//     render() {
//         return (
//             <div>
//                 <h2 style={{ color: 'red' }}>Hello</h2>
//                 <button onClick={this.sayHi}>Say hi</button>
//             </div>
//         );
//     }
// }

// class Welcome extends React.Component<IProps, IState> {
//     render() {
//         const name = "John";
//         return (
//             <div>
//                 <h1>Welcome</h1>
//                 <Hello name={name}/>
//             </div>
//         );
//     }
// }