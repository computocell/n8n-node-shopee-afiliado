import {
  IExecuteFunctions,
  INodeProperties,
  NodeOperationError,
} from 'n8n-workflow';

import { graphqlRequest }
  from '../transport/graphql.request';

export const searchProductsProperties:
  INodeProperties[] = [

    {
      displayName: 'Keyword',

      name: 'keyword',

      type: 'string',

      required: true,

      default: '',

      displayOptions: {
        show: {
          operation: [
            'searchProducts',
          ],
        },
      },
    },

    {
      displayName: 'Limit',

      name: 'limit',

      type: 'number',

      default: 10,

      displayOptions: {
        show: {
          operation: [
            'searchProducts',
          ],
        },
      },
    },
  ];

export async function executeSearchProducts(
  context: IExecuteFunctions,
  index: number,
) {

  const keyword =
    context.getNodeParameter(
      'keyword',
      index,
    ) as string;

  const limit =
    context.getNodeParameter(
      'limit',
      index,
    ) as number;

  const query = `
		query {
			searchProduct(
				keyword: "${keyword}"
				limit: ${limit}
			) {
				nodes {
					itemId
					productName
					price
					sales
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

      response.errors[0].message,

      {
        itemIndex: index,
      },
    );
  }

  return response.data
    .searchProduct;
}