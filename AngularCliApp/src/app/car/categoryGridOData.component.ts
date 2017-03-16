import { NgModule, Component, Injectable, OnInit } from '@angular/core';
import { URLSearchParams, Http, Response } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { LazyLoadEvent, FilterMetadata } from 'primeng/primeng';
import { ODataConfiguration, ODataServiceFactory, ODataService, ODataQuery, PagedResult } from 'angular2-odata';
import { Observable, Operator } from 'rxjs/rx';
import { ICategory } from './category';
import { NorthwindODataConfigurationFactory } from './NorthwindODataConfigurationFactory';

console.log('`CategoryGridODataComponent` component loaded asynchronously');

@Component({
    templateUrl: './categoryGridOData.component.html',
    selector: 'my-category-grid-odata',
    providers: [ { provide: ODataConfiguration, useFactory: NorthwindODataConfigurationFactory }, ODataServiceFactory ],
    styleUrls: [ './carGrid.component.css']
})
export class CategoryGridODataComponent implements OnInit {

    public categories: ICategory[] = [];

    public totalRecords: number;

    public filter: LazyLoadEvent;

    private odata: ODataService<ICategory>;

    constructor(private odataFactory: ODataServiceFactory) {
        this.odata = this.odataFactory.CreateService<ICategory>('Categories');
    }

    public ngOnInit() {
        console.log('hello `CategoryGridODataComponent` component');
    }

    public loadCategoriesLazy(event: LazyLoadEvent) {
        // in a real application, make a remote request to load data using state metadata from event
        // event.first = First row offset
        // event.rows = Number of rows per page
        // event.sortField = Field name to sort with
        // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        // filters: FilterMetadata object having field as key and filter value, filter matchMode as value

        console.log('event = ' + JSON.stringify(event));
        this.filter = event;

        this.getPagedData(event);
    }

    private getPagedData(event: LazyLoadEvent) {
        let query: ODataQuery<ICategory> = this.odata
            .Query()
            .Top(event.rows)
            .Skip(event.first);

        if (event.filters) {
            const filterOData: string[] = [];
            for (const prop in event.filters) {
                if (event.filters.hasOwnProperty(prop)) {
                    const filter = event.filters[prop] as FilterMetadata;
                    const key: string = filter.matchMode.toLowerCase();
                    if (key !== '') {
                        filterOData.push(key + '(' + prop + ', \'' + filter.value + '\')');
                    }
                 }
            }

            query = query.Filter(filterOData.join(' and '));
        }

        if (event.sortField) {
            const sortOrder: string = event.sortOrder > 0 ? 'asc' : 'desc';
            query = query.OrderBy(event.sortField + ' ' + sortOrder);
        }

        query
            .ExecWithCount()
            .subscribe((pagedResult: PagedResult<ICategory>) => {
                    this.categories = pagedResult.data;
                    for (const cat of this.categories) {
                        // https://groups.google.com/forum/#!topic/odata4j-discuss/6amvlFgExEU
                        cat.Picture = cat.Picture.substr(104);
                    }
                    this.totalRecords = pagedResult.count;
                },
                (error) => {
                    console.log('getPagedData ERROR ' + error);
                });
    }
}
