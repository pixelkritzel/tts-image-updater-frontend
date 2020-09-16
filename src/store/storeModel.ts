import { flow, Instance, SnapshotIn, types } from 'mobx-state-tree';
import { axios } from 'utils/axios';

import { axiosResponse } from 'utils/axios';

import { uiModel } from './uiModel';
import { SIuser, userModel } from './userModel';

export const storeModel = types
  .model('store', {
    ui: uiModel,
    user: types.maybe(userModel),
  })
  .actions((self) => ({
    loadUser: flow(function* () {
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
    afterCreate() {
      if (self.ui.username) {
        self.loadUser();
      }
    },
  }));

export interface Istore extends Instance<typeof storeModel> {}
export interface SIstore extends SnapshotIn<typeof storeModel> {}
