import 'rxjs/add/observable/of';
import {Injectable} from '@angular/core';
import {Route, PreloadingStrategy} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PreloadSelectedModules implements PreloadingStrategy {
    preloadedModules: string[] = [];

    preload(route: Route, load: Function): Observable<any> {
        if (route.data && route.data['preload']) {
            this.preloadedModules.push(route.path);
            console.log('preload:' + route.path);
            return load();
        } else {
            return Observable.of(null);
        }
    }
}
