import {
  ICredentialType,
  INodeProperties,
  IAuthenticateGeneric,
  ICredentialTestRequest,
} from 'n8n-workflow';

import crypto from 'crypto';

export class ShopeeAffiliateApi
  implements ICredentialType {

  name = 'shopeeAffiliateApi';

  displayName =
    'Shopee Affiliate API';

  documentationUrl =
    'https://affiliate.shopee.com.br/open_api/document';

  properties: INodeProperties[] = [

    {
      displayName: 'App ID',

      name: 'appId',

      type: 'string',

      default: '',

      required: true,
    },

    {
      displayName: 'Secret',

      name: 'secret',

      type: 'string',

      typeOptions: {
        password: true,
      },

      default: '',

      required: true,
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',

    properties: {
      headers: {
        Authorization:
          '={{$credentials.authorization}}',
      },
    },
  };

  preAuthentication = async (
    credentials: any,
  ) => {

    const appId =
      credentials.appId;

    const secret =
      credentials.secret;

    const timestamp =
      Math.floor(Date.now() / 1000);

    const body = {

      query: `
				query {
					productOfferV2(limit: 1) {
						nodes {
							itemId
						}
					}
				}
			`,
    };

    const payload =
      JSON.stringify(body);

    const signature =
      crypto
        .createHash('sha256')
        .update(
          appId +
          timestamp +
          payload +
          secret,
        )
        .digest('hex');

    credentials.authorization =
      `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`;

    return credentials;
  };

  test: ICredentialTestRequest = {

    request: {

      method: 'POST',

      baseURL:
        'https://open-api.affiliate.shopee.com.br',

      url: '/graphql',

      body: {

        query: `
					query {
						productOfferV2(limit: 1) {
							nodes {
								itemId
							}
						}
					}
				`,
      },

      json: true,

      headers: {

        Authorization:
          '={{$credentials.authorization}}',

        'Content-Type':
          'application/json',
      },
    },

    rules: [

      {
        type: 'responseSuccessBody',

        properties: {

          key: 'errors',

          value: undefined,

          message:
            'Shopee authentication failed.',
        },
      },
    ],
  };
}