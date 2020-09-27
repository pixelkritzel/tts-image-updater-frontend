import { flow, Instance, SnapshotIn, types } from 'mobx-state-tree';
import localforage from 'localforage';

import { axios, axiosResponse } from 'utils/axios';

import { uiModel } from './uiModel';
import { SIuser, userModel } from './userModel';

export const storeModel = types
	.model('store', {
		ui: uiModel,
		user: types.maybe(userModel),
	})
	.actions((self) => ({
		loadUser: flow(function*() {
			if (self.ui.username) {
				const response: axiosResponse<SIuser> = yield axios.get(`users/${self.ui.username}`);
				if (response.type === 'SUCCESS') {
					self.user = userModel.create(response.data);
				} else {
					self.ui.error = response.message;
				}
			}
		}),
	}))
	.actions((self) => ({
		async afterCreate() {
			axios.setSpinner = (isAxiosActive: boolean) => self.ui.set('isAxiosActive', isAxiosActive);
			const savedData = await localforage.getItem<{ sessionToken: string; username: string }>(
				'tts-image-updater-frontend',
			);
			if (savedData) {
				self.ui.set('username', savedData.username);
				self.ui.set('sessionToken', savedData.sessionToken);
				axios.setSessionToken(savedData.sessionToken);
			}
			if (self.ui.username) {
				await self.loadUser();
			}
			self.ui.set('isStoreReady', true);
		},
	}));

export interface Istore extends Instance<typeof storeModel> {}
export interface SIstore extends SnapshotIn<typeof storeModel> {}
