import { Customization } from '../Customization';
import ExportTextButton from './gui/rule-editor/ExportTextButton';
import { layoutRuleEditor } from './gui/rule-editor/layoutRuleEditor';

export const config = new Map<Customization, any>();
config.set(Customization.COMPONENT_BUTTON_EXPORT_RULE_AS_TEXT, ExportTextButton);
config.set(Customization.LAYOUT_RULE_EDITOR, layoutRuleEditor);
config.set(Customization.FUNCTIONALITY_DIAGRAM_ENABLE_INFO, false);
