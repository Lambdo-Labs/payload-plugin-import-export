import React, { useEffect, useState } from 'react';
import { Button, Gutter } from 'payload/components/elements';
import { Row } from './Rows';
import { validRequiredField } from './utils/ValidRequiredFields';
import { useLocale } from 'payload/components/utilities';
import { useTranslation } from 'react-i18next';
import { FieldSupport, SimpleFields, TypeSelectFields, TypeSelectFieldsProperty } from './utils/type';
interface SelectColumnsProps {
  fields: FieldSupport[];
  csvColumns: string[];
  setPreferencesColumns: Function;
  showSave: boolean;
  setShowSave: Function;
  closeModal: Function;
}
export const SelectColumn = ({
  fields,
  csvColumns,
  showSave,
  setShowSave,
  setPreferencesColumns,
  closeModal,
}: SelectColumnsProps) => {
  const locale = useLocale();
  const [selectedFields, _setSelectedFields] = useState<{
    [key: string]: {
      property: string| null;
      required: boolean;
      type: string;
      label: string;
    };
  }>({}); 

  useEffect(() => {
    if (fields.length > 0) {
      const objetcFields = fields.reduce((acum, field) => {
        const label =  field.label && field.label[locale.code as keyof typeof field.label] ?  field.label[locale.code as keyof typeof field.label] : field.label
        if(label){
        acum[field.name] = {
          property: null,
          type: field.type,
          required: field.type !== 'group' ? !!field.required : false,
          label: label.toString() 
        };
      }
        return acum;
      }, {} as { [key: string]: { property: string | null; required: boolean; type: string; label: string } });
      _setSelectedFields(objetcFields);
    }
  }, [fields]);
  useEffect(() => {
    const show = validRequiredField(selectedFields);
    console.log(selectedFields)
    setShowSave(show);
  }, [selectedFields]);

  const selectedFieldsOptions = (nameKey: string, value: any) => {
    _setSelectedFields({
      ...selectedFields,
      [nameKey]: {
        property: value,
        type: selectedFields[nameKey].type,
        required: selectedFields[nameKey].required,
        label: ''
      },
    });
  };
 


  const onSave = () => {
    setPreferencesColumns(selectedFields);
  };
  const { t } = useTranslation('import_products');
  return (
    <div>
      <Gutter>
        {Object.keys(selectedFields).length > 0 &&
          fields.map((field, index) => {
            return (
              <div>
                <Row
                  csvColumns={csvColumns}
                  field={field}
                  key={index}
                  setSelecteOption={selectedFieldsOptions}
                ></Row>
              </div>
            );
          })}
      </Gutter>
      <div className="doc-controls__controls template-minimal template-minimal--width-norma">
        {showSave ? <Button onClick={onSave}>{t('actions.next')}</Button> : ''}
        <br />
        <Button
          onClick={() => closeModal()}
          buttonStyle="secondary"
          className={
            'btn preview-btn btn--style-secondary btn--icon-style-without-border btn--size-small btn--icon-position-right'
          }
        >
          {t('actions.cancel')}
        </Button>
      </div>
    </div>
  );
};
