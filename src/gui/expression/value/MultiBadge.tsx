import * as React from 'react';

interface IProps {
    visible: boolean;
    texts: string[];
    onMouseDown?: Function;
    onSelect: (text: string) => void;
}
interface IState {
    selected: number;
}

class MultiBadge extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            selected: 0
        };
    }

    render() {
        if (!this.props.texts || this.props.texts.length === 0 || !this.props.visible) {
            return null;
        }
        return (
            <div style={{position: 'absolute' }}>
                <div
                    style={{
                        position: 'relative',
                        top: -15,
                        left: 140,
                    }}
                >
                    {this.props.texts.map((text, index) => {
                        let moreStyle = {};
                        if (this.state.selected === index) {
                            moreStyle = {
                                color: 'white',
                                backgroundColor: 'rgb(213, 139, 255)', // purple
                                border: 'none'
                            };
                        }
                        return <span
                            onClick={() => {
                                this.setState({ selected: index });
                                this.props.onSelect(text);
                            }}
                            onMouseDown={() => {
                                if (this.props.onMouseDown) {
                                    this.props.onMouseDown();
                                }
                            }}
                            key={text}
                            style={{
                                color: 'darkgrey',
                                backgroundColor: 'white',
                                border: '1px solid grey',
                                borderRadius: 8,
                                padding: '3px 6px',
                                marginRight: 3,
                                zIndex: 1,
                                fontSize: '0.8em',
                                cursor: 'pointer',
                                ...moreStyle
                            }}
                        >
                            {text}
                        </span>;
                    })}
                </div>
            </div>
        );
    }
}

export default MultiBadge as any;