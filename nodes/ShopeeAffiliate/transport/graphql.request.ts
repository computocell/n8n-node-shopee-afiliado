import {
	IExecuteFunctions,
} from 'n8n-workflow';

import {
	generateSignature,
} from '../GenericFunctions';

import {
	ApiErrorHandler,
} from '../helpers';

export async function graphqlRequest(
	context: IExecuteFunctions,
	body: object,
) {

	const credentials =
		await context.getCredentials(
			'shopeeAffiliateApi',
		);

	const appId =
		credentials.appId as string;

	const secret =
		credentials.secret as string;

	const timestamp =
		Math.floor(Date.now() / 1000);

	const payload =
		JSON.stringify(body);

	const signature =
		generateSignature(
			appId,
			timestamp,
			payload,
			secret,
		);

	try {

		return await context.helpers.httpRequest({

			method: 'POST',

			url:
				'https://open-api.affiliate.shopee.com.br/graphql',

			body,

			json: true,

			headers: {

				Authorization:
					`SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`,

				'Content-Type':
					'application/json',
			},
		});

	} catch (error: any) {

		ApiErrorHandler.handle(
			context,
			error,
		);
	}
}