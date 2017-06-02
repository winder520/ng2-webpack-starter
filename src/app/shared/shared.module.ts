
import { Component, NgModule } from "@angular/core";
import { AuthGuardService } from "./services/auth-guard.service";

@NgModule({
    providers:[AuthGuardService]
})
export class SharedModule {

}