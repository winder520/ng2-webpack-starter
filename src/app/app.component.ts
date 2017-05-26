import { Component, OnInit } from '@angular/core';
import { Util } from '../lib/util/util';
let $ = require('jquery');
/**
 * 引入less的方式：
 * @Component({
 *   selector: 'app-root',
 *   templateUrl: './app.component.html',
 *   styles: [require('./app.component.less')]
 * })
 * 但是在使用ng-i18n的时候要报异常，所以改为 
 * 
 * require('./app.component.less');
 * @Component({
 *   selector: 'app-root',
 *   templateUrl: './app.component.html',
 *   styleUrls: ['./app.component.less']
 * })
 * 
 */


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    menus: any;
    currentContent = {};
    constructor() {

    }

    selectClickElement(event: any, el: HTMLElement) {
        // console.log(el);

        //console.log($('body'));
        //console.log(event);
    }

    logoutFn() {

    }

    selectItem() {

    }

    showMenuBut() {

    }

    openNotifyPanelFn() {

    }

    ngOnInit() { }

    logout(): void {
        Util.clearCookie();
    }
}
