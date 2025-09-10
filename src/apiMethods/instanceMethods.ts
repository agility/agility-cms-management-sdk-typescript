import { Exception } from '../models/exception';
import { Locales } from '../models/locales';
import { Options } from '../models/options';

import { ClientInstance } from './clientInstance';

export class InstanceMethods {
	_options!: Options;
	_clientInstance!: ClientInstance;

	constructor(options: Options) {
		this._options = options;
		this._clientInstance = new ClientInstance(this._options);
	}

	async getLocales(guid: string) {
		try {
			const apiPath = `locales`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
			return resp.data as Locales[];
		} catch (err) {
			throw new Exception('Unable to retrieve locales.', err as Error);
		}
	}
}
