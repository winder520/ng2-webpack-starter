import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreloadSelectedModules } from './app-preload-strategy';
import { WelcomeComponent } from "./main/welcome.component";
let appRoutes: Routes = [
    {
        path: '',
        //redirectTo: 'document',
        component: WelcomeComponent,
        pathMatch: 'full'
    },
    {
        path: 'workspace',
        loadChildren:'./workspace/workspace.module#WorkspaceModule',
        data:{
            preload:false
        }
    },
    {
        path: 'account',
        loadChildren:'./account/account.module#AccountModule',
        data:{
            preload:false
        }
    },
    {
        path: 'dashboard',
        loadChildren:'./dashboard/dashboard.module#DashboardModule',
        data:{
            preload:false
        }
    }

];
@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes,
            {
                useHash: false,
                preloadingStrategy: PreloadSelectedModules
            })
    ],
    providers: [PreloadSelectedModules],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
