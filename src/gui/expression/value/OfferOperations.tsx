import * as React from 'react';
import { IOperationGroup } from 'rule/expression/IOperationGroup';
import { OperationFilter } from './OperationFilter';
import ListHeader from './ListHeader';

interface IProps {
    index: number;
    filter: OperationFilter;
    onClick: (index: number) => void;
}
interface IState {}

class OfferOperations extends React.Component<IProps, IState> {    
    private indexHelper: number;

    constructor(props: any) {
        super(props);
        this.state = {};
    }

    renderOperationGroup = (group: IOperationGroup) => {                  
        return (
            <div key={group.name}>
                <span style={{ fontSize: '0.8em', color: 'grey', paddingLeft: '1em', marginRight: 15 }}>{group.name}</span>
                <ul style={{ margin: 0 }} className="not-tree">
                    {group.operations.map(operation => {
                        const style = { borderRadius: 5, backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, cursor: 'pointer' };  
                        if (this.props.index !== null && this.props.index === this.indexHelper) {
                            style.backgroundColor = '#dbf4fc'; // light blue
                        }
                        const index = this.indexHelper;
                        this.indexHelper++;
                        return <li onClick={() => { this.props.onClick(index); }} key={operation.name} style={style} className="not-tree">{operation.name}</li>;
                    })}
                </ul>
            </div>
        );
    }

    renderOperationGroups = (groups: IOperationGroup[]) => {
        this.indexHelper = 0;
        return groups.map(group => this.renderOperationGroup(group));
    }

    render() {
        const filter = this.props.filter;
        if (filter.isEmpty()) {
            return null;
        }

        return (
            <>
                <ListHeader text="Operations"/>
                {this.renderOperationGroups(filter.getAll())}
            </>
        );
    }
}

export default OfferOperations;