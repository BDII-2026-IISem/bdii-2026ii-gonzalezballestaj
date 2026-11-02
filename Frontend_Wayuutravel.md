# **WayuuTravel — Informe de ISS (Frontend Angular + PrimeNG)**

# ISS-00 — Requisitos previos

**Proyecto:** Wayuutravel — Experiencias Turísticas Responsables

**Capa:** Construcción del frontend

## 1. Narrativa

Para iniciar el desarrollo del frontend de mi proyecto Wayuutravel, primero debo preparar y verificar el entorno de trabajo donde construiré la interfaz web. El proyecto estará orientado a la gestión de clientes, viajeros, productos turísticos y ventas.

Para desarrollar esta interfaz utilizaré Angular como framework principal, TypeScript para la programación, PrimeNG para los componentes visuales y Tailwind CSS para la aplicación de estilos.

Actualmente, ya he creado la carpeta `Frontend` dentro de mi proyecto, pero todavía no he inicializado ningún proyecto Angular. Por esta razón, comenzaré verificando las herramientas necesarias para el desarrollo, sus versiones y la disponibilidad del backend desarrollado en Django.

## 2. Objetivo

Preparar el entorno de desarrollo del frontend, verificando que las herramientas necesarias estén correctamente instaladas y que la estructura inicial del proyecto se encuentre lista para comenzar su construcción.

## 3. Requisitos

- Tener creada la carpeta `Frontend`.

- Contar con Node.js y npm.

- Disponer de Angular CLI.

- Tener disponible el backend Django para futuras pruebas de comunicación con la API.

``` sql
pwd
ls -la

node --version
npm --version
ng version
```

![](images/clipboard-2198051771.png)

### 4.1 Verificación de Node.js, npm y Angular CLI

Una vez comprobada la ubicación y el estado de mi carpeta `Frontend`, procedí a verificar las herramientas principales que utilizaré para desarrollar la aplicación web.

Para ello, ejecuté los comandos `node --version`, `npm --version` y `ng version`, con los cuales pude identificar las versiones instaladas de Node.js, npm y Angular CLI.

Los resultados obtenidos fueron los siguientes:

- Node.js: versión 24.22.1.

- npm: versión 12.2.1.

- Angular CLI: versión 22.2.4.

Con estos resultados confirmé que cuento con las herramientas necesarias para iniciar la construcción del frontend. Sin embargo, durante la verificación identifiqué una diferencia en el entorno reportado por Angular CLI, ya que reconoce el sistema operativo como Windows (`win32 x64`), aunque estoy ejecutando los comandos desde Ubuntu WSL.

Por este motivo, antes de continuar con la inicialización del proyecto, realizaré una comprobación adicional de las rutas de instalación de las herramientas para garantizar que todas se ejecuten desde el mismo entorno.

``` sql
# Identificar las ubicaciones de las herramientas
which node
which npm
which ng

# Revisar todas las instalaciones disponibles
type -a node
type -a npm
type -a ng

# Comprobar el sistema operativo
uname -a

# Identificar el sistema que reconoce Node.js
node -p "process.platform"

# Consultar la ubicación global de npm
npm config get prefix
```

### ISS-01 · 1.1 Crear el proyecto Angular 22

Vamos a generar el proyecto directamente en la carpeta actual, con estas características:

- Angular 22.

- TypeScript y componentes standalone.

- CSS plano, porque Tailwind se instalará en el siguiente paso.

- Enrutamiento habilitado.

- Sin SSR, porque trabajaremos con una SPA.

- Sin crear otro repositorio Git.

Ejecuta este comando en Ubuntu WSL:

```         
ng new wayuutravel, \
  --directory . \
  --style=css \
  --routing \
  --ssr=false \
  --skip-git \
  --package-manager=npm \
  --defaults
```

**Instalamos Tailwind CSS 4 con PostCSS.**

En este paso integraremos Tailwind CSS para construir la interfaz de WayuuTravel mediante clases de utilidad, sin necesitar una configuración tradicional de `tailwind.config.js`.

### Paso 1. Instalar las dependencias

Desde Ubuntu WSL, ejecutamos:

```         
npm install tailwindcss @tailwindcss/postcss postcss
```

### Paso 2. Crear la configuración de PostCSS

Ejecuta:

```         
nano .postcssrc.json
```

Pega exactamente este contenido:

```         
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

Guarda con `Ctrl + O`, Enter y sal con `Ctrl + X`.

### Paso 3. Verificar la instalación

Ejecuta:

```         
npm ls tailwindcss @tailwindcss/postcss postcss --depth=0
```

Debemos comprobar que las tres dependencias estén instaladas y que no aparezcan errores.

![](images/clipboard-2561804692.png)

Instalé Tailwind CSS 4 junto con PostCSS y su plugin oficial para integrar un sistema de estilos basado en clases de utilidad en el frontend de WayuuTravel. También creé el archivo .postcssrc.json para configurar el procesamiento de los estilos y permitir que Angular reconozca Tailwind durante la compilación.

### Configurar los estilos globales

Ahora configuraremos `src/styles.css`, que será la hoja de estilos global de nuestra aplicación.

Paso 1. Abrimos el archivo:

``` css
nano src/styles.css
```

Paso 2. Reemplaza todo su contenido por:

``` css
@layer theme, base, primeng, utilities;

