import { Injectable } from '@angular/core';
import { ODataConfiguration } from 'angular-odata-es5';

// Not used ?
@Injectable()
export class NorthwindODataConfiguration extends ODataConfiguration {

    constructor() {
        super();
        this.baseUrl = 'http://services.odata.org/V4/Northwind/Northwind.svc';
    }
}
