import {
  SnapshotIn,
  types,
  Instance,
  IDisposer,
  onPatch,
  getParent,
  applySnapshot,
  getRoot,
} from 'mobx-state-tree';
import { flow } from 'mobx';

import { Istore } from './storeModel';
import { Iuser } from './userModel';

const imageModel = types
  .model({
    id: types.identifier,
    url: types.string,
    name: types.optional(types.string, ''),
  })
  .views((self) => ({
    get isSelected() {
      const imageSet = getParent(self, 2) as { selectedImage: { id: string } };
      return imageSet.selectedImage.id === self.id;
    },
  }))
  .actions((self) => ({
    delete() {
      const imageSet = getParent(self, 2) as IimageSet;
      imageSet.deleteImage(self.id);
    },
  }));

export type Iimage = Instance<typeof imageModel>;
export type SIimageModel = SnapshotIn<typeof imageModel>;

const imageModelMap = types.map(imageModel);

export const imageSetModel = types
  .model({
    id: types.identifier,
    name: types.optional(types.string, ''),
    images: types.snapshotProcessor(
      imageModelMap,
      {
        preProcessor(sn: SIimageModel[]) {
          return sn.reduce((accu, curr) => {
            accu[curr.id] = curr;
            return accu;
          }, {} as { [key: string]: SIimageModel });
        },
        postProcessor(sn): SIimageModel[] {
          return Object.values(sn);
        },
      },
      'images in ImageSet'
    ),
    defaultImageId: types.optional(types.string, ''),
    selectedImageId: types.optional(types.string, ''),
  })
  .views((self) => ({
    get imagesAsArray() {
      return [...self.images.values()];
    },
    get selectedImage() {
      const selectedImage = self.selectedImageId
        ? self.images.get(self.selectedImageId)
        : self.images.get(self.defaultImageId);
      if (!selectedImage) {
        return null;
      }
      return selectedImage;
    },
  }))
  .actions((self) => {
    const addImages = flow<void, [FormData]>(function* (imagesData: FormData) {
      const { name } = getParent(self, 2);
      const { post } = getRoot(self);
      const response = yield post(`users/${name}/image-sets/${self.id}/images`, imagesData, {
        headers: { 'content-type': 'multipart/form-data' },
      });
      applySnapshot(self, response);
    });
    return { addImages };
  })
  .actions((self) => ({
    deleteImage(id: Iimage['id']) {
      self.images.delete(id);
    },

    setSelectedImage(image: Iimage) {
      self.selectedImageId = image.id;
    },

    update(snapshot: any) {
      try {
        applySnapshot(self, snapshot);
      } catch (e) {
        const { ui } = getRoot(self) as Istore;
        ui.set('error', { message: e });
      }
    },
  }))
  .actions((self) => {
    const disposers: IDisposer[] = [];
    function afterCreate() {
      const { name } = getParent(self, 2) as Iuser;
      const { put } = getRoot(self) as Istore;
      disposers.push(
        onPatch(self, async (patch) => {
          const patchFromServer = await put(`users/${name}/image-sets/${self.id}`, patch);
          self.update(patchFromServer);
        })
      );
    }

    function beforeDestroy() {
      disposers.forEach((disposer) => disposer());
    }

    return { afterCreate, beforeDestroy };
  });

export type IimageSet = Instance<typeof imageSetModel>;
export type SIimageSet = SnapshotIn<typeof imageSetModel>;
