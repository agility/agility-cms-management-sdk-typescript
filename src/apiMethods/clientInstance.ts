import axios, { AxiosInstance } from 'axios';

import { Options } from '../models/options';

export class ClientInstance {
	_options: Options;

	constructor(options: Options) {
		this._options = options;
	}
	/**
	 * Figure out the Base Url, which can be overriden using options.baseUrl
	 *
	 * @param {string} guid
	 * @returns {string}
	 * @memberof ClientInstance
	 */
	determineBaseUrl(guid: string): string {
		//if we have a baseUrl overridden, use it
		if (this._options.baseUrl) return this._options.baseUrl;

		const separator = guid.split('-');

		//determine the base url based on the GUID
		if (separator[1] === 'd') {
			return 'https://mgmt-dev.aglty.io';
		} else if (separator[1] === 'u') {
			return 'https://mgmt.aglty.io';
		} else if (separator[1] === 'us2') {
			return 'https://mgmt-usa2.aglty.io';
		} else if (separator[1] === 'c') {
			return 'https://mgmt-ca.aglty.io';
		} else if (separator[1] === 'e') {
			return 'https://mgmt-eu.aglty.io';
		} else if (separator[1] === 'a') {
			return 'https://mgmt-aus.aglty.io';
		}

		return 'https://mgmt.aglty.io';
	}

	getInstance(guid: string): AxiosInstance {
		const baseUrl = this.determineBaseUrl(guid);
		const instance = axios.create({
			baseURL: `${baseUrl}/api/v1/instance/${guid}`,
			maxContentLength: Infinity,
			maxBodyLength: Infinity,
		});
		return instance;
	}

	getAxiosInstance(guid: string): AxiosInstance {
		const baseUrl = this.determineBaseUrl(guid);
		const instance = axios.create({
			baseURL: `${baseUrl}/api/v1`,
			maxContentLength: Infinity,
			maxBodyLength: Infinity,
		});
		return instance;
	}

	async executeServerGet(apiPath: string, guid: string, token: string) {
		const instance = this.getAxiosInstance(guid);
		const resp = await instance.get(apiPath, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Cache-Control': 'no-cache',
			},
		});
		return resp;
	}

	async executeGet(apiPath: string, guid: string, token: string) {
		const instance = this.getInstance(guid);
		const resp = await instance.get(apiPath, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Cache-Control': 'no-cache',
			},
		});
		return resp;
	}

	async executeDelete(apiPath: string, guid: string, token: string, data?: any) {
		const instance = this.getInstance(guid);
		const resp = await instance.delete(apiPath, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Cache-Control': 'no-cache',
			},
			data,
		});
		return resp;
	}

	async executePost(apiPath: string, guid: string, token: string, data: any) {
		const instance = this.getInstance(guid);
		const resp = await instance.post(apiPath, data, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Cache-Control': 'no-cache',
			},
		});
		return resp;
	}
}
