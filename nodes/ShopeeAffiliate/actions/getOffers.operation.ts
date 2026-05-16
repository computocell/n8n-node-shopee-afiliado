import {
  IExecuteFunctions,
  INodeProperties,
  NodeOperationError,
} from 'n8n-workflow';

import { graphqlRequest }
  from '../transport/graphql.request';

export const getOffersProperties:
  INodeProperties[] = [

    /*
     * Keyword
     */

    {
      displayName: 'Keyword',

      name: 'keyword',

      type: 'string',

      default: '',

      description:
        'Busca produtos pelo nome',

      displayOptions: {
        show: {
          operation: [
            'getOffers',
          ],
        },
      },
    },

    /*
     * Shop ID
     */

    {
      displayName: 'Shop ID',

      name: 'shopId',

      type: 'number',

      default: 0,

      description:
        'Filtra produtos de uma loja específica',

      displayOptions: {
        show: {
          operation: [
            'getOffers',
          ],
        },
      },
    },

    /*
     * Item ID
     */

    {
      displayName: 'Item ID',

      name: 'itemId',

      type: 'number',

      default: 0,

      description:
        'Busca um produto específico pelo ID',

      displayOptions: {
        show: {
          operation: [
            'getOffers',
          ],
        },
      },
    },

    /*
     * Category ID
     */

    {
      displayName: 'Category ID',

      name: 'productCatId',

      type: 'number',

      default: 0,

      description:
        'Filtra produtos por categoria Shopee',

      displayOptions: {
        show: {
          operation: [
            'getOffers',
          ],
        },
      },
    },

    /*
     * Sort Type
     */

    {
      displayName: 'Sort Type',

      name: 'sortType',

      type: 'options',

      default: 1,

      description:
        'Define a ordenação dos produtos retornados',

      displayOptions: {
        show: {
          operation: [
            'getOffers',
          ],
        },
      },

      options: [

        {
          name: 'Relevance',

          value: 1,

          description:
            'Ordena por relevância da keyword',
        },

        {
          name: 'Items Sold',

          value: 2,

          description:
            'Produtos mais vendidos primeiro',
        },

        {
          name: 'Price Desc',

          value: 3,

          description:
            'Maior preço primeiro',
        },

        {
          name: 'Price Asc',

          value: 4,

          description:
            'Menor preço primeiro',
        },

        {
          name: 'Commission Desc',

          value: 5,

          description:
            'Maior comissão primeiro',
        },
      ],
    },

    /*
     * Page
     */

    {
      displayName: 'Page',

      name: 'page',

      type: 'number',

      default: 1,

      description:
        'Número da página da consulta',

      displayOptions: {
        show: {
          operation: [
            'getOffers',
          ],
        },
      },
    },

    /*
     * Limit
     */

    {
      displayName: 'Limit',

      name: 'limit',

      type: 'number',

      default: 10,

      description:
        'Quantidade máxima de produtos retornados',

      displayOptions: {
        show: {
          operation: [
            'getOffers',
          ],
        },
      },
    },

    /*
     * AMS Offer
     */

    {
      displayName: 'AMS Offer',

      name: 'isAMSOffer',

      type: 'boolean',

      default: false,

      description:
        'Filtra produtos que possuem comissão AMS (Commission Xtra)',

      displayOptions: {
        show: {
          operation: [
            'getOffers',
          ],
        },
      },
    },

    /*
     * Key Seller
     */

    {
      displayName: 'Key Seller',

      name: 'isKeySeller',

      type: 'boolean',

      default: false,

      description:
        'Filtra apenas produtos de vendedores parceiros principais da Shopee',

      displayOptions: {
        show: {
          operation: [
            'getOffers',
          ],
        },
      },
    },

    /*
     * Short Link
     */

    {
      displayName: 'Short Link',

      name: 'shortlink',

      type: 'boolean',

      default: true,

      description:
        'Gera automaticamente links curtos de afiliado. Pode aumentar o tempo da execução devido às requisições extras.',

      displayOptions: {
        show: {
          operation: [
            'getOffers',
          ],
        },
      },
    },

    /*
     * Miniatura
     */

    {
      displayName: 'Miniatura',

      name: 'thumbnail',

      type: 'boolean',

      default: false,

      description:
        'Adiciona fórmula IMAGE pronta para Google Sheets',

      displayOptions: {
        show: {
          operation: [
            'getOffers',
          ],
        },
      },
    },
  ];

