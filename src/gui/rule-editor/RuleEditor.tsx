import * as React from 'react';
import { Rule } from 'rule/Rule';
import { Trans, translate } from 'react-i18next';
import Button from '../utils/Button';
import Diagram from './Diagram';
import Header from './Header';
import { Diagram as LogicDiagram } from 'diagram/Diagram';
import ExportSvgButton from './ExportSvgButton';
import { Customizations } from 'customizations/Customizations';
import { ILoadables } from 'client/ILoadables';
import { Input } from 'antd';
const Search = Input.Search;

export interface IProps {
    t?: Function;
    rule: Rule;
    onSave: Function;
    onCancel: Function;
    loadables: ILoadables;
    customizations: Customizations;
    customizationButtonSaveAsText?: any;
    customizationLayout?: Function;
}
interface IState {}

class RuleEditor extends React.Component<IProps, IState> {
    private rule: Rule;
    
    constructor(props: any) {
        super(props);
        this.rule = this.props.rule;
    }

    layout(
        props: IProps,
        rule: Rule,
        customizationButtonSaveAsText: any,
    ) {
        const width = window.innerWidth - 50;
        const height = window.innerHeight - 200;
        let diagram: LogicDiagram;
        return (
            <div style={{ marginTop: 5 }}>
                <Header
                    style={{ width, margin: '2px auto' }}
                    name={rule.name}
                    description={rule.description}
                    onSave={(name, description) => {
                        rule.name = name;
                        rule.description = description;
                    }}
                />
                <Diagram
                    rule={rule}
                    onMount={(newDiagram: LogicDiagram) => { diagram = newDiagram; }}
                    style={{ width, height, margin: '10px auto' }}
                    loadables={props.loadables}
                    customizations={props.customizations}
                />
                <div style={{ width, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                    <div>
                        <Button
                            onClick={() => props.onCancel()}
                            size="small"
                            style={{marginRight: 5}}
                        >
                            <Trans>cancel</Trans>
                        </Button>
                        <ExportSvgButton generateSvgDataUrl={() => diagram.exportAsDataUrl()}/>
                        {customizationButtonSaveAsText}
                        <div className="e2e-save">
                            <Button
                                onClick={() => props.onSave()}
                                style={{marginLeft: 5}}
                                size="small"
                            >
                                <Trans>save</Trans>
                            </Button>
                        </div>
                    </div>
                    <div>
                        <Search
                            placeholder={props.t('search')}
                            onSearch={value => {
                                diagram.find(value);
                            }}
                            style={{ width: 200 }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                        <Button size="small" onClick={() => diagram.shiftUp()}>&#x2b99;</Button>
                        <div>
                            <Button size="small" onClick={() => diagram.shiftLeft()}>&#x2b98;</Button>
                            <Button size="small" style={{margin: 5}} onClick={() => diagram.goBackToStart()}>&#x271b;</Button>
                            <Button size="small" onClick={() => diagram.shiftRight()}>&#x2b9a;</Button>
                        </div>
                        <Button size="small" onClick={() => diagram.shiftDown()}>&#x2b9b;</Button>
                    </div>
                    <div>
                        <Button size="small" style={{marginRight: 5}} onClick={() => diagram.zoomOut()}>-</Button>
                        <Button size="small" onClick={() => diagram.zoomIn()}>+</Button>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        let customizationButtonSaveAsText = null;
        if (this.props.customizationButtonSaveAsText) {
            customizationButtonSaveAsText = <this.props.customizationButtonSaveAsText rule={this.rule}/>;
        }

        let layout: Function = this.layout;
        if (this.props.customizationLayout) {
            layout = this.props.customizationLayout;
        }
        
        return layout(
            this.props,
            this.rule,
            customizationButtonSaveAsText
        );
    }
}

// export default RuleEditor;
export default translate()(RuleEditor) as any;