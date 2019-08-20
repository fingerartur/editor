import { IRule } from 'rule/IRule';
import { generateRule, generateFullRule } from '_testing/generateRule';
import { declarations } from './declarations';
let realExample = require('./savedRule.json');

export const rules: IRule[] = [
    realExample,
    {
        id: 2,
        name: 'rule with 100 elements',
        description: 'This rule contains 100 elements',
        rule: generateRule(100).serialize(),
        declarations: declarations.serialize()
    },
    {
        id: 3,
        name: 'rule with 1000 elements',
        description: 'This rule contains 1000 elements',
        rule: generateRule(1000).serialize(),
        declarations: declarations.serialize()
    },
    {
        id: 4,
        name: 'rule with 3000 elements',
        description: 'This rule contains 3000 elements',
        rule: generateRule(3000).serialize(),
        declarations: declarations.serialize()
    },
    {
        id: 5,
        name: 'pathological rule',
        description: 'A pyramid shaped rule that can fill the whole screen with elements',
        rule: generateFullRule(10).serialize(),
        declarations: declarations.serialize()
    }
];