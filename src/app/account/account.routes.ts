import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "./login.component";
import { RegisterComponent } from "./register.component";
import { AuthGuardService } from "../shared/services/auth-guard.service";
import { UserDetailComponent } from "./user-detail.component";





const routes: Routes = [
    // {
    //     path:'',component:LoginComponent
    // },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'register', component: RegisterComponent
    },
    {
        path: 'user',
        canActivateChild: [AuthGuardService],
        children: [
            {
                path:'detail',
                component:UserDetailComponent
            }
        ]
    }

];



@NgModule({

    imports: [RouterModule.forChild(routes)],

    exports: [RouterModule],

})
export class AccountRoutingModule {

}