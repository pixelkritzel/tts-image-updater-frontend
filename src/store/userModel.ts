import { flow, getRoot, Instance, SnapshotIn, types } from 'mobx-state-tree';

import { imageSetModel, SIimageSet } from './imageSetModel';

export const userModel = types
  .model('user', {
    name: types.identifier,
    imageSets: types.optional(types.snapshotProcessor(
      types.map(imageSetModel),
      {
        preProcessor(sn: SIimageSet[]) {
          return sn.reduce((accu, curr) => {
            accu[curr.id] = curr;
            return accu;
          }, {} as { [key: string]: SIimageSet });
        },
        postProcessor(sn): SIimageSet[] {
          return Object.values(sn);
        },
      },
      'images in ImageSet'
    ), []),
  })
  .views((self) => ({
    get imageSetsAsArray() {
      return [...self.imageSets.values()];
    },
  }))
  .actions((self) => ({
    deleteImageSet: flow(function* (id: number) {
      const { delete: deleteFn } = getRoot(self);
      yield deleteFn(`/users/${self.name}/image-sets/${id}`);
      self.imageSets.delete(String(id));
    }),
    newImageSet: flow<number, []>(function* () {
      const { post } = getRoot(self);
      const imageSet: SIimageSet = yield post(`users/${self.name}/image-sets`);
      self.imageSets.set(String(imageSet.id), imageSet);
      return imageSet.id;
    }),
  }));

export interface Iuser extends Instance<typeof userModel> { }
export interface SIuser extends SnapshotIn<typeof userModel> { }
