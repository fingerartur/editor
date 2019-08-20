import * as React from 'react';
import { shallow, mount, ShallowWrapper, ReactWrapper } from 'enzyme';
import Button from './Button';
import { Button as AntdButton } from 'antd';

describe('Button', () => {
    let component: ShallowWrapper;
    beforeEach(() => {
        component = shallow(<Button/>);
    });

    it('renders without crashing', () => {});

    it('has a click handler', () => {
        const mockCallback = jest.fn();
        component = shallow(<Button onClick={mockCallback}/>);
        component.find(AntdButton).simulate("click");
        expect(mockCallback).toHaveBeenCalledTimes(1);
    });

    it('sets size correctly', () => {
        expect(component.find(AntdButton).prop("size")).toBe("default");
        component.setProps({ size: "small" });
        expect(component.find(AntdButton).prop("size")).toBe("small");
    });

    it('sets loading correctly', () => {
        expect(component.find(AntdButton).prop("loading")).toBe(false);
        component.setProps({ loading: true });
        expect(component.find(AntdButton).prop("loading")).toBe(true);
    });

    it('instantiates any children', () => {
        const fullComponent = mount(<Button><h1>Hello</h1></Button>);
        const h1 = fullComponent.find(AntdButton).find("h1");
        expect(h1.exists()).toBeTruthy();
        expect(h1.text()).toBe("Hello");
    });

    it('sets a title', () => {
        const title = shallow(<Button title="My title"/>).find("span").prop("title");
        expect(title).toBe("My title");
    });
});