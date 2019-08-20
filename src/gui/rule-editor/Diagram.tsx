import * as React from 'react';
import { Diagram as DiagramLogic } from 'diagram/Diagram';
import { Rule } from 'rule/Rule';
import { Element } from 'rule/elements/Element';
import { translate } from 'react-i18next';
import { Customizations } from 'customizations/Customizations';
import { Customization } from 'customizations/Customization';
import { IElementPopupInfo } from 'enhancers/wraps/IElementPopupInfo';
import { ILoadables } from 'client/ILoadables';
import { IScope } from 'rule/IScope';

interface IProps {
    // i18n: any;
    t?: Function;
    rule: Rule;
    onMount: (diagram: DiagramLogic) => void;
    loadables: ILoadables;
    style: { width: number, height: number, margin: string };
    customizations: Customizations;
}
interface IState {
    element: Element;
    scope: IScope;
}

export class Diagram extends React.Component<IProps, IState> {
    private svgRef: SVGElement;
    private diagram: DiagramLogic;

    constructor(props: any) {
        super(props);
        this.state = {
            element: null,
            scope: null
        };
    }

    componentDidMount() {
        this.createDiagram();
        this.props.onMount(this.diagram);
    }

    createDiagram = () => {
        this.diagram = new DiagramLogic(this.svgRef, this.props.rule, this.props.t);
        const enableInfo = this.props.customizations.get(Customization.FUNCTIONALITY_DIAGRAM_ENABLE_INFO, true);
        this.diagram.enableInfo(enableInfo);
        this.diagram.onEdit = this.openModal;
        this.diagram.onCreate = this.openModal;
        this.diagram.render();
    }
    
    openModal = (element: Element) => {
        const scope = this.props.rule.getScopeOf(element);
        this.setState({ element, scope });
    }

    closeModal = () => {
        this.setState({ element: null, scope: null });
        this.diagram.focus();
        this.diagram.render();
    }

    undoNewElement = () => {
        this.diagram.cancelNewlyCreatedElement();
        this.closeModal();
    }

    render() {
        const width = this.props.style.width;
        const height = this.props.style.height;
        const config: IElementPopupInfo = {
            scope: this.state.scope,
            loadables: this.props.loadables,
            declarations: this.props.rule.declarations,
            onClose: this.closeModal,
            onRemove: this.undoNewElement
        };
        return (
            <div
                style={this.props.style}
            >
                <svg
                    className="e2e-diagram-svg"
                    style={{ width, height, userSelect: 'none', border: '4px solid rgb(128, 159, 255, 0.15)', borderRadius: 3 }}
                    ref={ref => this.svgRef = ref}
                />
                {
                    this.state.element ?
                    this.state.element.enhance().renderGuiPopup(config)
                    : null
                }
            </div>   
        );
    }
}

export default translate()(Diagram) as any;