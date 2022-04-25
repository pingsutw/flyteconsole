import { Core } from 'flyteidl';
import { InputValue } from '../types';
import { structuredDatasetUriPath } from './constants';
import { ConverterInput, InputHelper, InputValidatorParams } from './types';
import { extractLiteralWithCheck } from './utils';

function fromLiteral(literal: Core.ILiteral): InputValue {
    return extractLiteralWithCheck<string>(literal, structuredDatasetUriPath);
}

function toLiteral({ typeDefinition, value }: ConverterInput): Core.ILiteral {
    const uri = typeof value === 'string' ? value : value.toString();
    // const {
    //     literalType: { structuredDatasetType: type },
    // } = typeDefinition;
    // const structuredDatasetMetadata = { StructuredDatasetMetadata: { StructuredDatasetType: type } }
    return { scalar: { structuredDataset: { uri} } };
}

function validate({ value }: InputValidatorParams) {
    if (typeof value !== 'string') {
        throw new Error('Value is not a string');
    }
}

export const structuredDatasetHelper: InputHelper = {
    fromLiteral,
    toLiteral,
    validate,
};
