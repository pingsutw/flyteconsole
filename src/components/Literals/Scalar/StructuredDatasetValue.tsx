import {LiteralType, SimpleType, StructuredDatasetColumn, StructuredDataset} from 'models/Common/types';

import * as React from 'react';
import { PrintList } from '../PrintList';
import { PrintValue } from '../PrintValue';
import { useLiteralStyles } from '../styles';
import { ValueLabel } from '../ValueLabel';

function scalarTypeToString(type: SimpleType) {
    switch (type) {
        case SimpleType.BOOLEAN:
            return 'boolean';
        case SimpleType.DATETIME:
            return 'datetime';
        case SimpleType.DURATION:
            return 'duration';
        case SimpleType.FLOAT:
            return 'float';
        case SimpleType.INTEGER:
            return 'integer';
        case SimpleType.STRING:
            return 'string';
        default:
            return 'unknown';
    }
}

function columnTypeToString(type: LiteralType) {
    if (type.simple) {
        return scalarTypeToString(type.simple)
    } else if (type.mapValueType) {
        return "map"
    } else if (type.collectionType) {
        return "list"
    } else {
        return "unknown"
    }
}

function getColumnKey(value: any) {
    return (value as StructuredDatasetColumn).name;
}

function renderStructuredDatasetColumn(value: any, index: number) {
    const { name, type } = value as StructuredDatasetColumn;
    return <PrintValue label={index} value={`${name} (${columnTypeToString(type)})`} />;
}

/** Renders a `Schema` definition as an object with a uri and optional list
 * of columns
 */
export const StructuredDatasetValue: React.FC<{ structuredDataset: StructuredDataset }> = ({ structuredDataset }) => {
    const literalStyles = useLiteralStyles();
    let columns;
    if (structuredDataset.metadata.structuredDatasetType.columns.length > 0) {
        columns = (
            <>
                <ValueLabel label="columns" />
                <PrintList
                    values={structuredDataset.metadata.structuredDatasetType.columns}
                    getKeyForItem={getColumnKey}
                    renderValue={renderStructuredDatasetColumn}
                />
            </>
        );
    }

    return (
        <div className={literalStyles.nestedContainer}>
            <PrintValue label="uri" value={structuredDataset.uri} />
            {columns}
        </div>
    );
};
