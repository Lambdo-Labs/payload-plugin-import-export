import React, { useState, useEffect } from "react";
import Table from "payload/dist/admin/components/elements/Table";
import { Button, Gutter } from "payload/components/elements";
import { Column } from "payload/dist/admin/components/elements/Table/types";
import SortColumn from "payload/dist/admin/components/elements/SortColumn/index";
import {
  ArrayField,
  NumberField,
  TextField,
  TextareaField,
  EmailField,
  GroupField,
} from "payload/types";
import { useLocale } from "payload/components/utilities";

import { useTranslation } from "react-i18next";
import { FieldSupport } from "./utils/type";
import { Locale } from "payload/config";
interface ShowTableProps {
  fields: FieldSupport[];
  csvObject: { [key: string]: any }[];
  save: Function;
  closeModal: Function;
}
const TextCell: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <span>{children}</span>
);
const baseClass = "select-row";

export const buildVersionColumns = (
  fields: ShowTableProps["fields"],
  locale: any,
  removeElement: Function,
): Column[] => {
  const labels = fields.map((field) => {
    const label =
      field.label && field.label[locale.code as keyof typeof field.label]
        ? field.label[locale.code as keyof typeof field.label]
        : field.label;
    if (label) {
      return {
        name: "",
        accessor: field.name,
        active: true,
        components: {
          Heading: <SortColumn label={label?.toString()} disable name={field.name}></SortColumn>,
          renderCell: (row: any, data: any) => <TextCell>{data}</TextCell>,
        },
        label: "",
      };
    }
  });
  labels.unshift({
    name: "",
    accessor: "",
    active: true,
    components: {
      Heading: <></>,
      renderCell: (row, data) => (
        <Button
          buttonStyle="icon-label"
          className={`filed+field__remove`}
          icon="x"
          iconStyle="with-border"
          onClick={() => removeElement(row)}
          round
        />
      ),
    },
    label: "",
  });

  return labels as Column[];
};
export const ShowTable = ({ fields, csvObject, save, closeModal }: ShowTableProps) => {
  const locale = useLocale();

  const paths = window.location.pathname.split("/");
  const backToCollection = `${paths.slice(0, paths.length - 1).join("/")}`;
  const [csvObjectFilter, setCsvObjectFilter] = useState<
    {
      [key: string]: any;
    }[]
  >([]);
  useEffect(() => {
    setCsvObjectFilter(csvObject);
  }, [csvObject]);
  const removeElement = (row: any) => {
    const filter = csvObjectFilter.filter((rowCsv) => rowCsv !== row);
    setCsvObjectFilter(filter);
  };
  const { t } = useTranslation("import_products");
  return (
    <>
      <Gutter>
        {csvObjectFilter.length > 0 && (
          <div className="table">
            <Table
              columns={buildVersionColumns(fields, locale, removeElement)}
              data={csvObjectFilter}
            />
          </div>
        )}
        <div>
          <div className="doc-controls__controls template-minimal template-minimal--width-norma">
            <Button onClick={() => save(csvObjectFilter)}>{t("actions.next")}</Button>
            <br />
            <Button
              onClick={() => closeModal()}
              buttonStyle="secondary"
              className={
                "btn preview-btn btn--style-secondary btn--icon-style-without-border btn--size-small btn--icon-position-right"
              }
            >
              {t("actions.cancel")}
            </Button>
          </div>
        </div>
      </Gutter>
    </>
  );
};
