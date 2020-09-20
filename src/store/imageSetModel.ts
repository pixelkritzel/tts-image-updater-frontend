import { Iuser } from './userModel';
import { axios, axiosResponse } from 'utils/axios';
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
import { Istore } from './storeModel';
import { flow } from 'mobx';

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
        throw new Error(`Neither selected nor default image on image set ${self.id}`);
      }
      return selectedImage;
    },
  }))
  .actions((self) => ({
    addImages: flow(function* (imagesData: FormData) {
      const { name } = getParent(self, 2);
      const response: axiosResponse<any> = yield axios.postImage(
        `users/${name}/image-sets/${self.id}/images`,
        imagesData
      );
      if (response.type === 'SUCCESS') {
        applySnapshot(self, response.data);
      }
    }),
    deleteImage(id: Iimage['id']) {
      self.images.delete(id);
    },

    setSelectedImage(image: Iimage) {
      self.selectedImageId = image.id;
    },

    update(snapshot: any) {
      try {
        applySnapshot(self, snapshot);
      } catch (e) {}
    },
  }))
  .actions((self) => {
    const disposers: IDisposer[] = [];
    function afterCreate() {
      const { name } = getParent(self, 2) as Iuser;
      disposers.push(
        onPatch(self, async (patch) => {
          const response = await axios.put(`users/${name}/image-sets/${self.id}`, patch);
          if (response.type === 'SUCCESS') {
            self.update(response.data);
          } else {
            const store = getRoot(self) as Istore;
            store.ui.set('error', response.message);
          }
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
