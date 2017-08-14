import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import rootReducer from '../reducers';

const loggerMiddleware = createLogger();

export default function configureStore() {
  const middleware = [
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware // neat middleware that logs actions
  ];
  const finalCreateStore = compose(applyMiddleware(...middleware))(createStore);

  const store = finalCreateStore(rootReducer, undefined, autoRehydrate());

  store.persistor = persistStore(store, {
    transforms: [immutableTransform({})]
  });

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
