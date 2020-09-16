import { Instance, SnapshotIn, types } from 'mobx-state-tree';

import { imageSetModel } from './imageSetModel';

export const userModel = types
  .model('user', {
    name: types.string,
    imageSets: types.map(imageSetModel),
  })
  .views((self) => ({
    get imageSetsAsArray() {
      return [...self.imageSets.values()];
    },
  }));

export interface Iuser extends Instance<typeof userModel> {}
export interface SIuser extends SnapshotIn<typeof userModel> {}
