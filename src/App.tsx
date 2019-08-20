import * as React from 'react';
import 'antd/dist/antd.min.css';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18n';
import { Rule } from 'rule/Rule';
import { MockClient } from 'client/MockClient';
import RulesList from 'gui/RulesList';
import { IRuleInfo } from 'rule/IRuleInfo';
import RuleEditor from 'gui/rule-editor/RuleEditor';
import Login from 'gui/Login';
import Button from 'gui/utils/Button';
import { Customizations } from 'customizations/Customizations';
import { Customization } from 'customizations/Customization';
import { Layout, Collapse } from 'antd';
import { newDeclarations } from 'client/mockData/declarations';
import { ILoadables } from 'client/ILoadables';
import { benchmarkExportSvg, benchmarkRenderRule, benchmarkSpeedOfSnapsvgLibraryForComplexElements, benchmarkLayout, benchmarkRenderRulePathological } from '_benchmark/benchmark';
const Panel = Collapse.Panel;

interface IProps { }
interface IState {
    lang: string;
    rule: Rule;
    ruleInfos: IRuleInfo[];
    loadables: ILoadables;
    customizations: Customizations;
}

const client = new MockClient();

class App extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            lang: 'cz',
            rule: null,
            ruleInfos: [],
            loadables: null,
            customizations: null
        };
    }

    componentDidMount() {
        this.loadLoadables();
        document.title = '-anonymized-';
    }

    loadLoadables = () => {
        Promise.all([
            client.getLoadables(),
            client.loadRuleInfos()
        ]).then(values => {
            const [ loadables, ruleInfos ] = values;
            this.setState({
                ruleInfos,
                loadables
            });
        });
    }
    
    saveRule = async () => {
        await client.saveRule(this.state.rule);
        const ruleInfos = await client.loadRuleInfos();
        this.setState({ rule: null, ruleInfos });
    }

    openRule = async (id: number) => {
        const rule = await client.loadRule(id);
        this.setState({ rule: new Rule(rule) });
    }

    closeRule = () => {
        this.setState({ rule: null });
    }

    createRule = () => {
        const rule = new Rule({
            id: this.getNextRuleId(),
            name: 'New rule',
            description: 'New empty rule with one global variable (Document)',
            rule: null,
            declarations: newDeclarations.serialize()
        });
        this.setState({ rule });
    }

    getNextRuleId = () => {
        const maxId = this.state.ruleInfos.map(info => info.id).reduce((prev, current) => {
            if (current > prev) {
                return current;
            } else {
                return prev;
            }
        }, 0) + 1;
        return maxId + 1;
    }

    render() {
        i18n.changeLanguage(this.state.lang);
        const otherLang = this.state.lang === 'en' ? 'cz' : 'en';
        const customizations = this.state.customizations;
        const isLoggedIn = customizations !== null;

        if (isLoggedIn) {
            return (
                <I18nextProvider i18n={i18n}>
                    <>
                        <div style={{ backgroundColor: '#66d9ff', width: '100%', height: 3}}/>
                        {
                            this.state.rule ?
                            <RuleEditor
                                rule={this.state.rule}
                                loadables={this.state.loadables}
                                onSave={this.saveRule}
                                onCancel={this.closeRule}
                                customizationButtonSaveAsText={customizations.get(Customization.COMPONENT_BUTTON_EXPORT_RULE_AS_TEXT)}
                                customizationLayout={customizations.get(Customization.LAYOUT_RULE_EDITOR)}
                                customizations={customizations}
                            />
                            :
                            <>
                                <Button
                                    style={{ margin: '2px'}}
                                    size="small"
                                    onClick={() => {
                                        this.setState({ lang: otherLang });
                                    }}
                                >
                                    <span className="e2e-lang">{otherLang}</span>
                                </Button>
                                <RulesList ruleInfos={this.state.ruleInfos} onSelect={this.openRule} onCreate={this.createRule}/>
                                <div style={{ width: '80%', margin: '0 auto', marginTop: '4em', color: 'grey' }}>
                                    <Collapse bordered={false}>
                                        <Panel header="Benchmarks" key="1">
                                            <span style={{ fontSize: '70%' }}>(To run a benchmark open F12 > Console, then click run)</span>
                                            <div style={{ paddingTop: 4 }}>SVG export <Button size="small" onClick={benchmarkExportSvg}>run</Button></div>
                                            <div style={{ paddingTop: 4 }}>Render rule <Button size="small" onClick={benchmarkRenderRule}>run</Button></div>
                                            <div style={{ paddingTop: 4 }}>Render pathological rule <Button size="small" onClick={benchmarkRenderRulePathological}>run</Button></div>
                                            <div style={{ paddingTop: 4 }}>Create elements with Snap.svg library <Button size="small" onClick={benchmarkSpeedOfSnapsvgLibraryForComplexElements}>run</Button></div>
                                            <div style={{ paddingTop: 4 }}>Custom layout algorithm <Button size="small" onClick={benchmarkLayout}>run</Button></div>
                                        </Panel>
                                    </Collapse> 
                                </div>
                            </>
                        }
                    </>
                </I18nextProvider>
            );
        } else {
            return (
                <Layout>
                    <Layout.Header style={{ backgroundColor: '#66d9ff' }}>
                        <div style={{ color: 'white', fontFamily: 'Gaegu', width: '50%', margin: '0 auto' }}>
                            <span style={{ fontSize: '300%', fontWeight: 'bold' }}>-anonymized-</span>
                            <span style={{ fontSize: '200%', marginLeft: '1em', color: '#e6f9ff'}}>Rule Management Interface</span>
                            <span style={{ fontSize: '100%', marginLeft: '1em', color: '#e6f9ff', fontStyle: 'italic'}}>prototype</span>
                        </div>
                    </Layout.Header>
                    <Layout.Content style={{width: '20em', margin: '0 auto'}}>
                        <Login onLogin={(loadedCustomizations) => { this.setState({ customizations: loadedCustomizations }); }}/>                        
                    </Layout.Content>
                </Layout>
            );
        }
    }
}

export default App;