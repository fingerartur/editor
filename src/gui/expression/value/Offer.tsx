import * as React from 'react';
import OfferOperations from './OfferOperations';
import OfferVariableAccesses from './OfferVariableAccesses';
import { AutocompleteType } from './AutocompleteType';
import { VariableAccessFilter } from './VariableAccessFilter';
import { OperationFilter } from './OperationFilter';
import { Index } from './Index';

interface IProps {
    accessFilter: VariableAccessFilter;
    operationFilter: OperationFilter;
    index: Index;
    footer?: JSX.Element;
    visible: boolean;
    onMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    onSelect: (index: number) => void;
}
interface IState {}

class Offer extends React.Component<IProps, IState> {
    private divRef: HTMLDivElement;
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    componentDidUpdate() {
        if (this.divRef) {
            this.divRef.scrollTop = Math.max(0, this.props.index.get().index - 8) * 10;
        }
    }

    areFiltersEmpty = () => {
        return this.props.accessFilter.isEmpty() && this.props.operationFilter.isEmpty();
    }

    render() {
        if (!this.props.visible) {
            return null;
        }
        let indexAccess: number = null;
        let indexOperation: number = null;
        const indexInfo = this.props.index.get();
        if (indexInfo) {
            const { index, type } = indexInfo;
            if (type === AutocompleteType.VARIABLE_ACCESS) {
                indexAccess = index;
            } else if (type === AutocompleteType.OPERATION) {
                indexOperation = index;
            }
        }
        return (
            <div
                style={{ position: 'absolute', zIndex: 1 }}
                onMouseUp={this.props.onMouseUp}
                onMouseDown={this.props.onMouseDown}
            >
                {
                    !this.areFiltersEmpty() ?
                    <div
                        ref={ref => this.divRef = ref}
                        className="scroll"
                        style={{
                            maxHeight: 400,
                            overflowY: 'scroll',
                            backgroundColor: 'white',
                            boxShadow: '0px 1px 3px 3px rgba(0, 0, 255, .2)',
                            borderRadius: 10
                        }}
                    >
                        <OfferVariableAccesses
                            filter={this.props.accessFilter}
                            index={indexAccess}
                            onClick={this.props.onSelect}
                        />
                        <OfferOperations
                            filter={this.props.operationFilter}
                            index={indexOperation}
                            onClick={index => { this.props.onSelect(index + this.props.accessFilter.getSize()); }}
                        />
                    </div>  
                    : null
                }
                {this.props.footer}
            </div>
        );
    }
}

export default Offer;