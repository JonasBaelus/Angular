// storage.service.ts

import { Injectable } from '@angular/core';
import { storage } from '../../../main';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  uploadImage(file: File, path: string): Observable<string> {
    const storageRef = ref(storage, path);
    return new Observable<string>((observer) => {
      uploadBytes(storageRef, file).then(() => {
        getDownloadURL(storageRef).then((url) => {
          observer.next(url);
          observer.complete();
        });
      });
    });
  }

  getImageUrl(path: string): Observable<string> {
    const storageRef = ref(storage, path);
    return new Observable<string>((observer) => {
      getDownloadURL(storageRef).then((url) => {
        observer.next(url);
        observer.complete();
      });
    });
  }
}
