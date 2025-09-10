import { Exception } from '../models/exception';
import { InstanceRole } from '../models/instanceRole';
import { InstanceUser } from '../models/instanceUser';
import { Options } from '../models/options';
import { WebsiteUser } from '../models/websiteUser';

import { ClientInstance } from './clientInstance';

export class InstanceUserMethods {
	_options!: Options;
	_clientInstance!: ClientInstance;

	constructor(options: Options) {
		this._options = options;
		this._clientInstance = new ClientInstance(this._options);
	}

	async getUsers(guid: string) {
		try {
			const apiPath = `user/list`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as WebsiteUser;
		} catch (err) {
			throw new Exception(`Unable to retrieve users.`, err as Error);
		}
	}

	async saveUser(
		emailAddress: string,
		roles: InstanceRole[],
		guid: string,
		firstName?: string,
		lastName?: string
	) {
		try {
			const apiPath = `user/save?emailAddress=${emailAddress}&firstName=${firstName}&lastName=${lastName}`;
			const resp = await this._clientInstance.executePost(
				apiPath,
				guid,
				this._options.token,
				roles
			);

			return resp.data as InstanceUser;
		} catch (err) {
			throw new Exception(`Unable to retrieve users.`, err as Error);
		}
	}

	async deleteUser(userId: number, guid: string) {
		try {
			const apiPath = `user/delete/${userId}`;
			const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

			return resp.data as string;
		} catch (err) {
			throw new Exception(`Unable to delete the user for id: ${userId}`, err as Error);
		}
	}
}
