import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { PageEvent } from '@angular/material/paginator';

import { map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

import { PhotosService } from './photos.service';
import { PhotosState } from '../photos.interfaces';

@Component({
  selector: 'photos-list',
  templateUrl: './photos-list.component.html',
  styleUrls: ['./photos-list.component.scss'],
  providers: [PhotosService]
})
export class PhotosListComponent implements OnInit {
  photosState$: Observable<PhotosState>;

  searchInput = new FormControl();
  searchForm = new FormGroup({searchInput: this.searchInput});

  pageChangesSubject = new Subject<PageEvent>();

  constructor(private photosService: PhotosService) {}

  ngOnInit() {
    const searchTerm$ = this.searchForm.valueChanges
      .pipe(
        map(newSearch => newSearch.searchInput.toLowerCase().trim()),
        distinctUntilChanged(),
        debounceTime(300)
      );
    const pageChanges$ = this.pageChangesSubject.asObservable();

    this.photosState$ = this.photosService.getPhotosState$(searchTerm$, pageChanges$);
  }

  onPage(event: PageEvent) {
    this.pageChangesSubject.next(event);
  }
}
