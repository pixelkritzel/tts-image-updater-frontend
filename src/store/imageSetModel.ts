import {
  SnapshotIn,
  types,
  Instance,
  getParent,
  applySnapshot,
  getRoot,
} from 'mobx-state-tree';
import { flow } from 'mobx';

const imageModel = types
  .model({
    id: types.identifierNumber,
    url: types.string,
    name: types.optional(types.string, ''),
  })
  .views((self) => ({
    get isSelected() {
      const imageSet = getParent(self, 2) as { selectedImage?: { id: number } };
      return imageSet.selectedImage?.id === self.id;
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
    id: types.identifierNumber,
    name: types.optional(types.string, ''),
    images: types.optional(
      types.snapshotProcessor(
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
      []
    ),
    selectedImage: types.maybeNull(types.reference(imageModel))
  })
  .views((self) => ({
    get imagesAsArray() {
      return [...self.images.values()];
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
      self.images.delete(id.toString());
    },

    setSelectedImage: flow(function* (image: Iimage) {
      self.selectedImage = image;
      const { name } = getParent(self, 2);
      const { put } = getRoot(self);
      const patchFromServer = yield put(`users/${name}/image-sets/${self.id}`, self);
      applySnapshot(self, patchFromServer);
    }),
  }));

export type IimageSet = Instance<typeof imageSetModel>;
export type SIimageSet = SnapshotIn<typeof imageSetModel>;
