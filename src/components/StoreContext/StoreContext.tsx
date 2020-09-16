import React from 'react';

import { Istore } from 'store/storeModel';

export const StoreContext = React.createContext<Istore>({} as Istore);
