import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CommonModule } from '@angular/common';







@NgModule({

    imports: [
        CommonModule,
        WordspaceRoutingModule
    ],

    exports: [],

    // declarations: [WindowsComponent, WindowTemplateComponent],

    providers: [

        //{ provide: APP_BASE_HREF, useValue: '/' }

    ],

    //schemas: [CUSTOM_ELEMENTS_SCHEMA]

})

export class EditSpaceModule {

}