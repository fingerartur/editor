import * as React from 'react';
import { shallow, mount, ShallowWrapper } from 'enzyme';
import { Modal } from './Modal';
import { Key } from 'ts-keycode-enum';
import { i18nProps } from '../../testUtils';
import { Modal as AntdModal } from 'antd';

describe('Modal', () => {
    let component: ShallowWrapper;
    beforeEach(() => {
        component = shallow(
            <Modal {...i18nProps}
                onBeforeSave={() => null}
                onBeforeCancel={() => null}
            />
        );
    });

    it('renders without crashing', () => {
    });

    it('opens automatically', () => {
        expect(component.find(AntdModal).prop("visible")).toBeTruthy();
    });

    it('closes on Enter key', () => {
        component.simulate("keydown", { keyCode: Key.Enter });
        expect(component.find(AntdModal).prop("visible")).toBeFalsy();
    });

    it('closes on OK', () => {
        component.find(AntdModal).simulate("ok");
        component.update();
        expect(component.find(AntdModal).prop("visible")).toBeFalsy();
    });

    it('closes on Cancel', () => {
        component.find(AntdModal).prop("onCancel")(null);
        component.update();
        expect(component.find(AntdModal).prop("visible")).toBeFalsy();
    });

    it('does not close if onBeforeClose() validator returns an error message', () => {
        component = shallow(<Modal {...i18nProps} onBeforeSave={() => "An error occured"} onBeforeCancel={() => null}/>);
        component.find(AntdModal).simulate("ok");
        component.update();
        expect(component.find(AntdModal).prop("visible")).toBeTruthy();
    });
});