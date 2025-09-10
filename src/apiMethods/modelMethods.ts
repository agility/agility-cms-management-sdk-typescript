import { Exception } from '../models/exception';
import { Model } from '../models/model';
import { Options } from '../models/options';

import { ClientInstance } from './clientInstance';

export class ModelMethods {
	_options!: Options;
	_clientInstance!: ClientInstance;

	constructor(options: Options) {
		this._options = options;
		this._clientInstance = new ClientInstance(this._options);
	}

	async getContentModel(id: number, guid: string) {
		try {
			const apiPath = `model/${id}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as Model;
		} catch (err) {
			throw new Exception(`Unable to retrieve model for id: ${id}.`, err as Error);
		}
	}

	async getModelByReferenceName(referenceName: string, guid: string) {
		try {
			const apiPath = `model/${referenceName}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as Model;
		} catch (err) {
			throw new Exception(
				`Unable to retrieve model for referenceName: ${referenceName}.`,
				err as Error
			);
		}
	}

	async getContentModules(includeDefaults: boolean, guid: string, includeModules: boolean = false) {
		try {
			const apiPath = `model/list/${includeDefaults}?includeModules=${includeModules}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as Model[];
		} catch (err) {
			throw new Exception(`Unable to retrieve content modules.`, err as Error);
		}
	}

	async getPageModules(includeDefault: boolean, guid: string) {
		try {
			const apiPath = `model/list-page-modules/${includeDefault}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as Model[];
		} catch (err) {
			throw new Exception(`Unable to retrieve page modules.`, err as Error);
		}
	}

	async saveModel(model: Model, guid: string) {
		try {
			const apiPath = `model`;
			const resp = await this._clientInstance.executePost(
				apiPath,
				guid,
				this._options.token,
				model
			);

			return resp.data as Model;
		} catch (err) {
			throw new Exception(`Unable to save the model.`, err as Error);
		}
	}

	async deleteModel(id: number, guid: string) {
		try {
			const apiPath = `model/${id}`;
			const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

			return resp.data as string;
		} catch (err) {
			throw new Exception(`Unable to delete the model`, err as Error);
		}
	}
}
