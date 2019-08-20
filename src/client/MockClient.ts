import { Client } from './Client';
import { typeDefinitions } from './mockData/typeDefinitions';
import { ITypeDefinition } from 'rule/types/ITypeDefinition';
import { operationGroups } from './mockData/operations';
import { ITypeConversion } from 'rule/types/ITypeConversion';
import { IRuleInfo } from 'rule/IRuleInfo';
import { IRule } from 'rule/IRule';
import { Rule } from 'rule/Rule';
import { rules as serializedRules } from './mockData/rules';
import { IOperationGroup } from 'rule/expression/IOperationGroup';
import { HardwiredTypes } from 'rule/types/HardwiredTypes';

/**
 * Uses local storage to save rules instead of sending them to the server component.
 * Used local storage keys:
 *      rule-[id]
 *      rule-info
 */
export class MockClient extends Client {

    loadTypeDefinitions(): Promise<ITypeDefinition[]> {
        return Promise.resolve(typeDefinitions);
    }

    loadTypeConversions(): Promise<ITypeConversion[]> {
        const conversions = [
            { from: HardwiredTypes.BOOL, to: HardwiredTypes.INT },
            { from: HardwiredTypes.INT, to: HardwiredTypes.FLOAT },
            { from: HardwiredTypes.FLOAT, to: 'number' },
            { from: 'number', to: HardwiredTypes.STRING }
        ];
        return Promise.resolve(conversions);
    }

    loadOperations(): Promise<IOperationGroup[]> {
        return Promise.resolve(operationGroups);
    }

    loadRule(id: number): Promise<IRule> {
        const textSerialization = localStorage.getItem('rule-' + id);
        if (!textSerialization) {
            throw new Error('bug: unable to load existing rule');
        }
        const serialization = JSON.parse(textSerialization);
        return Promise.resolve(serialization);
    }

    async saveRule(rule: Rule): Promise<void> {
        const ruleText = JSON.stringify(rule.serialize());
        localStorage.setItem('rule-' + rule.id, ruleText);
        let infos = await this.loadRuleInfos();
        const ruleInfo = infos.find(info => info.id === rule.id);
        if (ruleInfo) {
            ruleInfo.name = rule.name;
            ruleInfo.description = rule.description;
        } else {
            infos.push(rule.getInfo());
        }
        this.saveInfos(infos);
        return Promise.resolve();
    }

    loadRuleInfos(): Promise<IRuleInfo[]> {
        let infosText = localStorage.getItem('rule-info');
        if (!infosText) {
            this.generateExampleRules();
            infosText = localStorage.getItem('rule-info');
        }
        const infos = JSON.parse(infosText);
        return Promise.resolve(infos);
    }
    
    private saveInfos(infos: IRuleInfo[]): void {
        localStorage.setItem('rule-info', JSON.stringify(infos));
    }

    private generateExampleRules(): void {
        const rules = serializedRules.map(serializedRule => new Rule(serializedRule));
        rules.forEach(rule => {
            const ruleText = JSON.stringify(rule.serialize());
            localStorage.setItem('rule-' + rule.id, ruleText);
        });
        this.saveInfos(rules.map(rule => rule.getInfo()));
    }
}