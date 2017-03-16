import { FactoryProvider  } from '@angular/core';
import { ODataConfiguration } from 'angular-odata-es5';

export class NorthwindODataConfigurationFactory {

    constructor () {
        const odata = new ODataConfiguration();
        odata.baseUrl = 'http://services.odata.org/V4/Northwind/Northwind.svc';
        return odata;
    }
}
