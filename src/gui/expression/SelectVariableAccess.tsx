import * as React from 'react';
import { TreeSelect } from 'antd';
import { IType } from 'rule/types/IType';
import { TypeDefinitionMap } from 'rule/types/TypeDefinitionMap';
import { Types } from 'rule/types/Types';
import { styleType } from './consts';
import { Declaration } from 'rule/declarations/Declaration';
import { VariableAccess } from 'rule/expression/VariableAccess';
const TreeNode = TreeSelect.TreeNode;

interface IProps {
    typeDefinitions: TypeDefinitionMap;
    visibleDeclarations: Declaration[];
    onSelect: Function;
}
interface IState {}

class SelectVariableAccess extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    normalizeValue = (value: string) => {
        return value.replace(/^.*\./, '').trim().toLowerCase();
    }

    renderNodes = (
        attributeName: string,
        type: IType,
        typeDefinitions: TypeDefinitionMap,
        key: string
    ): any => {
        let attributes = typeDefinitions.get(type.name).attributes;
        const title = <>{attributeName + ': '}<span style={styleType}>{Types.toString(type)}</span></>;
        if (attributes) {
            return(
                <TreeNode value={key} title={title} key={key}>
                    {
                        attributes.map((attribute, idx) =>
                            this.renderNodes(
                                attribute.name,
                                {name: attribute.type, isMultiValued: attribute.isMultiValued},
                                typeDefinitions,
                                key + '.' + attribute.name
                            )
                        )
                    }
                </TreeNode>
            );    
        } else {
            return (
                <TreeNode value={key} title={title} key={key}/>
            );
        }
    }

    render() {
        const variables = this.props.visibleDeclarations;
        return (
            <TreeSelect
                showSearch={true}
                dropdownMatchSelectWidth={false}
                style={{ width: 110, marginRight: 5 }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="Variable"
                filterTreeNode={
                    (inputValue, treeNode) => {
                        inputValue = this.normalizeValue(inputValue);
                        const treeValue = this.normalizeValue(treeNode.props.value);
                        return treeValue.startsWith(inputValue);
                    }
                }
                onSelect={(value) => {
                    const variableAccess = VariableAccess.from(value, 
                        this.props.visibleDeclarations, this.props.typeDefinitions);
                    this.props.onSelect(new VariableAccess(variableAccess));
                }}
            >
            {
                variables.map(variable =>
                    this.renderNodes(variable.name, variable.type, this.props.typeDefinitions, variable.id + ''))
            }
            </TreeSelect>
        );
    }
}

export default SelectVariableAccess;