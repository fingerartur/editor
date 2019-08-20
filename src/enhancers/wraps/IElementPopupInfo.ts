import { ILoadables } from 'client/ILoadables';
import { IScope } from 'rule/IScope';
import { Declarations } from 'rule/declarations/Declarations';

export interface IElementPopupInfo {
    scope: IScope;
    loadables: ILoadables;
    declarations: Declarations;
    onClose: Function;
    onRemove: Function;
}