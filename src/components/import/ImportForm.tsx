import { Button, Gutter } from "payload/components/elements";
import { useConfig } from "payload/components/utilities";
import React, { useEffect, useState } from "react";
import csvtojson from "csvtojson";
import { Dropzone } from "../dropzone";

import { useTranslation } from "react-i18next";
import { useSlug } from "../../utils/useSlug";
import { SelectColumn } from "./SelectColumns";
import { getExternalFieldToImport, getValueFields } from "./utils/ExtractFields";
import { ShowTable } from "./ShowTable";
import { SaveDocuments } from "./Save";
import { FieldSupport, ObjectFormat, TypeSelectFields } from "./utils/type";
import { ArticleIcon } from "./Graphics/FileIcon";

const readFileAsText = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};
interface ImportProps {
  closeModal: Function;
}

export const CSVtoJSON = (data: any, delimiter = ";") => {
  // Changed the delimiter to ';'
  const csvData = data.toString("utf8"); // Transform the buffer data to UTF-8 text.
  return csvtojson({ delimiter }).fromString(csvData);
};
export const ImportForm = ({ closeModal }: ImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [csv, setCsv] = useState<any[]>([]);
  const [csvColumns, setCsvColumns] = useState<Array<string>>([]);
  const [fields, setFields] = useState<any>([]);
  const [labels, setLabels] = useState<FieldSupport[]>([]);
  const [showSave, setShowSave] = useState<boolean>(false);
  const [selectedFields, _setSelectedFields] = useState<{ [key: string]: string }[]>([]);

  const [steps, setStep] = useState<1 | 2 | 3>(1);
  const [objectFormat, setObjectFormat] = useState<ObjectFormat[]>([]);
  const config = useConfig();
  const slug = useSlug();
  const baseClass = "file-field";

  //Get Columns
  useEffect(() => {
    if (csv.length > 0) {
      const keys = Object.keys(csv[0]);
      setCsvColumns(keys);
    }
  }, [csv]);

  useEffect(() => {
    const collection = config.collections.find((collection) => collection.slug === slug);
    if (!collection) {
      console.error("collection undefined");
    } else {
      const fields = getExternalFieldToImport(collection);
      const labelsFormat: FieldSupport[] = [];
      fields.forEach((field: FieldSupport) => {
        if (field.type !== "group" && field.type !== "array") {
          labelsFormat.push(field);
        }
      });
      setLabels(labelsFormat);
      setFields(fields);
    }
  }, []);

  useEffect(() => {}, [selectedFields]);
  const handleFileSelection = React.useCallback(
    async (files: FileList) => {
      const fileToUpload = files?.[0];
      const strtJson = await readFileAsText(fileToUpload);
      const dataColumn = await CSVtoJSON(strtJson, ",");
      setCsv(dataColumn);
      setFile(fileToUpload);
    },
    [setFile],
  );

  const handleFileRemoval = React.useCallback(() => {
    setFile(null);
    setCsvColumns([]);
  }, [setFile]);

  const setOptionColumns = (selectFieldsToColumns: TypeSelectFields) => {
    const valuesObjectArray = csv.map((row) => {
      const valuesObject = getValueFields(row, selectFieldsToColumns);
      return valuesObject;
    });
    setObjectFormat(valuesObjectArray);
    setStep(2);
  };
  const save = (csvFormat: ObjectFormat[]) => {
    setObjectFormat(csvFormat);
    setStep(3);
  };

  const { t } = useTranslation("import_products");
  return (
    <>
      <Gutter>
        <h1>{t("labels.import")}</h1>
        <div>
          <Gutter>
            <div className="field-type file-field">
              <div className="file-field__upload">
                {!file && (
                  <Dropzone
                    onChange={handleFileSelection}
                    mimeTypes={["text/csv"]}
                    className="file-field"
                  ></Dropzone>
                )}

                {file && (
                  <React.Fragment>
                    <div className="">
                      <div className={`${baseClass}__thumbnail-wrap`}>
                        <ArticleIcon></ArticleIcon>
                      </div>
                    </div>
                    <div className={`${baseClass}__file-adjustments`}>
                      <input
                        className={`${baseClass}__filename`}
                        disabled
                        type="text"
                        value={file.name}
                      />
                    </div>
                    <Button
                      buttonStyle="icon-label"
                      className={`${baseClass}__remove`}
                      icon="x"
                      iconStyle="with-border"
                      onClick={handleFileRemoval}
                      round
                    />
                  </React.Fragment>
                )}
              </div>
            </div>
          </Gutter>
        </div>
        <div className="collection-list">
          {steps === 1 && csvColumns.length > 0 ? (
            <SelectColumn
              fields={fields}
              setShowSave={setShowSave}
              key={"test"}
              csvColumns={csvColumns}
              setPreferencesColumns={setOptionColumns}
              showSave={showSave}
              closeModal={closeModal}
            ></SelectColumn>
          ) : (
            ""
          )}
        </div>
        <div className="collection-list">
          {steps === 2 ? (
            <ShowTable
              fields={labels}
              csvObject={objectFormat}
              closeModal={closeModal}
              save={save}
            ></ShowTable>
          ) : (
            ""
          )}
        </div>
        <div className="collection-list">
          {steps == 3 && (
            <SaveDocuments
              csvData={objectFormat}
              slug={slug}
              closeModal={closeModal}
            ></SaveDocuments>
          )}
        </div>
      </Gutter>
    </>
  );
};
