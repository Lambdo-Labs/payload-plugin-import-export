import { Button, Gutter } from "payload/components/elements";
import { useConfig, useLocale } from "payload/components/utilities";

import React, { useState, useEffect } from "react";
import RouterLink from "../link/RouterLink";
import { requests } from "payload/dist/admin/api";
import { toast } from "react-toastify";
import { LoadingOverlay } from "payload/dist/admin/components/elements/Loading";

import { useTranslation } from "react-i18next";
interface SaveProps {
  slug: string;
  csvData: { [key: string]: any }[];
}
export const SaveDocuments = ({ csvData, slug }: SaveProps) => {
  const [success, setSuccess] = useState<string[]>([]);
  const [error, setError] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const paths = window.location.pathname.split("/");
  const locale = useLocale();
  const backToCollection = `${paths.slice(0, paths.length - 1).join("/")}`;
  const {
    localization,
    routes: { api },
    serverURL,
    collections,
  } = useConfig();
  const saveData = async () => {
    setShow(true);
    for (let row of csvData) {
      try {
        const result = await requests.post(
          `${serverURL}${api}/${slug}?locale=${locale}&fallback-locale=none`,
          {
            body: JSON.stringify(row),
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const json = await result.json();
        console.log(json, "Json");
        if (result.status === 201 || result.status === 200) {
          setSuccess([...success, json.doc.id]);
        } else {
          setError([...error, json.error]);
          json.errors.forEach((error: any) => toast.error(error.message));
        }
      } catch (error) {
        console.log(error);
      }
      location.reload();
    }
  };
  const { t } = useTranslation("import_products");
  const getNameCollection = () => {
    const collection = collections.find((item) => item.slug === slug);
    if (!collection) {
      return "";
    }
    if (collection.labels) {
      if (csvData.length <= 1) {
        if (collection.labels.singular) {
          const label =
            collection.labels.singular[locale.code as keyof typeof collection.labels.singular];
          return label.toString();
        } else if (collection.labels.plural) {
          const label =
            collection.labels.plural[locale.code as keyof typeof collection.labels.plural];
          return label.toString();
        }
      }else {
        if (collection.labels.plural) {
          const label =
            collection.labels.plural[locale.code as keyof typeof collection.labels.plural];
          return label.toString();

        } else if (collection.labels.singular) {
          const label =
            collection.labels.singular[locale.code as keyof typeof collection.labels.singular];
          return label.toString();
        }
      }
    }
    return slug
  };
  return (
    <>
      <Gutter>
        <div>
          {csvData.length} {getNameCollection()} {t("labels.create")}
        </div>
        <div>
          <div className="doc-controls__controls template-minimal template-minimal--width-norma">
            <Button onClick={saveData}>{t("actions.save")}</Button>
            <br />
            <Button
              to={backToCollection}
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
      <LoadingOverlay show={show}></LoadingOverlay>
    </>
  );
};
