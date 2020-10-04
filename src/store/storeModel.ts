import { flow, Instance, SnapshotIn, types } from 'mobx-state-tree';
import localforage from 'localforage';

import { axios, axiosResponse } from 'utils/axios';

import { uiModel } from './uiModel';
import { SIuser, userModel } from './userModel';
import { AxiosRequestConfig, Method } from 'axios';

export const storeModel = types
  .model('store', {
    ui: uiModel,
    user: types.maybe(userModel),
  })
  .actions((self) => {
    const _axiosCall = flow(function* <D extends unknown>(
      method: Method,
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ) {
      self.ui.set('isAxiosActive', true);
      const response: axiosResponse<D> = yield axios.callAxios(method, url, data, config);
      self.ui.set('isAxiosActive', false);
      if (response.type === 'SUCCESS') {
        return response.data;
      } else {
        self.ui.error = {
          message: response.message,
          statusCode: response.statusCode,
        };
        throw self.ui.error;
      }
    });

    return {
      get: async function <D extends unknown>(
        url: string,
        data?: any,
        options?: AxiosRequestConfig
      ) {
        return (await _axiosCall('GET', url, data, options)) as D;
      },
      delete: async function <D extends unknown>(
        url: string,
        data?: any,
        options?: AxiosRequestConfig
      ) {
        return await _axiosCall('DELETE', url, data, options);
      },
      post: async function <D extends unknown>(
        url: string,
        data?: any,
        options?: AxiosRequestConfig
      ) {
        return (await _axiosCall('POST', url, data, options)) as D;
      },
      put: async function <D extends unknown>(
        url: string,
        data?: any,
        options?: AxiosRequestConfig
      ) {
        return (await _axiosCall('PUT', url, data, options)) as D;
      },
    };
  })
  .actions((self) => ({
    loadUser: flow(function* () {
      if (self.ui.username) {
        const user: SIuser = yield self.get(`users/${self.ui.username}`);
        self.user = userModel.create(user);
      }
    }),
    login: flow(function* (username: string, password: string) {
      const response: axiosResponse<{ token: string }> = yield axios.callAxios<{ token: string }>(
        'POST',
        '/login',
        { username, password }
      );
      if (response.type === 'SUCCESS') {
        axios.setSessionToken(response.data!.token);
        self.ui.set('username', username);
        self.ui.set('sessionToken', response.data?.token);
      }
      return response;
    }),
    logout: flow(function* () {
      yield self.delete('/logout');
      self.ui.set('sessionToken', undefined);
      self.ui.set('username', undefined);
    }),
  }))
  .actions((self) => ({
    async afterCreate() {
      const savedData = await localforage.getItem<{ sessionToken: string; username: string }>(
        'tts-image-updater-frontend'
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
