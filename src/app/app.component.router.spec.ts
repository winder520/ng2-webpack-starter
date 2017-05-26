// /*
//  * Testing a Component with Router and Spy
//  * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#routed-component-w-param
//  */
// import * as r from '@angular/router';
// import { ChangeDetectorRef, NO_ERRORS_SCHEMA, DebugElement, NgModuleFactoryLoader } from '@angular/core';
// import { TestBed, async, inject, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';


// import { SpyLocation } from '@angular/common/testing';
// import { Router, RouterLinkWithHref } from '@angular/router';
// import { RouterTestingModule, SpyNgModuleFactoryLoader } from '@angular/router/testing';


// import { AppModule } from './app.module';
// import { WindowModule } from './windows/window.module';
// import { AppComponent } from './app.component';

// let comp: AppComponent;
// let fixture: ComponentFixture<AppComponent>;
// let page: Page;
// let router: Router;
// let location: SpyLocation;
// let loader: SpyNgModuleFactoryLoader;

// describe('AppComponent', () => {


//     // beforeEach(() => {
//     //     TestBed.configureTestingModule({
//     //         declarations: [
//     //             AppComponent
//     //         ],
//     //         imports: [
//     //             RouterTestingModule,
//     //             AppModule,
//     //             //AppModule
//     //         ],
//     //         schemas: [NO_ERRORS_SCHEMA]
//     //     });
//     // });


//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [
//                 AppComponent
//             ],
//             imports: [
//                 RouterTestingModule,
//                 AppModule,
//                 //AppModule
//             ],
//             schemas: [NO_ERRORS_SCHEMA]
//         }).compileComponents().then(() => {
//             fixture = TestBed.createComponent(AppComponent);
//             comp = fixture.componentInstance;
//             fixture.detectChanges();
//         });
//     }));

//     beforeEach(fakeAsync(() => {
//         createComponent();
//         loader = TestBed.get(NgModuleFactoryLoader);
//         loader.stubbedModules = { expected: WindowModule };
//         router.resetConfig([{ path: 'window', loadChildren: 'expected' }]);
//     }));

//     it('should array not null', function () {
//         //expect(comp.menus.lenth).toBeGreaterThanOrEqual(1);
//         console.log(fixture.nativeElement);
//     })

//     it('should enter the assertion', inject([Router], (router: Router) => {
//         //const spy = spyOn(router, 'navigate');

//         //comp.enterAMethodToCall(methodArguments);

//         //expect(spy.calls.mostRecent().args[0]).toEqual(['/']);
//         // expect(spy.calls.mostRecent().args[1].queryParams.paramName).toEqual('value');
//     }));
// });

// /** Wait a tick, then detect changes */
// function advance(): void {
//     tick();
//     fixture.detectChanges();
// }

// function createComponent() {
//     fixture = TestBed.createComponent(AppComponent);
//     comp = fixture.componentInstance;

//     const injector = fixture.debugElement.injector;
//     location = injector.get(Location);
//     router = injector.get(Router);
//     router.initialNavigation();
//     //   spyOn(injector.get(TwainService), 'getQuote')
//     //     .and.returnValue(Promise.resolve('Test Quote')); // fakes it

//     advance();

//     page = new Page();
// }

// class Page {
//     aboutLinkDe: DebugElement;
//     dashboardLinkDe: DebugElement;
//     heroesLinkDe: DebugElement;
//     recordedEvents: any[] = [];

//     // for debugging
//     comp: AppComponent;
//     location: SpyLocation;
//     router: Router;
//     fixture: ComponentFixture<AppComponent>;

//     expectEvents(pairs: any[]) {
//         const events = this.recordedEvents;
//         expect(events.length).toEqual(pairs.length, 'actual/expected events length mismatch');
//         for (let i = 0; i < events.length; ++i) {
//             expect((<any>events[i].constructor).name).toBe(pairs[i][0].name, 'unexpected event name');
//             expect((<any>events[i]).url).toBe(pairs[i][1], 'unexpected event url');
//         }
//     }

//     constructor() {
//         router.events.forEach(e => this.recordedEvents.push(e));
//         const links = fixture.debugElement.queryAll(By.directive(RouterLinkWithHref));
//         this.aboutLinkDe = links[2];
//         this.dashboardLinkDe = links[0];
//         this.heroesLinkDe = links[1];

//         // for debugging
//         this.comp = comp;
//         this.fixture = fixture;
//         this.router = router;
//     }
// }

