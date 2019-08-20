import * as React from 'react';
import { shallow, mount, ShallowWrapper } from 'enzyme';
import { Diagram } from './Diagram';
import { i18nProps } from '../../testUtils';
import { Customization } from '../../customizations/Customization';
import { Customizations } from '../../customizations/Customizations';

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

xdescribe('Diagram', () => {
    let component: any;
    beforeEach(() => {
        const rule = fakeMasterRule;
        const customizations = new Customizations(new Map<Customization, any>());
        component = mount(<Diagram
            {...i18nProps}
            rule={rule}
            onMount={() => {}}
            typeConverter={null}
            typeDefinitions={null}
            operations={null}
            style={{ width: 100, height: 100, margin: '10' }}
            customizations={customizations}
        />);
    });

    it('renders without crashing', () => {});
});