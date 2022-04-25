import {StructuredDataset, StructuredDatasetMetadata} from 'models/Common/types';
import {flyteidl} from "@flyteorg/flyteidl/gen/pb-js/flyteidl";
import SimpleType = flyteidl.core.SimpleType;

const structuredDatasetMetadata: StructuredDatasetMetadata = {
  structuredDatasetType: {
    columns: [],
  },
}

const structuredDatasetWithNoColumns: StructuredDataset = {
  uri: 's3://path/to/my/schema_with_no_columns',
  metadata: structuredDatasetMetadata,
};

const structuredDatasetWithColumns: StructuredDataset = {
  uri: 's3://path/to/my/schema_with_no_columns',
  metadata: {
    structuredDatasetType: {
      columns: [
        { name: 'booleanColumn', type: {simple: SimpleType.BOOLEAN}},
        { name: 'datetimeColumn', type: {simple: SimpleType.DATETIME}},
        { name: 'durationColumn', type: {simple: SimpleType.DURATION}},
        { name: 'floatColumn', type: {simple: SimpleType.FLOAT}},
        { name: 'stringColumn', type: {simple: SimpleType.STRING}},
        { name: 'integerColumn', type: {simple: SimpleType.INTEGER}},
      ],
    },
  }
};

export const structuredDatasetValues = { structuredDatasetWithColumns, structuredDatasetWithNoColumns };
