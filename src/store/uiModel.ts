import { cast, SnapshotIn, types } from 'mobx-state-tree';

export const uiModel = types
  .model('ui', {
    error: types.maybe(types.string),
    isUserLoaded: false,
    sessionToken: types.maybe(types.string),
    username: types.maybe(types.string),
  })
  .actions((self) => ({
    set<K extends keyof SnapshotIn<typeof self>, T extends SnapshotIn<typeof self>>(
      key: K,
      value: T[K]
    ) {
      self[key] = cast(value);
    },
  }));
