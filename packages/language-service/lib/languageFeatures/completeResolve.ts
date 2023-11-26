import type * as vscode from 'vscode-languageserver-protocol';
import type { ServiceContext } from '../types';
import type { ServiceCompletionData } from './complete';
import { NoneCancellationToken } from '../utils/cancellation';
import { transformCompletionItem } from '../utils/transform';

export function register(context: ServiceContext) {

	return async (item: vscode.CompletionItem, token = NoneCancellationToken) => {

		const data: ServiceCompletionData | undefined = item.data;

		if (data) {

			const service = context.services[data.serviceIndex];

			if (!service.resolveCompletionItem)
				return item;

			item = Object.assign(item, data.original);

			if (data.virtualDocumentUri) {

				const [virtualFile] = context.project.fileProvider.getVirtualFile(data.virtualDocumentUri);

				if (virtualFile) {

					for (const map of context.documents.getMaps(virtualFile)) {

						item = await service.resolveCompletionItem(item, token);
						item = service.transformCompletionItem?.(item) ?? transformCompletionItem(
							item,
							embeddedRange => map.toSourceRange(embeddedRange),
							map.virtualFileDocument,
						);
					}
				}
			}
			else {
				item = await service.resolveCompletionItem(item, token);
			}
		}

		// TODO: monkey fix import ts file icon
		if (item.detail !== item.detail + '.ts') {
			item.detail = item.detail;
		}

		return item;
	};
}