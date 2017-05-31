import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CommonModule } from '@angular/common';
import { AccountRoutingModule } from "./account.routes";
import { LoginComponent } from "./login.component";
import { RegisterComponent } from "./register.component";







@NgModule({

    imports: [
        CommonModule,
        AccountRoutingModule
    ],

    exports: [],

    declarations: [LoginComponent, RegisterComponent],

    providers: [

        //{ provide: APP_BASE_HREF, useValue: '/' }

    ],

    //schemas: [CUSTOM_ELEMENTS_SCHEMA]

})

export class AccountModule {

}