export interface IElement {
    what?: 'element';
    elementType?: string;
    text?: string;
    errors?: { code: number, message: string }[];
}