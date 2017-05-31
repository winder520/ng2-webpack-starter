/*
 * Testing a Component with Router and Spy
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#routed-component-w-param
 */
import * as r from '@angular/router';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA, DebugElement, NgModuleFactoryLoader,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async, inject, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';


import { SpyLocation } from '@angular/common/testing';
import { Router, RouterLinkWithHref } from '@angular/router';
import { RouterTestingModule, SpyNgModuleFactoryLoader } from '@angular/router/testing';


import { AppModule } from './app.module';
import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';

import { RouterLinkStubDirective } from '../testing';
import { RouterOutletStubComponent } from '../testing';


let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let router: Router;
let location: SpyLocation;
let loader: SpyNgModuleFactoryLoader;

describe('AppComponent & TestModule', () => {
  beforeEach( async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        RouterLinkStubDirective, RouterOutletStubComponent
      ],
      schemas:[CUSTOM_ELEMENTS_SCHEMA]
    })

    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(AppComponent);
      comp    = fixture.componentInstance;
    });
  }));
  tests();
});


function tests() {
    let links: RouterLinkStubDirective[];
    let linkDes: DebugElement[];

    beforeEach(() => {
        // trigger initial data binding
        fixture.detectChanges();

        // find DebugElements with an attached RouterLinkStubDirective
        linkDes = fixture.debugElement
            .queryAll(By.directive(RouterLinkStubDirective));

        // get the attached link directive instances using the DebugElement injectors
        links = linkDes
            .map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
    });

    it('can instantiate it', () => {
        expect(comp).not.toBeNull();
    });

    // it('can get RouterLinks from template', () => {
    //     expect(links.length).toBe(3, 'should have 3 links');
    //     expect(links[0].linkParams).toBe('/dashboard', '1st link should go to Dashboard');
    //     expect(links[1].linkParams).toBe('/heroes', '1st link should go to Heroes');
    // });

    // it('can click Heroes link in template', () => {
    //     const heroesLinkDe = linkDes[1];
    //     const heroesLink = links[1];

    //     expect(heroesLink.navigatedTo).toBeNull('link should not have navigated yet');

    //     heroesLinkDe.triggerEventHandler('click', null);
    //     fixture.detectChanges();

    //     expect(heroesLink.navigatedTo).toBe('/heroes');
    // });
}
