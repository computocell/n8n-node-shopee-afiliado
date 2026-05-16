import {
	NodeApiError,
	IExecuteFunctions,
} from 'n8n-workflow';

export class ApiErrorHandler {

	static handle(
		context: IExecuteFunctions,
		error: any,
	) {

		/*
		 * HTTP 429
		 */

		if (
			error.httpCode === '429' ||
			error.statusCode === 429
		) {

			throw new NodeApiError(
				context.getNode(),

				{
					message:
						'Shopee API rate limit exceeded',

					description:
						'Muitas requisições enviadas para a Shopee API.',
				},
			);
		}

		/*
		 * HTTP 401
		 */

		if (
			error.httpCode === '401' ||
			error.statusCode === 401
		) {

			throw new NodeApiError(
				context.getNode(),

				{
					message:
						'Shopee authentication failed',

					description:
						'Verifique App ID e Secret.',
				},
			);
		}

		/*
		 * Timeout
		 */

		if (
			error.code === 'ETIMEDOUT'
		) {

			throw new NodeApiError(
				context.getNode(),

				{
					message:
						'Shopee API timeout',

					description:
						'A API demorou muito para responder.',
				},
			);
		}

		/*
		 * GraphQL errors
		 */

		if (
			error.response?.body?.errors?.length
		) {

			const gqlError =
				error.response.body.errors[0];

			/*
			 * Rate limit GraphQL
			 */

			if (
				gqlError.message
					?.toLowerCase()
					.includes('rate')
			) {

				throw new NodeApiError(
					context.getNode(),

					{
						message:
							'Shopee GraphQL rate limit exceeded',
					},
				);
			}

			/*
			 * Signature inválida
			 */

			if (
				gqlError.message
					?.toLowerCase()
					.includes('signature')
			) {

				throw new NodeApiError(
					context.getNode(),

					{
						message:
							'Invalid Shopee signature',

						description:
							'Verifique App ID e Secret.',
					},
				);
			}

			/*
			 * Erro GraphQL genérico
			 */

			throw new NodeApiError(
				context.getNode(),

				{
					message:
						gqlError.message ||
						'Shopee GraphQL error',
				},
			);
		}

		/*
		 * Fallback
		 */

		throw new NodeApiError(
			context.getNode(),

			error,
		);
	}
}