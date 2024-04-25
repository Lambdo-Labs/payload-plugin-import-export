import { User } from "payload/dist/auth";
import { CollectionConfig } from "payload/types";
import { Props as ListProps } from "payload/dist/admin/components/views/collections/List/types";
export interface PluginTypes {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean;
  collections?: string[],

  habilityCollection: CollectionConfig[];
  // excludeCollections?: string[];
  redirectAfterImport?: boolean;
  canImport?: (user: unknown) => boolean;
}


export interface NewCollectionTypes {
  title: string;
}

export interface TypeList {
    Component?: React.ComponentType<ListProps>;
    actions?: React.ComponentType<any>[];

}