import { FactoryProvider  } from '@angular/core';
import { ODataConfiguration } from 'angular-odata-es5';

export class TestODataConfigurationFactory {

    constructor () {
        const odata = new ODataConfiguration();
        odata.baseUrl = 'https://odatateststef.azurewebsites.net/odata';
        return odata;
    }
}
