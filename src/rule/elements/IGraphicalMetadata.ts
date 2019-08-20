import { IPoint } from 'diagram/graphics/IPoint';
export interface IGraphicalMetadata {
    isCollapsed: boolean;
    isSelected: boolean;
    shouldBlink: boolean;
    hasSelectedParent?: boolean;
    isVisible: boolean;
    hasInvalidDescendant?: boolean;
    position?: IPoint;
}