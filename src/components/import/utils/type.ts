import {
  ArrayField,
  NumberField,
  TextField,
  TextareaField,
  EmailField,
  GroupField,
} from "payload/types";

export type TypeSelectFields = {
  [key: string]: {
    property: TypeSelectFields | string | null;
    required: boolean;
    type: string;
  };
};
export type TypeSelectFieldsProperty = TypeSelectFields['property'];
export interface BuilderObject {
  [key: string]: string;
}

export type SimpleFields = NumberField | TextField | TextareaField | EmailField;
export type FieldSupport = ArrayField | GroupField | SimpleFields;

export type RowFormat = { [key: string]: string };
export type ObjectFormat = { [key: string]: any };
