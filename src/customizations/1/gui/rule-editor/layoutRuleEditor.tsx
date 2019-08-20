import * as React from 'react';
import { Rule } from 'rule/Rule';
import { IProps } from 'gui/rule-editor/RuleEditor';
import { Diagram as LogicDiagram } from 'diagram/Diagram';
import Diagram from 'gui/rule-editor/Diagram';
import Header from 'gui/rule-editor/Header';
import ExportSvgButton from 'gui/rule-editor/ExportSvgButton';
import { Button, Col, Row } from 'antd';
import { Trans } from 'react-i18next';

export function layoutRuleEditor(
    props: IProps,
    rule: Rule,
    customizationButtonSaveAsText: any,
) {
    const width = window.innerWidth - 50;
    const height = window.innerHeight - 200;
    let diagram: LogicDiagram;
    return (
        <Row style={{ width, margin: '10px auto' }}>
            <Col span={12}>
                <Diagram
                    rule={rule}
                    onMount={(newDiagram: LogicDiagram) => { diagram = newDiagram; }}
                    style={{ height, width: '100%' }}
                    loadables={props.loadables}
                    customizations={props.customizations}
                />
            </Col>
            <Col span={1}/>
            <Col span={8}>
                <Header
                    style={{ marginBottom: '2em' }}
                    name={rule.name}
                    description={rule.description}
                    onSave={(name, description) => {
                        rule.name = name;
                        rule.description = description;
                    }}
                />
                <div>
                    <ExportSvgButton generateSvgDataUrl={() => diagram.exportAsDataUrl()}/>
                    {customizationButtonSaveAsText}
                    <Button
                        onClick={() => props.onSave()}
                        size="large"
                        style={{ display: 'block', marginTop: '1em' }}
                    >
                        <Trans>save</Trans>
                    </Button>
                </div>
            </Col>
            <Col span={3}/>
        </Row>
    );
}