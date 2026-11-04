import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import { provideHttpClient } from '@angular/common/http';

import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling
} from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { MessageService, ConfirmationService } from 'primeng/api';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideHttpClient(),

    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),

    provideAnimationsAsync(),

    providePrimeNG({
      ripple: true,
      inputVariant: 'outlined',
        license: 'eyJpZCI6IjNhYzAzNmFlLWVjZmEtNDY5Zi05NmZkLTVlOTM4NTYzNzA5OCIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3OTI2ODc3ODQsImV4cCI6MTgyNDIyMzc4NH0.LPd-gI9YN8sPdni1YHpm0eThRUkA4j-pkuvM3rYtyav9i71fpVIjTBGVj4C8HCRyYdjjRm8qbRZboRysQhREBg',

      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng, utilities'
          }
        }
      }
    }),

    MessageService,
    ConfirmationService
  ]
};