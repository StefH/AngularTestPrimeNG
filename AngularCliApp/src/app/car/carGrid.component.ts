import { TestODataConfigurationFactory } from './TestODataConfigurationFactory';
import { Component, OnInit } from '@angular/core';
import { Car } from './car';
import { PrimeCar } from './primeCar';
// import { CarService } from './carservice';
import { LazyLoadEvent, FilterMetadata } from 'primeng/primeng';
import { ODataConfiguration, ODataServiceFactory, ODataService, ODataQuery, ODataPagedResult } from 'angular-odata-es5';

console.log('`CarGrid` component loaded asynchronously');

@Component({
    // moduleId: module.id,     fully resolved filename; defined at module load time
    templateUrl: './carGrid.component.html',
    selector: 'my-car-grid',
    providers: [ { provide: ODataConfiguration, useFactory: TestODataConfigurationFactory }, ODataServiceFactory ],
    styleUrls: [ './carGrid.component.css']
})
export class CarGridComponent implements OnInit {

    public displayDialog: boolean;

    public emptyMessage: string = 'nothing to see here';

    public car: Car = new PrimeCar();

    public selectedCar: Car;

    public newCar: boolean;

    public cars: Car[] = [];

    public datasource: Car[] = [];

    public totalRecords: number;

    public filter: LazyLoadEvent;

    private odata: ODataService<Car>;

    constructor(private odataFactory: ODataServiceFactory) {
        this.odata = this.odataFactory.CreateService<Car>('CarsNoDatabase');
    }

    public ngOnInit() {
        console.log('hello `CarGridComponent` component');
    }

    public loadCarsLazy(event: LazyLoadEvent) {
        // in a real application, make a remote request to load data using state metadata from event
        // event.first = First row offset
        // event.rows = Number of rows per page
        // event.sortField = Field name to sort with
        // event.sortOrder = Sort order as number, 1 for asc and -1 for dec
        // filters: FilterMetadata object having field as key and filter value filter matchMode as value

        console.log('event = ' + JSON.stringify(event));
        this.filter = event;

        this.getPagedDataAsync(event);
    }

    public showDialogToAdd() {
        this.newCar = true;
        this.car = new PrimeCar();
        this.displayDialog = true;
    }

    public save() {
        if (this.newCar) {
            this.cars.push(this.car);
        } else {
            this.cars[this.findSelectedCarIndex()] = this.car;
        }

        this.car = null;
        this.displayDialog = false;
    }

    public delete() {
        this.cars.splice(this.findSelectedCarIndex(), 1);
        this.car = null;
        this.displayDialog = false;
    }

    public onRowSelect(event) {
        this.newCar = false;
        this.car = this.cloneCar(event.data);
        this.displayDialog = true;
    }

    public cloneCar(c: Car): Car {
        const car = new PrimeCar();
        for (const prop in c) {
            if (c.hasOwnProperty(prop)) {
                car[prop] = c[prop];
            }
        }
        return car;
    }

    public findSelectedCarIndex(): number {
        return this.cars.indexOf(this.selectedCar);
    }

    private getPagedDataAsync(event: LazyLoadEvent) {
        let query: ODataQuery<Car> = this.odata
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
            .subscribe((pagedResult: ODataPagedResult<Car>) => {
                    this.cars = pagedResult.data;
                    this.totalRecords = pagedResult.count;
                },
                (error) => {
                    console.log('getPagedData ERROR ' + error);
                });
    }
}
