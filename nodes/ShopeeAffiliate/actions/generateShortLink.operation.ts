import {
  IExecuteFunctions,
  INodeProperties,
  NodeOperationError,
} from 'n8n-workflow';

import { graphqlRequest }
  from '../transport/graphql.request';

export const generateShortLinkProperties:
  INodeProperties[] = [

    {
      displayName: 'Origin URL',

      name: 'originUrl',

      type: 'string',

      required: true,

      default: '',

      displayOptions: {
        show: {
          operation: [
            'generateShortLink',
          ],
        },
      },
    },

    {
      displayName: 'Sub IDs',

      name: 'subIds',

      type: 'fixedCollection',

      typeOptions: {
        multipleValues: true,
      },

      default: {},

      displayOptions: {
        show: {
          operation: [
            'generateShortLink',
          ],
        },
      },

      options: [

        {
          name: 'values',

          displayName: 'Values',

          values: [

            {
              displayName: 'Value',

              name: 'value',

              type: 'string',

              default: '',
            },
          ],
        },
      ],
    },
  ];

export async function executeGenerateShortLink(
  context: IExecuteFunctions,
  index: number,
) {

  const originUrl =
    context.getNodeParameter(
      'originUrl',
      index,
    ) as string;

  const subIdsData =
    context.getNodeParameter(
      'subIds',
      index,
      {},
    ) as {
      values?: {
        value: string;
      }[];
    };

  const subIds =
    (subIdsData.values || [])
      .map(
        (item) =>
          item.value,
      )
      .filter(Boolean);

  const query = `
		mutation {
			generateShortLink(
				input: {
					originUrl: "${originUrl}"
					subIds: ${JSON.stringify(subIds)}
				}
			) {
				shortLink
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
    .generateShortLink;
}