import { flow, getRoot, Instance, SnapshotIn, types } from 'mobx-state-tree';

import { imageSetModel, SIimageSet } from './imageSetModel';

export const userModel = types
  .model('user', {
    name: types.string,
    imageSets: types.map(imageSetModel),
  })
  .views((self) => ({
    get imageSetsAsArray() {
      return [...self.imageSets.values()];
    },
  }))
  .actions((self) => ({
    newImageSet: flow<string, []>(function* () {
      const { post } = getRoot(self);
      const imageSet: SIimageSet = yield post(`users/${self.name}/image-sets`);
      self.imageSets.set(imageSet.id, imageSet);
      return imageSet.id;
    }),
  }));

export interface Iuser extends Instance<typeof userModel> {}
export interface SIuser extends SnapshotIn<typeof userModel> {}
