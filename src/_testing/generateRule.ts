import { If } from 'rule/elements/If';
import { Assign } from 'rule/elements/Assign';
import { SubRule } from 'rule/SubRule';
import { Element } from 'rule/elements/Element';

/**
 * Generates a rule with N elements.
 * 1/5N if branches (a long path of true branches)
 * 4/5N assignments (2 for true, 2 for false)
 */
export function generateRule(N: number): SubRule {
    N = Math.ceil(N / 5);

    const rule = new SubRule(null);
    let cursor = rule.getFirst();
    for (let i = 0; i < N; i++) {
        const ifElem = new If(null);
        const a1 = new Assign(null);
        const a2 = new Assign(null);
        // a2.addAssignment(new Assignment('z' + i, VarTypes.STRING, 'hi'));
        // a2.addAssignment(new Assignment('w' + i, VarTypes.INT, '22'));
        ifElem.getBranchTrue().getFirst().insertAfter(a1);
        a1.insertAfter(a2);

        const a3 = new Assign(null);
        const a4 = new Assign(null);
        ifElem.getBranchFalse().getFirst().insertAfter(a3);
        a3.insertAfter(a4);

        cursor.insertAfter(ifElem);
        cursor = ifElem.getBranchTrue().getLast().prev;
    }
    console.log(rule);
    return rule;
}

interface ICursor {
    depth: number;
    cursor: Element;
}

export function generateFullRule(N: number): SubRule {
    const rule = new SubRule(null);
    let cursors: ICursor[] = [];
    cursors.push({ depth: 0, cursor: rule.getFirst() });
    while (cursors.length > 0) {
        const cursor = cursors.pop();
        if (cursor.depth < N) {
            const ifElem = new If(null);
            cursor.cursor.insertAfter(ifElem);
            const a1 = new Assign(null);
            ifElem.getBranchTrue().getFirst().insertAfter(a1);
            const a2 = new Assign(null);
            ifElem.getBranchFalse().getFirst().insertAfter(a2);
            cursors.push({ depth: cursor.depth + 1, cursor: a1});
            cursors.push({ depth: cursor.depth + 1, cursor: a2});
        } else if (cursor.depth < 2 * N) {
            const a1 = new Assign(null);
            cursor.cursor.insertAfter(a1);
            cursors.push({ depth: cursor.depth + 1, cursor: a1});
        }
    }
    return rule;
}