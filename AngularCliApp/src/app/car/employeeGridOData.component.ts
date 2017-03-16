import { Component, Injectable, OnInit } from '@angular/core';
import { LazyLoadEvent, FilterMetadata } from 'primeng/primeng';
import { ODataConfiguration, ODataServiceFactory, ODataService, ODataQuery, PagedResult } from 'angular2-odata';
import { Observable, Operator } from 'rxjs/rx';
import { IEmployee } from './employee';
import { NorthwindODataConfigurationFactory } from './NorthwindODataConfigurationFactory';

console.log('`EmployeeGridODataComponent` component loaded asynchronously');

@Component({
    templateUrl: './employeeGridOData.component.html',
    selector: 'my-employee-grid-odata',
    providers: [ { provide: ODataConfiguration, useFactory: NorthwindODataConfigurationFactory }, ODataServiceFactory ],
    styleUrls: [ './carGrid.component.css']
})

export class EmployeeGridODataComponent implements OnInit {

    public employees: IEmployee[] = [];

    public totalRecords: number;

    public filter: LazyLoadEvent;

    private odata: ODataService<IEmployee>;

    constructor(private odataFactory: ODataServiceFactory) {
        this.odata = this.odataFactory.CreateService<IEmployee>('Employees');
    }

    public ngOnInit() {
        console.log('hello `EmployeeGridODataComponent` component');
    }

    public loadEmployeesLazy(event: LazyLoadEvent) {
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
        let query: ODataQuery<IEmployee> = this.odata
            .Query()
            // .Expand('Orders($select=OrderID, CustomerID, EmployeeID, OrderDate, ShipName)')
            .Expand('Orders')
            .Select(['EmployeeID', 'FirstName', 'LastName', 'BirthDate', 'Orders'])
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
            .subscribe((pagedResult: PagedResult<IEmployee>) => {
                    this.employees = pagedResult.data;
                    this.totalRecords = pagedResult.count;
                },
                (error) => {
                    console.log('getPagedData ERROR ' + error);
                });
    }
}
