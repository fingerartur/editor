import * as React from 'react';
import * as PropTypes from 'prop-types';
import { shallow, mount, ReactWrapper } from 'enzyme';
import DescriptionInput from './DescriptionInput';
import { Assign } from '../../rule/elements/Assign';
import { Element } from '../../rule/elements/Element';
import { Input } from 'antd';

describe('DescriptionInput component', () => {
    let element: Element;
    let component: ReactWrapper;
    beforeEach(() => {
        element = new Assign(null);
        const context = {
            t: (key: string) => key,
            i18n: {}
        }
        const childContextTypes = {
            t: PropTypes.func,
            i18n: PropTypes.object
        };
        component = mount(<DescriptionInput element={element}/>, { context, childContextTypes });
    });

    it('renders without crashing', () => {});

    it('shows the description', () => {
        expect(component.find('Trans').text()).toBe('description');
    });

    it('allows editing of element.text', () => {
        const input = component.find(Input);
        input.simulate("change", { target: { value: "New" }});
        expect(element.text).toBe('New');
    });
});