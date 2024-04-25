import {
  ArrayField,
  EmailField,
  Field,
  GroupField,
  NumberField,
  RelationshipField,
  TextField,
  TextareaField,
} from 'payload/types';
import { Button, Collapsible, Gutter } from 'payload/components/elements';
import React, { useEffect, useState } from 'react';
import { getExternalFieldToImport } from './utils/ExtractFields';
import ReactSelect from 'payload/dist/admin/components/elements/ReactSelect';
import { useLocale } from 'payload/components/utilities';
import Plus from 'payload/dist/admin/components/icons/Plus';
import { Option } from '../multiSelect';

interface RowsProps {
  field:
    | RelationshipField
    | ArrayField
    | NumberField
    | TextField
    | TextareaField
    | EmailField
    | GroupField;
  csvColumns: string[];
  setSelecteOption: Function;
}

export const Row = ({ field, csvColumns, setSelecteOption }: RowsProps) => {
  const [isRequired, setRequired] = useState<boolean>(false);
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [value, setValue] = useState<Option | null >(null);
  const [fields, setFields] = useState<any[]>([]);
  const [selectedFields, _setSelectedFields] = useState<{
    [key: string]: { property: string | null; required: boolean; type: string };
  }>({});
  const locale = useLocale();
  const supportFields: Field['type'][] = [
    'array',
    'number',
    'text',
    'textarea',
    'relationship',
    'email',
    'group',
  ];

  const baseClass = 'file-field';
  useEffect(() => {
    if (!supportFields.includes(field.type)) return;
    if (field.type === 'group') {
      const fieldsGroup = getExternalFieldToImport(field);
      const containFieldsRequired = fieldsGroup.reduce((item) => item.required);
      if (containFieldsRequired) {
        setRequired(true);
      }
    } else if ('required' in field) {
      setRequired(!!field.required);
      if (field.required) {
      }
    }
  }, [field]);
  useEffect(() => {
    if (supportFields.includes(field.type))
      if (field.type === 'array' || field.type === 'group') {
        const fields = getExternalFieldToImport(field);
        setFields(fields);
        const objetcFields = fields.reduce((acum, field) => {
          acum[field.name] = {
            property: null,
            type: field.type,
            required: field.type !== 'group' ? field.required : false,
          };
          return acum;
        }, {} as { [key: string]: { property: string; required: boolean; type: string } });
        _setSelectedFields(objetcFields);
      }
  }, [field]);
  useEffect(() => {
    if (supportFields.includes(field.type)) {
      if (
        field.type !== 'array' &&
        field.type !== 'group' &&
        field.type !== 'relationship' &&
        csvColumns.length > 0
      ) {
        const options = csvColumns.map((item) => {
          return {
            value: item,
            label: item,
          };
        });
        setOptions(options);
        const existOption = options.find(
          (item) => item.value.toLowerCase() === field.name.toLowerCase()
        );
        if (existOption) {
          setValue(existOption);
          setOption(field.name, existOption.value);
        }
      }
    }
  }, [csvColumns]);

  const selectOption = (nameField: string, event: {label: string, value: string} | null) => {
    if (event) {
      setValue(event);
      setOption(nameField, event.value);
    } else {
      setValue(null);
      setOption(nameField, null);
    }
  };
  const setOption = (nameField: string, value: string |  null) => {
    if (field.type === 'array' || field.type === 'group') {
      const valuesSelectedField = {
        ...selectedFields,
        [nameField]: {
          property: value,
          required: selectedFields[nameField].required,
          type: selectedFields[nameField].type,
        },
      };
      _setSelectedFields(valuesSelectedField);
      setSelecteOption(field.name, valuesSelectedField);
    } else {
      setSelecteOption(nameField, value);
    }
  };
  const getLabel = () => {
    const label =  field.label && field.label[locale.code as keyof typeof field.label] ? field.label[locale.code as keyof typeof field.label] : field.label
    if (isRequired) return `${label?.toString()} *`
    else return label?.toString();
  };
  const showSelect = (value: boolean) => {
    setRequired(value);
  };

  return (
    <>
      <div>
        {fields.length <= 0 ? (
          <React.Fragment>
            <div>
              <strong>{getLabel()}</strong>
            </div>
            {
              <ReactSelect
                options={options}
                blurInputOnSelect={true}
                onChange={(event) => selectOption(field.name, event)}
                value={value ? value : undefined }
              />
            }
            <br />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="collection-list__wrap">
              <div className="collection-list__header">
                <h3>{getLabel()}</h3>
                <div className="">
                  {!isRequired ? (
                    <Button
                      className="relationship-add-new__add-button"
                      onClick={() => showSelect(true)}
                    >
                      <Plus></Plus>
                    </Button>
                  ) : (
                    ''
                  )}
                  {isRequired ? (
                    <Button
                      buttonStyle="icon-label"
                      className={`${baseClass}__remove`}
                      icon="x"
                      iconStyle="with-border"
                      onClick={() => showSelect(false)}
                      round
                    />
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <Gutter>
                {isRequired ? (
                  <div className="iterable-diff__wrap ">
                    {fields.map((item, index) => {
                      return (
                        <Row
                          csvColumns={csvColumns}
                          field={item}
                          key={index}
                          setSelecteOption={setOption}
                        ></Row>
                      );
                    })}
                  </div>
                ) : (
                  ''
                )}
              </Gutter>
            </div>
          </React.Fragment>
        )}
      </div>
    </>
  );
};