export async function executeGetOffers(
  context: IExecuteFunctions,
  index: number,
) {

  const keyword =
    context.getNodeParameter(
      'keyword',
      index,
    ) as string;

  const shopId =
    context.getNodeParameter(
      'shopId',
      index,
    ) as number;

  const itemId =
    context.getNodeParameter(
      'itemId',
      index,
    ) as number;

  const productCatId =
    context.getNodeParameter(
      'productCatId',
      index,
    ) as number;

  const sortType =
    context.getNodeParameter(
      'sortType',
      index,
    ) as number;

  const page =
    context.getNodeParameter(
      'page',
      index,
    ) as number;

  const limit =
    context.getNodeParameter(
      'limit',
      index,
    ) as number;

  const isAMSOffer =
    context.getNodeParameter(
      'isAMSOffer',
      index,
    ) as boolean;

  const isKeySeller =
    context.getNodeParameter(
      'isKeySeller',
      index,
    ) as boolean;

  const shortlink =
    context.getNodeParameter(
      'shortlink',
      index,
    ) as boolean;

  const thumbnail =
    context.getNodeParameter(
      'thumbnail',
      index,
    ) as boolean;

  const filters = [

    keyword
      ? `keyword: "${keyword}"`
      : null,

    shopId
      ? `shopId: ${shopId}`
      : null,

    itemId
      ? `itemId: ${itemId}`
      : null,

    productCatId
      ? `productCatId: ${productCatId}`
      : null,

    sortType
      ? `sortType: ${sortType}`
      : null,

    page
      ? `page: ${page}`
      : null,

    limit
      ? `limit: ${limit}`
      : null,

    isAMSOffer
      ? `isAMSOffer: true`
      : null,

    isKeySeller
      ? `isKeySeller: true`
      : null,

  ].filter(Boolean).join('\n');

  const query = `
		query {
			productOfferV2(
				${filters}
			) {
				nodes {

					itemId

					productName

					priceMin

					priceMax

					priceDiscountRate

					sales

					commissionRate

					sellerCommissionRate

					shopeeCommissionRate

					commission

					ratingStar

					imageUrl

					shopId

					shopName

					productLink

					offerLink

					productCatIds

					shopType

					periodStartTime

					periodEndTime
				}

				pageInfo {

					page

					limit

					hasNextPage
				}
			}
		}
	`;

  const response =
    await graphqlRequest(
      context,
      {
        query,
      },
    );

  if (
    response.errors?.length
  ) {

    throw new NodeOperationError(
      context.getNode(),

      response.errors[0]
        .message,

      {
        itemIndex: index,
      },
    );
  }

  const result =
    response.data
      .productOfferV2;

  const products =
    result.nodes || [];

  /*
   * Miniatura
   */

  if (thumbnail) {

    for (const product of products) {

      product.miniatura =
        `=IMAGE("${product.imageUrl}";4;400;400)`;
    }
  }

  /*
   * Short Links
   */

  if (shortlink) {

    await Promise.all(

      products.map(
        async (product: any) => {

          try {

            const shortLinkQuery = `
							mutation {
								generateShortLink(
									input: {
										originUrl: "${product.offerLink}"
									}
								) {
									shortLink
								}
							}
						`;

            const shortLinkResponse =
              await graphqlRequest(
                context,
                {
                  query:
                    shortLinkQuery,
                },
              );

            product.shortLink =
              shortLinkResponse
                ?.data
                ?.generateShortLink
                ?.shortLink || null;

          } catch {

            product.shortLink =
              null;
          }
        },
      ),
    );
  }

  return result;
}