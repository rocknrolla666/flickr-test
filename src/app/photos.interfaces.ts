import { PageEvent } from '@angular/material/paginator';

export interface Photo {
    url: string;
    title: string;
}

export interface PhotosState {
    photos: Photo[];
    pagerState?: PageEvent;
}

export interface PhotosQueryState {
    pageIndex?: number;
    pageSize?: number;
    searchTerm?: string;
}

export interface PhotoDTO {
    farm: number;
    id: string;
    isfamily: number;
    isfriend: number;
    ispublic: number;
    owner: string;
    secret: string;
    server: string;
    title: string;
}

export interface PhotosResp {
    photos: {
        page: number;
        pages: number;
        perpage: number;
        photo: PhotoDTO[];
        total: number;
    };
    stat: string;
}