import * as React from 'react';
import { List } from 'antd';
import { Trans } from 'react-i18next';
import Button from './utils/Button';
import { IRuleInfo } from 'rule/IRuleInfo';

interface IProps {
    ruleInfos: IRuleInfo[];
    onSelect: (ruleId: number) => void;
    onCreate: Function;
}
interface IState {}

class RulesList extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div style={{ width: '80%', margin: '0 auto' }}>
                <h1><Trans>rules</Trans></h1>
                <List
                    itemLayout="horizontal"
                    dataSource={this.props.ruleInfos}
                    renderItem={(info: IRuleInfo) => (          
                        <List.Item
                            actions={[<a key="1" onClick={() => { this.props.onSelect(info.id); }}><Trans>open</Trans></a>]}
                            className="e2e-rule"
                            data-id={info.id}
                        >
                            <List.Item.Meta
                                title={<b>{info.name}</b>}
                                description={info.description}
                            />
                        </List.Item>
                    )}
                />
                <div className="e2e-new-rule">
                    <Button onClick={() => this.props.onCreate()}><Trans>create_rule</Trans></Button>
                </div>
            </div>
        );
    }
}

export default RulesList;