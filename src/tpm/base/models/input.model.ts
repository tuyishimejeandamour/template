export interface InputTypeText{
    name: string;
    type: string;
    message: string;
    validate?: (value: string) => boolean | string;
    default?:string;
}

