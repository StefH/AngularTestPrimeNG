import { NgModule } from "@angular/core";
import { Routes, RouterModule, PreloadAllModules } from "@angular/router";
import { UniversalModule } from "angular2-universal";
import { AppComponent } from "./components/app/app.component"
import { NavMenuComponent } from "./components/navmenu/navmenu.component";
import { HomeComponent } from "./components/home/home.component";
import { FetchDataComponent } from "./components/fetchdata/fetchdata.component";
import { CounterComponent } from "./components/counter/counter.component";
import { CarComponent } from "./components/car/car.component";
import { CarModule } from "./modules/car/car.module";

const appRoutes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "counter", component: CounterComponent },
    { path: "fetch-data", component: FetchDataComponent },
    { path: "car", component: CarComponent },
    { path: "**", redirectTo: "home" }
];

@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        CarComponent,
        HomeComponent
    ],
    imports: [
        // Must be first import. This automatically imports BrowserModule, HttpModule, and JsonpModule too.
        UniversalModule,

        RouterModule.forRoot(appRoutes)
    ]
})
export class AppModule {
}
