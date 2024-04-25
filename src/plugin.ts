import type { Plugin } from 'payload/config';

import ButtonList from './components/container';
import { importEndpointConfig } from './endpoints/import';
import type { PluginTypes, TypeList } from './types';
import { extendWebpackConfig } from './webpack';
import { ImportForm } from './components/import/ImportForm';
import { importView } from './view/importView';
import ImportList from './components/import';
import { import_products_en, import_products_es } from './utils/localized';

type PluginType = (pluginOptions?: PluginTypes) => Plugin;

export const importExportPlugin: PluginType = (pluginOptions) => {
  return (incomingConfig) => {
    // =
    //   (pluginOptions: PluginTypes): Plugin =>
    //     (incomingConfig) => {
    let config = { ...incomingConfig };

    // If you need to add a webpack alias, use this function to extend the webpack config
    const webpack = extendWebpackConfig(incomingConfig);

    config.admin = {
      ...(config.admin || {}),
      // If you extended the webpack config, add it back in here
      // If you did not extend the webpack config, you can remove this line
      webpack,

      // Add additional admin config here

      components: {
        ...(config.admin?.components || {}),
        // Add additional admin components here
        views: {
          ...(config.admin?.components?.views || {}),
          // Add additional admin views here
          Import: importView(config, pluginOptions),
        },
      },
    };

    // If the plugin is disabled, return the config without modifying it
    // The order of this check is important, we still want any webpack extensions to be applied even if the plugin is disabled
    if (pluginOptions?.enabled === false) {
      return config;
    }
    if (config.serverURL === undefined) {
      console.error(
        "\x1b[101m \x1b[1m ERROR - Payload-Plugin-Import-Export: Please add a 'serverURL' in your payload config and restart the server \x1b[0m"
      );

      return config;
    }
    config.collections = [
      ...(config.collections || []).map((collection) => {
        // Add additional collections here
        if (!pluginOptions?.habilityCollection?.includes(collection)) {
          return collection;
        }

        return {
          ...collection,
          endpoints: (collection.endpoints || []).concat([
            importEndpointConfig,
          ]),
          admin: {
            ...collection.admin,
            components: {
              ...collection.admin?.components,
              views: {
                ...(collection.admin?.components?.views || []),
                List: {
                  ...collection.admin?.components?.views?.List,
                  actions: (
                    ((collection.admin?.components?.views?.List) as TypeList).actions|| [] 
                  ).concat(ButtonList),
                },
              },
            },
          },
        };
      }),
      // Add additional collections here
    ];
    config.endpoints = [
      ...(config.endpoints || []), //.concat(importEndpointConfig),

      // Add additional endpoints here
    ];

    config.globals = [
      ...(config.globals || []),
      // Add additional globals here
    ];

    config.hooks = {
      ...(config.hooks || {}),
      // Add additional hooks here
    };

    config.onInit = async (payload) => {
      if (incomingConfig.onInit) await incomingConfig.onInit(payload);
      // Add additional onInit code by using the onInitExtension function
      // onInitExtension(pluginOptions, payload)
    };

    config.custom = {
      ...config.custom,
      importExportPluginConfig: pluginOptions,
    };
    config.i18n = {
      ...(config.i18n || {}),
      resources: {
        ...(config.i18n?.resources || {}),
        en: {
          ...(config.i18n?.resources?.en || {}),
          import_products: import_products_en,
        },
        es: {
          ...(config.i18n?.resources?.es || {}),
          import_products: import_products_es,
        },
      },
    }; 
    return config;
  };
};
