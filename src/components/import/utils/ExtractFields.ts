import { ArrayField, GroupField, SanitizedCollectionConfig } from 'payload/types';
import { RowFormat, TypeSelectFields } from './type';

export const getFields = (
  object: any,
  fieldsResult: any[] = [],
  omitsNamesColumns = ['createdAt', 'updatedAt', '_status'],
  omitsTypeColumns = ['blocks', 'upload', 'relationship']
) => {
  for (let key of Object.keys(object)) {
    if (key === 'fields') {
      for (let field of object[key]) {
        if (
          omitsNamesColumns.includes(field.name) ||
          omitsTypeColumns.includes(field.type)
        )
          continue;
        if (field.type !== 'ui') {
          if (field.type !== 'tabs' && field.type !== 'row') {
            fieldsResult.push(field);
          } else {
            getFields(field, fieldsResult);
          }
        }
      }
    }
  }
  return fieldsResult;
};

export const getExternalFieldToImport = (collection: SanitizedCollectionConfig| GroupField | ArrayField) => {
  const fields = getFields(collection);
  return fields;
};

export const getValueFields = (
  csvRow: RowFormat,
  objectFields: TypeSelectFields
): { [key: string]: any } => {
  const fieldsObject: { [key: string]: any } = {};
  for (let key of Object.keys(objectFields)) {
    if (objectFields[key].property !== null) {
      if (objectFields[key].type === 'group') {
        fieldsObject[key] = getValueFields(
          csvRow,
          objectFields[key].property as TypeSelectFields
        );
      } else if (objectFields[key].type === 'array') {
        fieldsObject[key] = [
          getValueFields(
            csvRow,
            objectFields[key].property as TypeSelectFields
          ),
        ];
      } else {
        if (typeof objectFields[key].property === 'string') {
          fieldsObject[key] = csvRow[objectFields[key].property as string];
        }
      }
    }
  }
  return fieldsObject;
};
