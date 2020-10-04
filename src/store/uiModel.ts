import { cast, IDisposer, Instance, onSnapshot, SnapshotIn, types } from 'mobx-state-tree';
import localforage from 'localforage';

export const uiModel = types
  .model('ui', {
    error: types.maybe(
      types.model({
        message: types.maybe(types.string),
        statusCode: types.maybe(types.string),
      })
    ),
    sessionToken: types.maybe(types.string),
    username: types.maybe(types.string),
    isAxiosActive: false,
    isStoreReady: false,
  })
  .views((self) => ({
    get showSpinner() {
      return self.isAxiosActive || !self.isStoreReady;
    },
  }))
  .actions((self) => ({
    set<K extends keyof SnapshotIn<typeof self>, T extends SnapshotIn<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = cast(value);
    },
  }))
  .actions((self) => {
    const disposers: IDisposer[] = [];

    function afterCreate() {
      const disposerFn = onSnapshot(self, async (snapShot) => {
        const { username, sessionToken } = snapShot;
        localforage.setItem('tts-image-updater-frontend', { sessionToken, username });
      });
      disposers.push(disposerFn);
    }

    function beforeDestroy() {
      disposers.forEach((dFn) => dFn());
    }

    return { afterCreate, beforeDestroy };
  });

export interface Iui extends Instance<typeof uiModel> {}
