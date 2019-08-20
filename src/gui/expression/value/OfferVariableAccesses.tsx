import * as React from 'react';
import { IOffer } from './IOffer';
import { VariableAccessFilter } from './VariableAccessFilter';
import ListHeader from './ListHeader';

interface IProps {
    index: number;
    filter: VariableAccessFilter;
    onClick: (index: number) => void;
}
interface IState {}

/**
 * Same intellisense as in vscode, plus adds a '.' automatically where useful
 * to have even better UX.
 */
class OfferVariableAccesses extends React.Component<IProps, IState> {

    renderOffers = (offers: IOffer[]) => {
        return offers.map((offer, index) => {
            const style = { borderRadius: 5, backgroundColor: 'white', paddingLeft: 10, paddingRight: 10, cursor: 'pointer' };
            if (this.props.index !== null && this.props.index === index) {
                style.backgroundColor = '#dbf4fc'; // light blue
            }
            return (
                <li key={offer.prefix} className="not-tree" style={{ marginRight: 15 }}>
                    <span onClick={() => { this.props.onClick(index); }} style={style}>{offer.attribute}</span>
                </li>
            );
        });
    }

    render() {
        if (this.props.filter.isEmpty()) {
            return null;
        }

        return (
            <>
                <ListHeader text="Variables"/>
                <ul className="not-tree">
                    {this.renderOffers(this.props.filter.getAll())}
                </ul>
            </>
        );
    }
}

export default OfferVariableAccesses;