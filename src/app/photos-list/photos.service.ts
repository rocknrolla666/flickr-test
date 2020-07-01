import { Injectable } from '@angular/core';

import { PageEvent } from '@angular/material/paginator';

import { Observable, merge } from 'rxjs';
import { scan, switchMap, map, share, startWith } from 'rxjs/operators';

import { PhotoHttpService } from '../photos-http.service';
import { PhotosQueryState, PhotosResp, PhotoDTO, Photo } from '../photos.interfaces';

const initialQueryState: PhotosQueryState = {
    pageIndex: 0,
    pageSize: 100,
    searchTerm: null
}

@Injectable()
export class PhotosService {

    constructor(private photosHttpService: PhotoHttpService) {}

    getPhotosState$(searchTerm$: Observable<string>, pageChanges$: Observable<PageEvent>) {
        const newSearch$: Observable<PhotosQueryState> = searchTerm$
            .pipe(
                map((searchTerm: string) => ({
                    pageIndex: 0,
                    searchTerm
                }))
            );

        const newPage$: Observable<PhotosQueryState> = pageChanges$
            .pipe(
                map((pageEvent: PageEvent) => ({
                    pageIndex: pageEvent.pageIndex,
                    pageSize: pageEvent.pageSize
                }))
            );

        return merge(newSearch$, newPage$)
            .pipe(
                startWith(initialQueryState),
                scan((queryState, queryStateChanges) => ({...queryState, ...queryStateChanges})),
                switchMap(queryState => this.loadPhotos(
                    queryState.searchTerm,
                    queryState.pageIndex + 1,
                    queryState.pageSize
                )),
                map((photosReps: PhotosResp) => ({
                    photos: photosReps.photos.photo.map(this.photoDto2Photo),
                    pagerState: {
                        pageIndex: photosReps.photos.page - 1,
                        pageSize: photosReps.photos.perpage,
                        length: photosReps.photos.total
                    }
                })),
                share()
            );
    }

    private loadPhotos(searchTerm: string, pageNum: number, pageSize: number) {
        return searchTerm ?
            this.photosHttpService.searchPhotos(searchTerm, pageNum, pageSize) :
            this.photosHttpService.getRecentPhotos(pageNum, pageSize);
    }

    private photoDto2Photo(photoDTO: PhotoDTO): Photo {
        return {
            url: `https://farm${photoDTO.farm}.staticflickr.com/${photoDTO.server}/${photoDTO.id}_${photoDTO.secret}.jpg`,
            title: photoDTO.title
        }
    }
}