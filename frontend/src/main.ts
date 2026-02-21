import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { importProvidersFrom } from '@angular/core';

const mergedConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers || [],
    provideAnimations(),
    importProvidersFrom(MatNativeDateModule)
  ]
};

bootstrapApplication(AppComponent, mergedConfig)
  .catch((err) => console.error(err));
