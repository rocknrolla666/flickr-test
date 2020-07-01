import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { PhotosResp } from './photos.interfaces';

@Injectable({
    providedIn: 'root'
})
export class PhotoHttpService {
    private apiPath = environment.apiPath;
    private commonParams = {
        api_key: environment.apiKey,
        format: 'json',
        nojsoncallback: '1'
    };

    constructor(private http: HttpClient) {}

    getRecentPhotos(pageNum: number, pageSize: number): Observable<PhotosResp> {
        const params = new HttpParams({fromObject: {
            ...this.commonParams,
            method: 'flickr.photos.getRecent',
            page: String(pageNum),
            per_page: String(pageSize)
        }});
        return this.http.get<PhotosResp>(this.apiPath, {params})
            .pipe(
                catchError(error => {
                    console.log(error);
                    return of(null);
                })
            );
    }

    searchPhotos(searchTerm: string, pageNum: number, pageSize: number): Observable<PhotosResp> {
        const params = new HttpParams({fromObject: {
            ...this.commonParams,
            method: 'flickr.photos.search',
            text: searchTerm,
            page: String(pageNum),
            per_page: String(pageSize)
        }});
        return this.http.get<PhotosResp>(this.apiPath, {params})
            .pipe(
                catchError(error => {
                    console.log(error);
                    return of(null);
                })
            );
    }
}