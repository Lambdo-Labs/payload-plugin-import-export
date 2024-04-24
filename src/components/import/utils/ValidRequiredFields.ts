import { TypeSelectFields } from './type';

export const validRequiredField = (
  objectSelecteFields: TypeSelectFields
): boolean => {
  let isValid: boolean = true;
  for (let key of Object.keys(objectSelecteFields)) {
    if (
      objectSelecteFields[key].type === 'array' ||
      objectSelecteFields[key].type === 'group'
    ) {
      if (objectSelecteFields[key].property) {
        isValid =
          validRequiredField(
            objectSelecteFields[key].property as TypeSelectFields
          ) && isValid;
      }
    } else {
      if (objectSelecteFields[key].required) {
        isValid =
          objectSelecteFields[key].property !== null &&
          objectSelecteFields[key].required &&
          isValid;
      }
    }
  }
  return isValid;
};
