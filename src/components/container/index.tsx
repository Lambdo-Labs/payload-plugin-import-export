import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';
import { Button } from 'payload/components';
import { ImportForm } from '../import/ImportForm';
import { Drawer } from 'payload/components/elements';
import { useModal } from '@faceless-ui/modal';

import { useTranslation } from 'react-i18next';
export type Ctx = any;
 
export function Container(ctx: Ctx) {
  const { toggleModal } = useModal();
  const modalCreateSlug = 'modal-create'; 
  const { t } = useTranslation('import_products');
  return (
    <>
      <div className="gutter--left gutter--right">
        <Button
          size="small"
          onClick={() => toggleModal(modalCreateSlug)}
          className="pill pill--style-light pill--has-link pill--has-action"
        >
          <span className="pill__label">{t('lables.import')}</span>
        </Button>
      </div>
      <Drawer
        slug={modalCreateSlug}
        gutter
        children={
          <ImportForm closeModal={() => toggleModal(modalCreateSlug)} />
        }
      ></Drawer>
    </>
  );
}

export default Container;

 
