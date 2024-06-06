import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAi8E4PUJBhlN0TBl-T5Kv5kuTFuwhIrxE',
  authDomain: 'trip-planner-46730.firebaseapp.com',
  projectId: 'trip-planner-46730',
  storageBucket: 'trip-planner-46730.appspot.com',
  messagingSenderId: '181439908917',
  appId: '1:181439908917:web:b6920d0eba48580dc0f57c',
  measurementId: 'G-ZPFY15CP10',
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

export { storage };
