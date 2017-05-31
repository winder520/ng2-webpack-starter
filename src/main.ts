import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';

import { SSO } from './lib/sso/sso';
import { Util } from './lib/util/util';
let serviceConfig = require('./configuration/service-configuration/service-configuration.json')
//import serviceConfig from './configuration/service-configuration/service-configuration.json';

//console.log(serviceConfig);

if (!Util.getCookie('AUTH')) {
  // Util.setCookie('AUTH','j%3A%7B%22userInfo%22%3A%22%257B%2522userId%2522%253A%2522http%253A%252F%252Fwww.kop.com%252Fontology%252Fplatform%252Fuser%2523winder%2540kopbit.com%2522%252C%2522nickName%2522%253A%2522winder%2522%252C%2522name%2522%253A%2522winder%2522%252C%2522userCode%2522%253A%2522winder%2540kopbit.com%2522%252C%2522orgNames%2522%253Anull%252C%2522responsibility%2522%253Anull%252C%2522dateTime%2522%253A%25222016-10-31%252010%253A26%253A20%2522%252C%2522password%2522%253Anull%252C%2522email%2522%253A%2522winder%2540kopbit.com%2522%252C%2522phoneNumber%2522%253A%2522%2522%252C%2522state%2522%253A1%252C%2522gender%2522%253A0%252C%2522portrait%2522%253A%2522%2522%252C%2522imUserName%2522%253A%2522%2522%252C%2522description%2522%253A%2522%2522%257D%22%7D')
  SSO.login(serviceConfig.casClientService, window.location.href);
}

//require('./styles.css');
if (process.env.ENV === 'production') {
  enableProdMode();
}
// getTranslationProviders().then(providers => {

//   platformBrowserDynamic().bootstrapModule(AppModule, { providers })
// })
platformBrowserDynamic().bootstrapModule(AppModule)
  // .then(success => console.log('Bootstrap success'))
  // .catch(err => console.error(err));
