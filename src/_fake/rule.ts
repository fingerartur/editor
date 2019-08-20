// import { Rule } from 'rule/Rule';
// import { IAssignment } from 'rule/vars/IAssignment';
// import { Assign } from 'rule/elements/Assign';

// function createSerializedAssignment(id: number, name: string): IAssignment {
//     return {
//         variable: {
//             id,
//             name,
//             type: { name: 'any', isMultiValued: true }
//         },
//         expression: null
//     };
// }

// function createRule(): any {
//     const masterRule = new Rule();
//     const declarations = masterRule.declarations;
//     declarations.create('x', { name: 'int' });
//     declarations.create('y', { name: 'int' });
//     declarations.create('z', { name: 'string' });
//     declarations.create('w', { name: 'string' });
//     declarations.create('x', { name: 'float' });

//     const assxy = new Assign({
//         assignments: [
//             createSerializedAssignment(1, 'x'),
//             createSerializedAssignment(2, 'y')
//         ]
//     });
//     masterRule.insertAfter(masterRule.rule.getFirst(), assxy);
    
//     const assz = new Assign({
//         assignments: [
//             createSerializedAssignment(3, 'z')
//         ]
//     });
//     masterRule.insertAfter(assxy, assz);

//     const assw = new Assign({
//         assignments: [
//             createSerializedAssignment(4, 'w')
//         ]
//     });
//     masterRule.insertAfter(assz, assw);

//     // masterRule.insertAfter(assw, fakeAssign);
//     /*
//         start
//         x,y
//         z
//         w
//         zoom
//         end
//     */
//     return {
//         masterRule,
//         xy: assxy,
//         w: assw,
//         z: assz
//     };
// }
// export const fakeMasterRule = createRule().masterRule;