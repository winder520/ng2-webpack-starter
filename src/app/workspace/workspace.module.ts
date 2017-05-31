import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CommonModule } from '@angular/common';
import { WorkspaceRoutingModule } from "./workspace.routes";







@NgModule({

    imports: [
        CommonModule,
        WorkspaceRoutingModule
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