@import 'tailwindcss';
@import 'primeicons/primeicons.css';
```

Aunque PrimeIcons se instalará en el punto 1.4, dejamos preparado su import para mantener la estructura solicitada.

Configuré src/styles.css como la hoja de estilos global de WayuuTravel. Definí el orden de las capas theme, base, primeng y utilities para organizar la prioridad de los estilos. También incorporé las importaciones de Tailwind CSS y PrimeIcons, preparando la integración visual de los componentes que utilizaré en la aplicación.

**Instalar PrimeNG 22 con Aura.**

En este paso incorporaremos PrimeNG para utilizar componentes visuales como botones, tarjetas, etiquetas, mensajes y diálogos. El tema Aura proporcionará el diseño inicial de los componentes.

### Paso 1. Instalar las dependencias

Desde la carpeta `Frontend`, ejecutamos:

```         
 npm install primeng @primeuix/themes primeicons @angular/cdk
```

![](images/clipboard-3441073368.png)

Instalé PrimeNG, PrimeUIX Themes, PrimeIcons y Angular CDK en el frontend de WayuuTravel. Estas dependencias permitirán incorporar componentes visuales, temas personalizables e iconos en la aplicación. La instalación finalizó correctamente y no se reportaron vulnerabilidades de seguridad.

### Paso 2. Revisar la configuración actual

Antes de modificarla, necesitamos conocer el contenido de `app.config.ts` para conservar la configuración que Angular generó.

Ejecuta:

``` typescript
cat src/app/app.config.ts
```

Reemplaza todo su contenido por este código:

``` typescript
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { MessageService, ConfirmationService } from 'primeng/api';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

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
```

![](images/clipboard-2814826709.png)

Verifiqué la instalación de las dependencias de PrimeNG en WayuuTravel. Se instalaron PrimeNG 22.1.4, el tema Aura mediante \@primeuix/themes 3.1.0, PrimeIcons 8.0.2 y Angular CDK 22.2.5. Con estas dependencias preparé la base para construir la interfaz y utilizar los componentes visuales de PrimeNG.

###  Verificaremos la estructura actual

Desde la carpeta `Frontend`:

``` css
echo "===== ESTILOS GLOBALES ====="
cat src/styles.css

echo "===== COMPONENTE PRINCIPAL ====="
cat src/app/app.ts

echo "===== CONFIGURACIÓN DE RUTAS ====="
cat src/app/app.routes.ts

echo "===== PLANTILLA PRINCIPAL ====="
sed -n '1,35p' src/app/app.html

echo "===== CSS PRINCIPAL ====="
cat src/app/app.css

echo "===== PRUEBAS PRINCIPALES ====="
cat src/app/app.spec.ts
```

![](images/clipboard-132936582.png)

**Configuración de PrimeNG 22 con Aura.**

Ya tenemos las dependencias instaladas:

- PrimeNG `22.1.4`

- \@primeuix/themes `3.1.0`

- PrimeIcons `8.0.2`

- Angular CDK `22.2.5`

### Paso 3. Verificar `app.config.ts`

Ejecuta:

```         
cat src/app/app.config.ts
```

Configuré PrimeNG 22 en WayuuTravel utilizando el tema Aura. Activé los efectos ripple, establecí la variante outlined para los campos de entrada y configuré las opciones del modo oscuro y las capas CSS. Registré MessageService y ConfirmationService, amplié las opciones del enrutador e incorporé Angular Animations 22.2.4 para solucionar un error de dependencia durante la compilación. Finalmente, ejecuté ng build y ng serve, comprobando que el proyecto compilara correctamente y que el servidor de desarrollo iniciara sin errores.

![](images/clipboard-2040515547.png)

Abrimos:

```         
nano src/app/app.ts
```

Reemplaza todo por:

```         
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
```

Ejecutamos:

```         
nano src/app/app.html
```

Borra todo y pega:

```         
<main class="min-h-screen bg-slate-100 font-sans text-slate-900">  
<router-outlet /> </main>
```

Ejecutamos:

```         
nano src/app/app.spec.ts
```

Reemplazamos todo por:

```         
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
```

Reemplaza el contenido de `src/index.html` por este:

```         
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>WayuuTravel · Angular 22</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="description"
      content="WayuuTravel: experiencias turísticas responsables."
    />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
  </head>
  <body class="m-0 bg-slate-100 font-sans text-slate-900">
    <app-root></app-root>
  </body>
</html>
```

![](images/clipboard-2232955927.png)

**compilación de producción.**

```         
ng build --configuration production
```

**Compilación de producción exitosa.**

El bundle inicial quedó en 413.44 kB, por debajo del límite de advertencia de 500 kB. No se reportaron errores.

Ahora ejecuta las pruebas unitarias:

```         
ng test --watch=false
```

![](images/clipboard-251650512.png)

Verificación HTTP. En otra terminal de Ubuntu ejecutamos:

```         
curl -I http://localhost:39361/
```

salida:

``` sq
HTTP/1.1 200 OK
Vary: Origin
Content-Type: text/html
Cache-Control: no-cache
Date: Mon, 02 Nov 2026 23:13:15 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

Respuesta HTTP 200 OK. El servidor de WayuuTravel está respondiendo correctamente.
