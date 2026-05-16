import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import {

  generateShortLinkProperties,
  executeGenerateShortLink,

  getOffersProperties,
  executeGetOffers,

  searchProductsProperties,
  executeSearchProducts,

} from './actions';

export class ShopeeAffiliate
  implements INodeType {

  description: INodeTypeDescription = {

    displayName:
      'Shopee Affiliate',

    name:
      'shopeeAffiliate',

    icon:
      'file:shopee.svg',

    group:
      ['transform'],

    version:
      1,

    subtitle:
      '={{$parameter["operation"]}}',

    description:
      'Shopee Affiliate API',

    defaults: {
      name:
        'Shopee Affiliate',
    },

    inputs:
      ['main'],

    outputs:
      ['main'],

    credentials: [

      {
        name:
          'shopeeAffiliateApi',

        required:
          true,
      },
    ],

    properties: [

      /*
       * Operation
       */

      {
        displayName:
          'Operation',

        name:
          'operation',

        type:
          'options',

        noDataExpression:
          true,

        options: [

          {
            name:
              'Generate Short Link',

            value:
              'generateShortLink',
          },

          {
            name:
              'Get Offers',

            value:
              'getOffers',
          },

          {
            name:
              'Search Products',

            value:
              'searchProducts',
          },
        ],

        default:
          'generateShortLink',
      },

      /*
       * Operations Properties
       */

      ...generateShortLinkProperties,

      ...getOffersProperties,

      ...searchProductsProperties,
    ],
  };

  async execute(
    this: IExecuteFunctions,
  ): Promise<INodeExecutionData[][]> {

    const items =
      this.getInputData();

    const returnData:
      INodeExecutionData[] = [];

    for (
      let i = 0;
      i < items.length;
      i++
    ) {

      const operation =
        this.getNodeParameter(
          'operation',
          i,
        );

      /*
       * Generate Short Link
       */

      if (
        operation ===
        'generateShortLink'
      ) {

        const data =
          await executeGenerateShortLink(
            this,
            i,
          );

        returnData.push({
          json: data,
        });
      }

      /*
       * Get Offers
       */

      if (
        operation ===
        'getOffers'
      ) {

        const data =
          await executeGetOffers(
            this,
            i,
          );

        returnData.push({
          json: data,
        });
      }

      /*
       * Search Products
       */

      if (
        operation ===
        'searchProducts'
      ) {

        const data =
          await executeSearchProducts(
            this,
            i,
          );

        returnData.push({
          json: data,
        });
      }
    }

    return [returnData];
  }
}