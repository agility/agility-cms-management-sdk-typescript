import { BatchState } from '../enums/batchState.';
import { Batch } from '../models/batch';
import { BatchTypesResponse } from '../models/batchTypes';
import { Exception } from '../models/exception';
import { Options } from '../models/options';

import { ClientInstance } from './clientInstance';

export class BatchMethods {
	_options!: Options;
	_clientInstance!: ClientInstance;

	constructor(options: Options) {
		this._options = options;
		this._clientInstance = new ClientInstance(this._options);
	}

	async getBatch(batchID: number, guid: string, expandItems: boolean = true): Promise<Batch> {
		try {
			const apiPath = `batch/${batchID}?expandItems=${expandItems}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as Batch;
		} catch (err) {
			throw new Exception(`Unable to retrieve the batch for id: ${batchID}`, err as Error);
		}
	}

	async publishBatch(
		batchID: number,
		guid: string,
		returnBatchId: boolean = false
	): Promise<number> {
		try {
			const apiPath = `batch/${batchID}/publish`;
			const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);

			const resultBatchID = resp.data as number;

			// If user wants batchID immediately, return it for custom polling
			if (returnBatchId) {
				return resultBatchID;
			}

			// Default behavior: wait for completion and return batch ID
			await this.Retry(async () => await this.getBatch(resultBatchID, guid));
			return resultBatchID;
		} catch (err) {
			throw new Exception(`Unable to publish the batch with id: ${batchID}`, err as Error);
		}
	}

	async unpublishBatch(
		batchID: number,
		guid: string,
		returnBatchId: boolean = false
	): Promise<number> {
		try {
			const apiPath = `batch/${batchID}/unpublish`;
			const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);

			const resultBatchID = resp.data as number;

			// If user wants batchID immediately, return it for custom polling
			if (returnBatchId) {
				return resultBatchID;
			}

			// Default behavior: wait for completion and return batch ID
			await this.Retry(async () => await this.getBatch(resultBatchID, guid));
			return resultBatchID;
		} catch (err) {
			throw new Exception(`Unable to unpublish the batch with id: ${batchID}`, err as Error);
		}
	}

	async approveBatch(
		batchID: number,
		guid: string,
		returnBatchId: boolean = false
	): Promise<number> {
		try {
			const apiPath = `batch/${batchID}/approve`;
			const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);

			const resultBatchID = resp.data as number;

			// If user wants batchID immediately, return it for custom polling
			if (returnBatchId) {
				return resultBatchID;
			}

			// Default behavior: wait for completion and return batch ID
			await this.Retry(async () => await this.getBatch(resultBatchID, guid));
			return resultBatchID;
		} catch (err) {
			throw new Exception(`Unable to approve the batch with id: ${batchID}`, err as Error);
		}
	}

	async declineBatch(
		batchID: number,
		guid: string,
		returnBatchId: boolean = false
	): Promise<number> {
		try {
			const apiPath = `batch/${batchID}/decline`;
			const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);

			const resultBatchID = resp.data as number;

			// If user wants batchID immediately, return it for custom polling
			if (returnBatchId) {
				return resultBatchID;
			}

			// Default behavior: wait for completion and return batch ID
			await this.Retry(async () => await this.getBatch(resultBatchID, guid));
			return resultBatchID;
		} catch (err) {
			throw new Exception(`Unable to decline the batch with id: ${batchID}`, err as Error);
		}
	}

	async requestApprovalBatch(
		batchID: number,
		guid: string,
		returnBatchId: boolean = false
	): Promise<number> {
		try {
			const apiPath = `batch/${batchID}/request-approval`;
			const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);

			const resultBatchID = resp.data as number;

			// If user wants batchID immediately, return it for custom polling
			if (returnBatchId) {
				return resultBatchID;
			}

			// Default behavior: wait for completion and return batch ID
			await this.Retry(async () => await this.getBatch(resultBatchID, guid));
			return resultBatchID;
		} catch (err) {
			throw new Exception(
				`Unable to request approval for the batch with id: ${batchID}`,
				err as Error
			);
		}
	}

	/**
	 * Retrieves all batch-related enum types for developer discovery.
	 * This method provides all available enum values with their names,
	 * enabling dynamic UI population and client-side validation.
	 *
	 * @param guid - Current website guid
	 * @returns Promise containing all batch enum types
	 *
	 * @example
	 * ```typescript
	 * // Get all batch types for UI population
	 * const types = await client.batchMethods.getBatchTypes(guid);
	 *
	 * // Create dropdown options for item types
	 * const itemTypeOptions = types.itemTypes.map(type => ({
	 *   label: type.name,
	 *   value: type.value
	 * }));
	 *
	 * // Validate operation type
	 * const isValidOperation = (value: number) =>
	 *   types.workflowOperations.some(op => op.value === value);
	 * ```
	 */
	async getBatchTypes(guid: string): Promise<BatchTypesResponse> {
		try {
			const apiPath = `batch/types`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as BatchTypesResponse;
		} catch (err) {
			throw new Exception(`Unable to retrieve batch types`, err as Error);
		}
	}

	async Retry(method: Function) {
		let retryCount = this._options.retryCount;
		const duration = this._options.duration;
		if (retryCount <= 0) throw new Exception('Number of retries has been exhausted.');
		// eslint-disable-next-line no-constant-condition
		while (true) {
			try {
				const batch = (await method()) as Batch;
				if (batch.batchState === BatchState.Processed) {
					return batch;
				} else {
					--retryCount;
					if (--retryCount <= 0) {
						throw new Exception(
							'Timeout exceeded but operation still in progress. Please check the Batches page in the Agility Content Manager app.'
						);
					}
					await this.delay(duration);
				}
			} catch (err) {
				throw new Exception(
					'Timeout exceeded but operation still in progress. Please check the Batches page in the Agility Content Manager app.',
					err as Error
				);
			}
		}
	}

	async delay(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}
