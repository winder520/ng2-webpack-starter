import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';

import { SSO } from './lib/sso/sso';
import { Util } from './lib/util/util';


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
