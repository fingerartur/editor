import { ErrorCodes } from './ErrorCodes';

export interface IError {
    code: ErrorCodes;
    message: string;
}