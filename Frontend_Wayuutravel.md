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

### ISS-01A — Esqueleto Header / Aside / contenido / Footer

En esta actividad preparé la estructura visual inicial de la aplicación utilizando Angular 22 y su arquitectura basada en componentes standalone. Organicé la interfaz en cuatro regiones principales: Header, Aside, contenido y Footer.

Para ello, creé tres componentes de presentación dentro de la carpeta `layout/` y posteriormente los integré en el componente principal `App`. Configuré sus respectivas plantillas para mostrar la marca Wayuutravel, el menú de navegación, el área principal de contenido y el pie de página.

Durante esta implementación trabajé con componentes independientes, selectores e imports, comprendiendo cómo se relacionan los componentes hijos con el componente padre. Mantuve los estilos de los componentes vacíos y utilicé las clases de Tailwind CSS para organizar la distribución visual.

Finalmente, verifiqué la composición de las cuatro regiones, la adaptación de la interfaz a diferentes tamaños de pantalla, la ausencia de llamadas a la API y el correcto funcionamiento de la compilación y las pruebas unitarias.

**Paso 1.2 — Generar Header**

Desde la carpeta `Frontend`, ejecuta:

```         
ng generate component layout/header --skip-tests --defaults
```

**Ahora genera el componente `Aside`:**

```         
ng generate component layout/aside --skip-tests --defaults
```

**Ahora genera el último componente, `Footer`:**

```         
ng generate component layout/footer --skip-tests --defaults
```

![](images/clipboard-3968472944.png)

### Paso 1.3 — Configurar Header

Primero revisemos el archivo TypeScript generado:

```         
cat src/app/layout/header/header.ts
```

remplazamos por:

``` typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
  host: {
    class: 'block',
  },
})
export class Header {
  protected readonly title = 'WayuuTravel';
}
```

![](images/clipboard-102246711.png)

Ahora revisemos la plantilla:

```         
cat src/app/layout/header/header.html
```

remplazamos por:

``` html
cat > src/app/layout/header/header.html <<'EOF'
<header class="flex h-16 items-center border-b border-slate-200 bg-white px-6">
  <span class="truncate text-xl font-bold text-slate-900">
    {{ title }}
  </span>
</header>
EOF
```

![](images/clipboard-613996156.png)

Ahora revisemos el componente Aside.

```         
cat src/app/layout/aside/aside.ts
```

remplazamos por:

``` typescript
cat > src/app/layout/aside/aside.ts <<'EOF'
import { Component } from '@angular/core';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [],
  templateUrl: './aside.html',
  styleUrl: './aside.css',
  host: {
    class: 'block h-full',
  },
})
export class Aside {}
EOF
```

![](images/clipboard-3712676837.png)

Ahora ejecutamos:

```         
cat src/app/layout/aside/aside.html
```

y remplazamos por:

``` html
cat > src/app/layout/aside/aside.html <<'EOF'
<nav
  aria-label="Navegación principal"
  class="h-full bg-slate-900 px-5 py-6 text-white"
>
  <h2 class="mb-4 text-lg font-semibold">Menú de WayuuTravel</h2>

  <p class="text-sm text-slate-300">
    En la siguiente etapa se incorporará el menú interactivo.
  </p>
</nav>
EOF
```

![](images/clipboard-642493695.png)

Ahora vamos con el componente Footer.

```         
cat src/app/layout/footer/footer.ts
```

remplazamos por:

``` typescript
cat > src/app/layout/footer/footer.ts <<'EOF'
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  host: {
    class: 'block',
  },
})
export class Footer {}
EOF
```

![](images/clipboard-608874119.png)

![](images/clipboard-996532996.png)

![](images/clipboard-536005204.png)

![](images/clipboard-930391308.png)

![](images/clipboard-992182846.png)

Reemplaza todo el contenido de `src/app/app.spec.ts` con:

```         
cat > src/app/app.spec.ts <<'EOF'
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App - WayuuTravel', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display the header component', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-header')).toBeTruthy();
  });

  it('should display the WayuuTravel title in the header', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('WayuuTravel');
  });

  it('should display the aside component', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-aside')).toBeTruthy();
  });

  it('should display the main content', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const main = fixture.nativeElement.querySelector('main');

    expect(main).toBeTruthy();
    expect(main.textContent).toContain('Inicio');
    expect(main.textContent).toContain('Bienvenido a WayuuTravel.');
  });

  it('should display the footer component', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const footer = fixture.nativeElement.querySelector('app-footer');

    expect(footer).toBeTruthy();
    expect(footer.textContent).toContain(
      'Experiencias Turísticas Responsables',
    );
  });
});
EOF
```

### Ejecuta las pruebas

```         
ng test --watch=false
```

![](images/clipboard-4032596888.png)

+-----------------------------------+----------------------------------+
| Verificación                      | Resultado                        |
+===================================+==================================+
| Creación de App                   | PASS                             |
+-----------------------------------+----------------------------------+
| Header                            | PASS                             |
+-----------------------------------+----------------------------------+
| Título WayuuTravel                | PASS                             |
+-----------------------------------+----------------------------------+
| Aside                             | PASS                             |
+-----------------------------------+----------------------------------+
| Contenido principal               | PASS                             |
+-----------------------------------+----------------------------------+
| Footer                            | PASS                             |
+-----------------------------------+----------------------------------+

### Siguiente paso: revisar los estilos

La ISS-01A establece que los archivos CSS de los componentes deben permanecer vacíos, porque estamos utilizando Tailwind CSS.

Ejecuta:

``` css
wc -c src/app/app.css \
src/app/layout/header/header.css \
src/app/layout/aside/aside.css \
src/app/layout/footer/footer.css
```

![](images/clipboard-2885022466.png)

### Verificación visual

Inicia el servidor:

```         
ng serve
```

Abre en tu navegador la dirección que aparezca en la terminal, normalmente:

[`http://localhost:4200`](http://localhost:4200)

Comprueba lo siguiente:

1.  Header blanco con el título WayuuTravel.

2.  Aside oscuro a la izquierda.

3.  Contenido principal con «Inicio» y «Bienvenido a WayuuTravel».

4.  Footer en la parte inferior.

5.  Que no exista desplazamiento horizontal al reducir la ventana a 390 px.

![](images/clipboard-3274169640.png)

## ISS-01B — Menú PrimeNG y primera interacción

### Narrativa

En esta actividad inicié la implementación de un menú de navegación interactivo para WayuuTravel, con el propósito de mejorar la organización y la experiencia de uso de la plataforma. Para ello, preparé la integración de componentes de PrimeNG y Angular Signals, con los que podré gestionar la navegación local y el estado de los elementos de la interfaz.

También planteé la adaptación del menú lateral para dispositivos de escritorio y móviles, de manera que pueda mostrarse u ocultarse según el tamaño de la pantalla. Además, establecí que las opciones del menú permitirán cambiar dinámicamente el título del contenido principal, sin realizar todavía consultas al backend ni consumir servicios externos.

Con esta implementación busco dejar preparada la estructura visual e interactiva de WayuuTravel para incorporar posteriormente los módulos de paquetes turísticos, salidas, reservas y proveedores, manteniendo una separación clara entre los componentes de presentación y la lógica de la aplicación.

### Paso .1. Actualizar `aside.ts`

Abre el archivo:

``` typescript
code src/app/layout/aside/aside.ts
```

Reemplazamos todo el contenido por este código:

``` typescript

import { Component, input, output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-aside',
  imports: [PanelMenuModule],
  templateUrl: './aside.html',
  styleUrl: './aside.css',
  host: {
    class: 'block h-full',
  },
})
export class Aside {
  readonly appName = input('WayuuTravel');
  readonly items = input<MenuItem[]>([]);

  readonly navigated = output<void>();

  onNavigationClick(event: Event): void {
    const target = event.target as HTMLElement;

    if (target.closest('a, button, [role="button"]')) {
      this.navigated.emit();
    }
  }
}
```

![](images/clipboard-3901227326.png)

### Paso 1.2. Actualizar `aside.html`

Abre el archivo:

``` html
code src/app/layout/aside/aside.html
```

Reemplazamos todo el contenido por este código:

``` html
 
<div class="flex h-full flex-col border-r border-slate-200 bg-white text-slate-900">

  <!-- Identidad de WayuuTravel -->
  <div class="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
    <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-sm font-bold text-white">
      WT
    </div>

    <div class="min-w-0">
      <p class="truncate text-sm font-semibold text-slate-900">
        {{ appName() }}
      </p>

      <p class="text-[11px] uppercase tracking-wider text-slate-400">
        Gestión turística
      </p>
    </div>
  </div>

  <!-- Navegación principal -->
  <div class="flex-1 overflow-y-auto p-3">
    <nav
      aria-label="Navegación principal"
      (click)="onNavigationClick($event)"
    >
      <p-panelmenu
        [model]="items()"
        [multiple]="true"
      />
    </nav>
  </div>

</div>
```

![](images/clipboard-2116407845.png)

### Paso 1.3. Actualizar `header.ts`

Abre el archivo:

``` typescript
code src/app/layout/header/header.ts
```

Reemplaza todo su contenido por este código:

``` typescript

import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [ButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
  host: {
    class: 'block',
  },
})
export class Header {
  readonly appName = input('WayuuTravel');

  readonly menuRequested = output<void>();
}
 
```

![](images/clipboard-3736745505.png)

### Paso 1.4. Actualizar `header.html`

Ahora construiremos la parte visual del encabezado, incluyendo el botón que permitirá abrir o cerrar el menú lateral.

Abre el archivo:

``` html
code src/app/layout/header/header.html
```

Reemplaza todo su contenido por:

``` html

<header class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">

  <!-- Botón del menú -->
  <button
    pButton
    type="button"
    text
    rounded
    aria-label="Mostrar u ocultar el menú"
    (click)="menuRequested.emit()"
  >
    <i pButtonIcon class="pi pi-bars"></i>
  </button>

  <!-- Identidad de la aplicación -->
  <div class="min-w-0 flex-1">
    <p class="truncate text-sm font-semibold text-slate-900">
      {{ appName() }}
    </p>

    <p class="truncate text-xs text-slate-500">
      Experiencias turísticas responsables
    </p>
  </div>

</header>
```

![](images/clipboard-1553991091.png)

### Paso 1.5. Crear el componente Construir

Este componente será responsable de:

- Administrar las opciones del menú.

- Cambiar el título de la pantalla.

- Mostrar u ocultar el menú lateral en escritorio.

- Abrir el menú como Drawer en dispositivos móviles.

- Compartir el mismo componente `Aside` en ambas presentaciones.

Desde la terminal, ubicado en `Frontend`, ejecuta:

``` css
ng generate component features/construir --skip-tests --defaults
```

![](images/clipboard-2587223805.png)

### Paso 1.6. Crear el servicio auxiliar `media-query.ts`

Primero, creamos las carpetas necesarias:

``` sql
mkdir -p src/app/core/utils
```

Después, creamos el archivo:

``` typescript
code src/app/core/utils/media-query.ts
```

Pegamos este código:

``` typescript

import { DestroyRef, Signal, inject, signal } from '@angular/core';

export function watchMediaQuery(query: string): Signal<boolean> {
  const destroyRef = inject(DestroyRef);

  const media =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function'
      ? window.matchMedia(query)
      : null;

  const matches = signal(media?.matches ?? false);

  if (media) {
    const listener = (event: MediaQueryListEvent): void => {
      matches.set(event.matches);
    };

    media.addEventListener('change', listener);

    destroyRef.onDestroy(() => {
      media.removeEventListener('change', listener);
    });
  }

  return matches.asReadonly();
}
```

![](images/clipboard-3972922988.png)

### Paso 1.7. Configurar `construir.ts`

Ahora vamos a implementar la lógica principal de la interfaz de WayuuTravel utilizando Angular Signals y PrimeNG.

Abrimos el archivo:

``` typescript
code src/app/features/construir/construir.ts
```

Reemplazamos todo su contenido por este código:

``` typescript

import { Component, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DrawerModule } from 'primeng/drawer';

import { watchMediaQuery } from '../../core/utils/media-query';
import { Aside } from '../../layout/aside/aside';
import { Footer } from '../../layout/footer/footer';
import { Header } from '../../layout/header/header';

@Component({
  selector: 'app-construir',
  imports: [
    Aside,
    ButtonModule,
    CardModule,
    DrawerModule,
    Footer,
    Header,
  ],
  templateUrl: './construir.html',
  styleUrl: './construir.css',
  host: {
    class: 'block',
  },
})
export class Construir {
  private readonly isDesktop = watchMediaQuery('(min-width: 1024px)');

  readonly sidebarCollapsed = signal(false);
  readonly mobileOpen = signal(false);
  readonly title = signal('Inicio');

  readonly items: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      command: () => this.seleccionar('Inicio'),
    },
    {
      label: 'Paquetes',
      icon: 'pi pi-map',
      command: () => this.seleccionar('Paquetes'),
    },
    {
      label: 'Salidas',
      icon: 'pi pi-calendar',
      command: () => this.seleccionar('Salidas'),
    },
    {
      label: 'Reservas',
      icon: 'pi pi-ticket',
      command: () => this.seleccionar('Reservas'),
    },
    {
      label: 'Proveedores',
      icon: 'pi pi-users',
      command: () => this.seleccionar('Proveedores'),
    },
  ];

  protected onMenuToggle(): void {
    if (this.isDesktop()) {
      this.sidebarCollapsed.update((collapsed) => !collapsed);
      return;
    }

    this.mobileOpen.set(true);
  }

  protected seleccionar(titulo: string): void {
    this.title.set(titulo);
    this.mobileOpen.set(false);
  }
}
```

![](images/clipboard-2565196533.png)

### Paso 1.8. Construir la interfaz en `construir.html`

Ahora vamos a unir los componentes `Header`, `Aside` y `Footer` para formar la interfaz interactiva de WayuuTravel.

Abrimos el archivo:

``` html
code src/app/features/construir/construir.html
```

Reemplazamos todo su contenido por:

``` {.html .ht}

<div class="flex min-h-screen flex-col bg-slate-100">

  <!-- Encabezado -->
  <app-header (menuRequested)="onMenuToggle()" />

  <div class="flex flex-1">

    <!-- Menú lateral para escritorio -->
    @if (!sidebarCollapsed()) {
      <aside class="hidden w-72 shrink-0 lg:block">
        <app-aside
          [items]="items"
          (navigated)="mobileOpen.set(false)"
        />
      </aside>
    }

    <!-- Contenido principal -->
    <main id="contenido" class="min-w-0 flex-1 p-4 sm:p-6">

      <p-card class="block">
        <h1 class="text-2xl font-semibold text-slate-900">
          {{ title() }}
        </h1>

        <p class="mt-3 text-slate-600">
          Bienvenido a WayuuTravel. Selecciona una opción del menú
          para explorar la plataforma.
        </p>

        <p class="mt-2 text-sm text-slate-500">
          Esta pantalla utiliza datos locales. Los formularios y
          la conexión con la API Django se incorporarán después.
        </p>
      </p-card>

    </main>
  </div>

  <!-- Pie de página -->
  <app-footer />

</div>

<!-- Menú lateral para dispositivos móviles -->
<p-drawer
  [(visible)]="mobileOpen"
  header="Menú de WayuuTravel"
  position="left"
  styleClass="w-72"
>
  <app-aside
    [items]="items"
    (navigated)="mobileOpen.set(false)"
  />
</p-drawer>
```

![](images/clipboard-1094595431.png)

### Paso 1.9. Actualizar `app.ts`

Primero, el componente raíz debe dejar de importar directamente `Header`, `Aside` y `Footer`. Ahora se encargará únicamente de mostrar las páginas mediante `RouterOutlet`.

Abrimos el archivo:

``` typescript
code src/app/app.ts
```

Reemplaza todo su contenido por:

``` typescript

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  host: {
    class: 'block',
  },
})
export class App {}
```

![](images/clipboard-863972652.png)

### Paso 1.10. Actualizar `app.html`

Ahora vamos a simplificar la plantilla raíz para que Angular Router controle qué pantalla se muestra.

Abrios el archivo:

``` ht
code src/app/app.html
```

Reemplaza todo su contenido por:

``` ht
 <router-outlet />
```

### Paso 1.11. Configurar las rutas en `app.routes.ts`

Ahora registraremos el componente `Construir` utilizando Lazy Loading, para que Angular lo cargue únicamente cuando se necesite.

Abrimos el archivo:

``` typescript
 src/app/app.routes.ts
```

Reemplazamos todo su contenido por:

``` typescript

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'construir',
    loadComponent: () =>
      import('./features/construir/construir').then(
        (m) => m.Construir,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'construir',
  },
  {
    path: '**',
    redirectTo: 'construir',
  },
];
```

![](images/clipboard-1083577720.png)

### Paso 1.13. Actualizar las pruebas de `App`

Como ahora `App` utiliza `RouterOutlet`, debemos adaptar sus pruebas para verificar que el enrutador se renderice correctamente.

Abrimos:

``` typescript
 src/app/app.spec.ts
```

Reemplaza su contenido por:

``` typescript

import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App - WayuuTravel', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the router outlet', async () => {
    const fixture = TestBed.createComponent(App);

    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
```

![](images/clipboard-2753393789.png)

### Paso 1.14. Crear las pruebas de `Construir`

Ahora vamos a comprobar que el componente principal de WayuuTravel funcione correctamente: que cargue, muestre las cinco opciones del menú y actualice el título al seleccionar una opción.

Primero, crea el archivo:

``` typst
code src/app/features/construir/construir.spec.ts
```

Pegamos el siguiente contenido:

``` typescript

import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Construir } from './construir';

describe('Construir - WayuuTravel', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Construir],
      providers: [provideNoopAnimations()],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Construir);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display Inicio as the initial title', () => {
    const fixture = TestBed.createComponent(Construir);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Inicio');
  });

  it('should define five menu options', () => {
    const fixture = TestBed.createComponent(Construir);
    const component = fixture.componentInstance;

    expect(component.items.length).toBe(5);
  });

  it('should contain the WayuuTravel menu options', () => {
    const fixture = TestBed.createComponent(Construir);
    const component = fixture.componentInstance;

    const labels = component.items.map((item) => item.label);

    expect(labels).toEqual([
      'Inicio',
      'Paquetes',
      'Salidas',
      'Reservas',
      'Proveedores',
    ]);
  });

  it('should update the title when selecting an option', () => {
    const fixture = TestBed.createComponent(Construir);
    const component = fixture.componentInstance;

    component.seleccionar('Reservas');

    expect(component.title()).toBe('Reservas');
  });

  it('should close the mobile menu after selecting an option', () => {
    const fixture = TestBed.createComponent(Construir);
    const component = fixture.componentInstance;

    component.mobileOpen.set(true);
    component.seleccionar('Paquetes');

    expect(component.mobileOpen()).toBe(false);
  });
});
```

### Paso 1.15. Ejecutar las pruebas

Antes de continuar, vamos a comprobar que los componentes y sus dependencias estén correctamente integrados.

Desde la carpeta `Frontend`, ejecuta:

```         
ng test --watch=false
```

![](images/clipboard-531861876.png)

### Paso 1.16. Verificar los archivos de pruebas

Ejecuta este comando:

```         
find src/app -name "*.spec.ts"
```

### Paso 1.17. Crear `construir.spec.ts`

Ejecutamos:

``` typescript
src/app/features/construir/construir.spec.ts
```

Pega este contenido y guarda el archivo:

``` typescript

import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Construir } from './construir';

describe('Construir - WayuuTravel', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Construir],
      providers: [provideNoopAnimations()],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(Construir);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display Inicio as the initial title', () => {
    const fixture = TestBed.createComponent(Construir);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Inicio');
  });

  it('should define five menu options', () => {
    const fixture = TestBed.createComponent(Construir);

    expect(fixture.componentInstance.items.length).toBe(5);
  });

  it('should contain the correct menu options', () => {
    const fixture = TestBed.createComponent(Construir);

    const labels = fixture.componentInstance.items.map(
      (item) => item.label,
    );

    expect(labels).toEqual([
      'Inicio',
      'Paquetes',
      'Salidas',
      'Reservas',
      'Proveedores',
    ]);
  });

  it('should update the title when selecting an option', () => {
    const fixture = TestBed.createComponent(Construir);
    const component = fixture.componentInstance;
    const item = component.items.find(
      (option) => option.label === 'Reservas',
    );

    item?.command?.({
      originalEvent: new Event('click'),
      item,
    });

    expect(component.title()).toBe('Reservas');
  });

  it('should close the mobile menu after selecting an option', () => {
    const fixture = TestBed.createComponent(Construir);
    const component = fixture.componentInstance;
    const item = component.items.find(
      (option) => option.label === 'Paquetes',
    );

    component.mobileOpen.set(true);

    item?.command?.({
      originalEvent: new Event('click'),
      item,
    });

    expect(component.mobileOpen()).toBe(false);
  });
});
```

![![](images/clipboard-1353867175.png)](images/clipboard-3011452974.png)

![](images/clipboard-4152696527.png)

### ISS-02 — Configuración de entornos y preparación de la arquitectura frontend

Narrativa

Durante el desarrollo de WayuuTravel, configuré los entornos de ejecución de Angular para separar la configuración de desarrollo de la configuración de producción. Para ello, generé los archivos `environment.ts` y `environment.development.ts`, donde definí el nombre de la aplicación, la URL base de la API del backend y el indicador correspondiente a cada entorno.

Posteriormente, verifiqué la configuración de `angular.json` para comprobar que Angular reemplazara automáticamente el archivo de entorno durante las compilaciones. Confirmé que `ng serve` utiliza el entorno de desarrollo y que `ng build` utiliza el entorno de producción.

Finalmente, preparé la estructura de directorios que permitirá organizar los modelos de datos, servicios de comunicación HTTP, utilidades, componentes reutilizables y el contenedor principal de navegación. Esta organización servirá como base para integrar progresivamente el frontend con los servicios REST del backend de WayuuTravel.

El siguiente paso es crear las carpetas de la arquitectura frontend. Ejecutamos desde `Frontend`:

``` sql
mkdir -p src/app/core/{models,services,utils} src/app/shared/ui/{status-tag,page-header,empty-state} src/app/layout/shell
```

Verificar la estructura creada.

Ejecutamos:

```         
tree src/app/core src/app/shared/ui src/app/layout -L 3
```

salida:

``` sql
src/app/core
├── models
├── services
└── utils
    └── media-query.ts
src/app/shared/ui
├── empty-state
├── page-header
└── status-tag
src/app/layout
├── aside
│   ├── aside.css
│   ├── aside.html
│   └── aside.ts
├── footer
│   ├── footer.css
│   ├── footer.html
│   └── footer.ts
├── header
│   ├── header.css
│   ├── header.html
│   └── header.ts
└── shell
```

En `src/app/core/models/client.model.ts`, pegamos este contenido:

``` typescript
export type RecordStatus = 'active' | 'inactive';

export interface Client {
  id: number;
  documentType: string;
  documentNumber: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateClient = Omit<
  Client,
  'id' | 'status' | 'createdAt' | 'updatedAt'
>;

export type UpdateClient = Partial<CreateClient>;
```

![](images/clipboard-498840930.png)

### Crear `client.model.ts`

Ejecutamos:

``` typescript
code src/app/core/models/client.model.ts
```

Pegamos este código:

``` typescript
export type RecordStatus = 'active' | 'inactive';

export interface Client {
  id: number;
  documentType: string;
  documentNumber: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateClient = Omit<
  Client,
  'id' | 'status' | 'createdAt' | 'updatedAt'
>;

export type UpdateClient = Partial<CreateClient>;
```

![](images/clipboard-4044438343.png)

## Crear package.model.ts

Abrimos el archivo:

``` typescript

code src/app/core/models/package.model.ts
```

Pegamos el siguiente contenido:

``` typescript
import type { RecordStatus } from './client.model';

export interface Package {
  id: number;
  name: string;
  description: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreatePackage = Pick<
  Package,
  'name' | 'description'
>;

export type UpdatePackage = Partial<CreatePackage>;
```

![](images/clipboard-2947314431.png)

### Crear `departure.model.ts`

Desde la terminal, ejecutamos:

``` typescript
code src/app/core/models/departure.model.ts
```

Pegamos este código:

``` typescript
import type { RecordStatus } from './client.model';

export interface Departure {
  id: number;
  name: string;
  description: string | null;
  package: number;
  departureDate: string;
  capacity: number;
  availableCapacity: number;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateDeparture = Pick<
  Departure,
  | 'name'
  | 'description'
  | 'package'
  | 'departureDate'
  | 'capacity'
  | 'availableCapacity'
>;

export type UpdateDeparture = Partial<CreateDeparture>;
```

![](images/clipboard-5516571.png)

### Crear `supplier.model.ts`

Este modelo representa a los proveedores que ofrecen servicios para los paquetes turísticos.

Ejecutamos:

``` typescript
code src/app/core/models/supplier.model.ts
```

Pegamos el siguiente código:

``` typescript
import type { RecordStatus } from './client.model';

export interface Supplier {
  id: number;
  nit: string;
  razonSocial: string;
  phone: string | null;
  email: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateSupplier = Pick<
  Supplier,
  'nit' | 'razonSocial' | 'phone' | 'email'
>;

export type UpdateSupplier = Partial<CreateSupplier>;
```

![](images/clipboard-2034121553.png)

### Crear `included-service.model.ts`

Este modelo representa los servicios incluidos en cada paquete turístico y el proveedor que los ofrece.

Ejecutamos:

``` typescript
code src/app/core/models/included-service.model.ts
```

Pegamos este código:

``` typescript
import type { RecordStatus } from './client.model';

export interface IncludedService {
  id: number;
  package: number;
  supplier: number;
  relationData: Record<string, unknown> | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateIncludedService = Pick<
  IncludedService,
  'package' | 'supplier' | 'relationData'
>;

export type UpdateIncludedService = Partial<CreateIncludedService>;
```

![](images/clipboard-2058455164.png)

### Crear `traveler.model.ts`

Este modelo representa a los viajeros registrados en WayuuTravel.

Ejecutamos:

``` typescript
code src/app/core/models/traveler.model.ts
```

Pegamos el siguiente código:

``` typescript
import type { RecordStatus } from './client.model';

export interface Traveler {
  id: number;
  name: string;
  description: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateTraveler = Pick<
  Traveler,
  'name' | 'description'
>;

export type UpdateTraveler = Partial<CreateTraveler>;
```

![](images/clipboard-1546816963.png)

### Crear `booking.model.ts`

Este modelo representa las reservas de paquetes turísticos realizadas por los clientes.

Ejecutamos:

``` typescript
code src/app/core/models/booking.model.ts
```

Pegamos el siguiente código:

``` typescript
import type { RecordStatus } from './client.model';

export interface Booking {
  id: number;
  client: number;
  departure: number;
  traveler: number;
  startDate: string;
  endDate: string;
  observations: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateBooking = Pick<
  Booking,
  | 'client'
  | 'departure'
  | 'traveler'
  | 'startDate'
  | 'endDate'
  | 'observations'
>;

export type UpdateBooking = Partial<CreateBooking>;
```

![](images/clipboard-3055980989.png)

### Crear `payment.model.ts`

Este modelo representa los pagos asociados a las reservas turísticas.

Ejecutamos:

``` typescript
code src/app/core/models/payment.model.ts
```

Pegamos el siguiente código:

``` typescript
import type { RecordStatus } from './client.model';

export interface Payment {
  id: number;
  booking: number;
  referenceType: string;
  method: string;
  amount: string;
  paymentDate: string;
  status: RecordStatus;
}

export interface CreateBookingPayment {
  referenceType: string;
  method: string;
  amount: number;
  paymentDate: string;
}

export type CreatePayment = Omit<
  Payment,
  'id' | 'status'
>;

export type UpdatePayment = Partial<
  Omit<Payment, 'id' | 'status' | 'booking'>
>;
```

![](images/clipboard-1321837013.png)

### Crear `cancellation.model.ts`

Este modelo representa las cancelaciones de reservas turísticas.

Ejecutamos:

``` typescript
code src/app/core/models/cancellation.model.ts
```

Pegamos el siguiente código:

``` typescript
import type { RecordStatus } from './client.model';

export interface Cancellation {
  id: number;
  booking: number;
  name: string;
  descriptions: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateCancellation = Pick<
  Cancellation,
  'booking' | 'name' | 'descriptions'
>;

export type UpdateCancellation = Partial<CreateCancellation>;
```

![](images/clipboard-3145438522.png)

### Crear `voucher.model.ts`

Este será el último modelo de las entidades principales de WayuuTravel. Representa los comprobantes asociados a las reservas.

Ejecutamos:

``` typescript
code src/app/core/models/voucher.model.ts
```

Pegamos el siguiente código:

``` typescript
import type { RecordStatus } from './client.model';

export interface Voucher {
  id: number;
  booking: number;
  name: string;
  descriptions: string | null;
  status: RecordStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateVoucher = Pick<
  Voucher,
  'booking' | 'name' | 'descriptions'
>;

export type UpdateVoucher = Partial<CreateVoucher>;
```

![](images/clipboard-1198934543.png)

### Agregar HttpClient

Abrimos el archivo:

``` typescript
code src/app/app.config.ts
```

y remplazamos por:

``` typescript
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

### Crear el servicio de notificaciones

Vamos a centralizar los mensajes de éxito, error, advertencia e información utilizando PrimeNG `MessageService`.

Abrimos:

``` typescript
code src/app/core/services/notification.service.ts
```

Pegamos este código:

``` typescript
import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly messageService = inject(MessageService);

  success(message: string, title = 'Éxito'): void {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: message
    });
  }

  error(message: string, title = 'Error'): void {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: message
    });
  }

  warning(message: string, title = 'Advertencia'): void {
    this.messageService.add({
      severity: 'warn',
      summary: title,
      detail: message
    });
  }

  info(message: string, title = 'Información'): void {
    this.messageService.add({
      severity: 'info',
      summary: title,
      detail: message
    });
  }

  clear(): void {
    this.messageService.clear();
  }
}
```

![](images/clipboard-2068951112.png)

### Crear `toApiMessage.ts`

Esta función permitirá convertir las respuestas de error de Django REST Framework en mensajes que podamos mostrar al usuario.

Abrimos el archivo:

``` typescript
code src/app/core/utils/to-api-message.ts
```

Pegamos el siguiente código:

``` typescript
export function toApiMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error !== 'object' || error === null) {
    return 'Ha ocurrido un error inesperado.';
  }

  const data = error as Record<string, unknown>;

  if (typeof data['detail'] === 'string') {
    return data['detail'];
  }

  if (typeof data['message'] === 'string') {
    return data['message'];
  }

  const messages = Object.values(data)
    .flatMap((value) => {
      if (typeof value === 'string') {
        return [value];
      }

      if (Array.isArray(value)) {
        return value.filter(
          (item): item is string => typeof item === 'string'
        );
      }

      return [];
    });

  return messages.length > 0
    ? messages.join(' ')
    : 'Ha ocurrido un error inesperado.';
}
```

![](images/clipboard-1110912801.png)

### Crear `filter-rows.ts`

Esta utilidad permitirá filtrar registros de tablas mediante un texto de búsqueda. La utilizaremos posteriormente en listados de clientes, paquetes, proveedores y reservas.

Abrimos:

``` typescript
code src/app/core/utils/filter-rows.ts
```

Pegamos este código:

``` typescript
export function filterRows<T>(
  rows: T[],
  searchTerm: string,
  fields?: (keyof T)[]
): T[] {
  const term = searchTerm.trim().toLowerCase();

  if (!term) {
    return rows;
  }

  return rows.filter((row) => {
    const values = fields
      ? fields.map((field) => row[field])
      : Object.values(row as Record<string, unknown>);

    return values.some((value) =>
      String(value ?? '').toLowerCase().includes(term)
    );
  });
}
```

![](images/clipboard-792990978.png)

### Crear `client.service.ts`

Este servicio permitirá consultar, registrar, actualizar y eliminar clientes mediante la API de Django.

Abrimos:

``` typescript
code src/app/core/services/client.service.ts
```

Pegamos este código:

``` typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Client,
  CreateClient,
  UpdateClient
} from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/clients/`;

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}${id}/`);
  }

  create(data: CreateClient): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, data);
  }

  update(id: number, data: UpdateClient): Observable<Client> {
    return this.http.patch<Client>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
```

![](images/clipboard-1718844779.png)

### Crear `package.service.ts`

Este servicio permitirá consultar, registrar, actualizar y eliminar paquetes turísticos, además de consultar los paquetes disponibles.

Abrimos:

``` typescript
code src/app/core/services/package.service.ts
```

Pegamos este código:

``` typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Package,
  CreatePackage,
  UpdatePackage
} from '../models/package.model';

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/product/packages/`;

  getAll(): Observable<Package[]> {
    return this.http.get<Package[]>(this.apiUrl);
  }

  getAvailable(): Observable<Package[]> {
    return this.http.get<Package[]>(`${this.apiUrl}available/`);
  }

  getById(id: number): Observable<Package> {
    return this.http.get<Package>(`${this.apiUrl}${id}/`);
  }

  create(data: CreatePackage): Observable<Package> {
    return this.http.post<Package>(this.apiUrl, data);
  }

  update(id: number, data: UpdatePackage): Observable<Package> {
    return this.http.patch<Package>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
```

![](images/clipboard-560105827.png)

### Crear `departure.service.ts`

Este servicio permitirá gestionar las salidas turísticas, consultar sus fechas, capacidades y paquetes asociados.

Abrimos:

``` typescript
code src/app/core/services/departure.service.ts
```

Pegamos este código:

``` typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Departure,
  CreateDeparture,
  UpdateDeparture
} from '../models/departure.model';

@Injectable({
  providedIn: 'root'
})
export class DepartureService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/product/departures/`;

  getAll(): Observable<Departure[]> {
    return this.http.get<Departure[]>(this.apiUrl);
  }

  getById(id: number): Observable<Departure> {
    return this.http.get<Departure>(`${this.apiUrl}${id}/`);
  }

  create(data: CreateDeparture): Observable<Departure> {
    return this.http.post<Departure>(this.apiUrl, data);
  }

  update(id: number, data: UpdateDeparture): Observable<Departure> {
    return this.http.patch<Departure>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
```

![](images/clipboard-1347854059.png)

### Crear `supplier.service.ts`

Este servicio permitirá consultar, registrar, actualizar y eliminar proveedores turísticos.

Abrimos:

``` typescript
code src/app/core/services/supplier.service.ts
```

Pegamos este código:

``` typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Supplier,
  CreateSupplier,
  UpdateSupplier
} from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/product/suppliers/`;

  getAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  getById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}${id}/`);
  }

  create(data: CreateSupplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, data);
  }

  update(id: number, data: UpdateSupplier): Observable<Supplier> {
    return this.http.patch<Supplier>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
} 
```

![](images/clipboard-2705613149.png)

### Crear `included-service.service.ts`

Este servicio permitirá gestionar los servicios incluidos en los paquetes turísticos y consultar sus proveedores asociados.

Abrimos:

``` typescript
code src/app/core/services/included-service.service.ts
```

Pegamos este código:

``` typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  IncludedService,
  CreateIncludedService,
  UpdateIncludedService
} from '../models/included-service.model';

@Injectable({
  providedIn: 'root'
})
export class IncludedServiceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/product/included-services/`;

  getAll(): Observable<IncludedService[]> {
    return this.http.get<IncludedService[]>(this.apiUrl);
  }

  getById(id: number): Observable<IncludedService> {
    return this.http.get<IncludedService>(`${this.apiUrl}${id}/`);
  }

  create(data: CreateIncludedService): Observable<IncludedService> {
    return this.http.post<IncludedService>(this.apiUrl, data);
  }

  update(id: number, data: UpdateIncludedService): Observable<IncludedService> {
    return this.http.patch<IncludedService>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
```

![](images/clipboard-1590828458.png)

### Crear `booking.service.ts`

Este servicio permitirá consultar y gestionar reservas turísticas, incluyendo el registro especial de reservas con sus pagos.

Abrimos:

``` typescript
code src/app/core/services/booking.service.ts
```

Pegamos este código:

``` typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Booking,
  CreateBooking,
  UpdateBooking
} from '../models/booking.model';
import { CreateBookingPayment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/sale/bookings/`;

  getAll(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  getById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}${id}/`);
  }

  create(data: CreateBooking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, data);
  }

  register(
    data: CreateBooking & { payments: CreateBookingPayment[] }
  ): Observable<Booking> {
    return this.http.post<Booking>(
      `${this.apiUrl}register/`,
      data
    );
  }

  update(id: number, data: UpdateBooking): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
```

![](images/clipboard-285473363.png)

### Crear `payment.service.ts`

Este servicio permitirá consultar, registrar, actualizar y eliminar los pagos asociados a las reservas.

Abrimos:

``` typescript
code src/app/core/services/payment.service.ts
```

Pegamos este código:

``` typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Payment,
  CreatePayment,
  UpdatePayment
} from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/sale/payments/`;

  getAll(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  getById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}${id}/`);
  }

  create(data: CreatePayment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, data);
  }

  update(id: number, data: UpdatePayment): Observable<Payment> {
    return this.http.patch<Payment>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
```

![](images/clipboard-1576358567.png)

### Crear `cancellation.service.ts`

Este servicio permitirá consultar, registrar, actualizar y eliminar cancelaciones de reservas.

Abrimos:

``` typescript
code src/app/core/services/cancellation.service.ts
```

Pegamos este código:

``` typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Cancellation,
  CreateCancellation,
  UpdateCancellation
} from '../models/cancellation.model';

@Injectable({
  providedIn: 'root'
})
export class CancellationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/sale/cancellations/`;

  getAll(): Observable<Cancellation[]> {
    return this.http.get<Cancellation[]>(this.apiUrl);
  }

  getById(id: number): Observable<Cancellation> {
    return this.http.get<Cancellation>(`${this.apiUrl}${id}/`);
  }

  create(data: CreateCancellation): Observable<Cancellation> {
    return this.http.post<Cancellation>(this.apiUrl, data);
  }

  update(id: number, data: UpdateCancellation): Observable<Cancellation> {
    return this.http.patch<Cancellation>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
```

![](images/clipboard-893013362.png)

### Crear `voucher.service.ts`

Este servicio permitirá consultar, registrar, actualizar y eliminar comprobantes asociados a las reservas.

Abrimos:

``` typescript
code src/app/core/services/voucher.service.ts
```

Pegamos este código:

``` typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Voucher,
  CreateVoucher,
  UpdateVoucher
} from '../models/voucher.model';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/sale/vouchers/`;

  getAll(): Observable<Voucher[]> {
    return this.http.get<Voucher[]>(this.apiUrl);
  }

  getById(id: number): Observable<Voucher> {
    return this.http.get<Voucher>(`${this.apiUrl}${id}/`);
  }

  create(data: CreateVoucher): Observable<Voucher> {
    return this.http.post<Voucher>(this.apiUrl, data);
  }

  update(id: number, data: UpdateVoucher): Observable<Voucher> {
    return this.http.patch<Voucher>(`${this.apiUrl}${id}/`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
} 
```

![](images/clipboard-1120612251.png)

### Crear `shell`

Este componente será la estructura principal de navegación de WayuuTravel. Integrará el Header, Aside, contenido de las páginas y Footer.

Abrimos:

``` typescript
code src/app/layout/shell/shell.ts
```

Antes de escribir el código, necesito revisar cómo están nombrados tus componentes actuales para integrarlos correctamente.

Ejecutamos:

``` typescript
tree src/app/layout -L 3
```

salida:

``` sql

src/app/layout
├── aside
│   ├── aside.css
│   ├── aside.html
│   └── aside.ts
├── footer
│   ├── footer.css
│   ├── footer.html
│   └── footer.ts
├── header
│   ├── header.css
│   ├── header.html
│   └── header.ts
└── shell
```

### Crear `shell.ts`

Este componente será el contenedor principal de WayuuTravel y administrará la navegación lateral.

Abrimos:

``` typescript
code src/app/layout/shell/shell.ts
```

Pegamos este código:

``` typescript
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { Header } from '../header/header';
import { Aside } from '../aside/aside';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
    Aside,
    Footer
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.css'
})
export class Shell {
  readonly menuOpen = signal(true);

  readonly menuItems: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: '/construir'
    }
  ];

  toggleMenu(): void {
    this.menuOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
```

![](images/clipboard-1626491793.png)

### Crear `shell.html`

Esta plantilla organizará el Header, el menú lateral, el contenido de navegación y el Footer.

Abrimos:

``` html
code src/app/layout/shell/shell.html
```

Pegamos este código:

``` html
<div class="flex min-h-screen flex-col bg-slate-50">

  <app-header
    appName="WayuuTravel"
    (menuRequested)="toggleMenu()"
  />

  <div class="flex flex-1 overflow-hidden">

    @if (menuOpen()) {
      <aside class="w-64 shrink-0">
        <app-aside
          appName="WayuuTravel"
          [items]="menuItems"
          (navigated)="closeMenu()"
        />
      </aside>
    }

    <main class="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
      <router-outlet />
    </main>

  </div>

  <app-footer />

</div>
```

![](images/clipboard-38994574.png)

### Crear `shell.css`

Este archivo establecerá los estilos básicos del contenedor principal.

Abrimos:

``` css
code src/app/layout/shell/shell.css
```

Pegamos este código:

``` css
:host {
  display: block;
  min-height: 100vh;
}
```

![](images/clipboard-1055776708.png)

### Configurar `app.routes.ts`

Ahora conectaremos el Shell con las rutas de la aplicación. Así, las páginas se mostrarán dentro de la estructura que acabamos de crear.

Abrimos:

``` typescript
code src/app/app.routes.ts
```

Reemplazamos todo el contenido por:

``` typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell').then((m) => m.Shell),

    children: [
      {
        path: 'construir',
        loadComponent: () =>
          import('./features/construir/construir').then(
            (m) => m.Construir
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'construir',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'construir',
  },
];
```

![ ](images/clipboard-83191985.png)

###  Crear `status-tag.ts`

Abrimos:

``` typescript
code src/app/shared/ui/status-tag/status-tag.ts
```

Pegamos este código:

``` typescript
import { Component, computed, input } from '@angular/core';
import { TagModule } from 'primeng/tag';

import { RecordStatus } from '../../../core/models/client.model';

@Component({
  selector: 'app-status-tag',
  standalone: true,
  imports: [TagModule],
  templateUrl: './status-tag.html',
  styleUrl: './status-tag.css',
})
export class StatusTag {
  readonly status = input<RecordStatus>('active');

  readonly label = computed(() =>
    this.status() === 'active' ? 'Activo' : 'Inactivo'
  );

  readonly severity = computed(() =>
    this.status() === 'active' ? 'success' : 'danger'
  );
}
```

![](images/clipboard-3380698627.png)

### Crear `status-tag.html`

Abrimos:

``` html
code src/app/shared/ui/status-tag/status-tag.html
```

Pegamos:

``` html
<p-tag
  [value]="label()"
  [severity]="severity()"
  [rounded]="true"
/>
```

![](images/clipboard-2714702057.png)

### Crear `status-tag.css`

Abrimos:

``` css
code src/app/shared/ui/status-tag/status-tag.css
```

Pegamos:

``` css
:host {
  display: inline-flex;
  align-items: center;
}
```

![](images/clipboard-3311800244.png)

###  Crear `page-header.ts`

Este componente permitirá reutilizar los encabezados de las diferentes páginas de WayuuTravel.

Abrimos:

``` typescript
code src/app/shared/ui/page-header/page-header.ts
```

Pegamos:

``` typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly description = input('');
}
```

![](images/clipboard-3895700376.png)

### Crear `page-header.html`

Abrimos:

``` html
code src/app/shared/ui/page-header/page-header.html
```

Pegamos:

``` html
<header class="mb-6">
  <h1 class="text-2xl font-bold tracking-tight text-slate-900">
    {{ title() }}
  </h1>

  @if (description()) {
    <p class="mt-2 text-sm leading-6 text-slate-600">
      {{ description() }}
    </p>
  }
</header>
```

![](images/clipboard-970505526.png)

### Crear `page-header.css`

Abrimos:

``` css
code src/app/shared/ui/page-header/page-header.css
```

Pegamos:

``` css
:host {
  display: block;
  width: 100%;
}
```

![](images/clipboard-1184108747.png)

### Crear `empty-state.ts`

Este componente permitirá mostrar mensajes cuando una sección todavía no tenga registros o resultados.

Abrimos:

``` typescript
code src/app/shared/ui/empty-state/empty-state.ts
```

Pegamos:

``` typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {
  readonly title = input('No hay información disponible');
  readonly description = input(
    'Todavía no existen registros para mostrar.'
  );
  readonly icon = input('pi pi-inbox');
}
```

![](images/clipboard-3270719092.png)

### Crear `empty-state.html`

Abrimos:

``` html
code src/app/shared/ui/empty-state/empty-state.html
```

Pegamos:

``` html
<div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
  <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50">
    <i [class]="icon() + ' text-2xl text-teal-700'" aria-hidden="true"></i>
  </div>

  <h3 class="text-lg font-semibold text-slate-900">
    {{ title() }}
  </h3>

  <p class="mt-2 max-w-md text-sm leading-6 text-slate-500">
    {{ description() }}
  </p>
</div>
```

![](images/clipboard-2729294514.png)

### Crear `empty-state.css`

Abrimos:

``` css
code src/app/shared/ui/empty-state/empty-state.css
```

Pegamos:

``` css
:host {
  display: block;
  width: 100%;
}
```

![](images/clipboard-1140433996.png)

###  Modificar `app.ts`

Abrimos:

``` typescript
code src/app/app.ts
```

Reemplazamos todo el contenido por:

``` typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ToastModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  host: {
    class: 'block',
  },
})
export class App {}
```

![](images/clipboard-3654237622.png)

### Modificar `app.html`

Abrimos:

``` html
code src/app/app.html
```

Reemplazamos su contenido por:

``` html
<p-toast
  position="top-right"
  [life]="4000"
/>

<router-outlet />
```

![](images/clipboard-1594393347.png)

### Verificar la compilación

Vamos a comprobar que los componentes reutilizables y las notificaciones estén correctamente configurados.

Desde la carpeta `Frontend`, ejecuta:

1\. Verificar TypeScript:

``` typescript
npx tsc --noEmit
```

2\. Compilar Angular:

``` sql
npx ng build
```

![](images/clipboard-3567261494.png)

### Crear el componente de páginas placeholder

Usaremos un componente reutilizable para representar las secciones que todavía no tienen funcionalidades.

Primero creamos su carpeta:

``` sql
mkdir -p src/app/features/placeholder
```

Después abrimos:

``` typescript
code src/app/features/placeholder/placeholder.ts
```

![](images/clipboard-3491519038.png)

### Crear `placeholder.html`

Abrimos:

``` html
code src/app/features/placeholder/placeholder.html
```

Pegamos:

``` html
<app-page-header
  [title]="title()"
  [description]="description()"
/>

<app-empty-state
  title="Sección en construcción"
  description="Esta funcionalidad estará disponible en una próxima etapa del desarrollo de WayuuTravel."
  icon="pi pi-wrench"
/>
```

![](images/clipboard-2163432225.png)

### Crear `placeholder.css`

Abrimos:

``` css
code src/app/features/placeholder/placeholder.css
```

Pegamos:

``` css
:host {
  display: block;
  width: 100%;
}
```

![](images/clipboard-1292241657.png)

###  Configurar las rutas placeholder

Ahora conectaremos las secciones de WayuuTravel con el componente `Placeholder`. Cada ruta tendrá su propio título y descripción.

Abrimos:

``` typescript
code src/app/app.routes.ts
```

Reemplazamos todo el contenido por:

``` typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/shell/shell').then((m) => m.Shell),

    children: [
      {
        path: 'construir',
        loadComponent: () =>
          import('./features/construir/construir').then(
            (m) => m.Construir
          ),
      },
      {
        path: 'clientes',
        loadComponent: () =>
          import('./features/placeholder/placeholder').then(
            (m) => m.Placeholder
          ),
        data: {
          title: 'Clientes',
          description: 'Gestión de los clientes de WayuuTravel.',
        },
      },
      {
        path: 'paquetes',
        loadComponent: () =>
          import('./features/placeholder/placeholder').then(
            (m) => m.Placeholder
          ),
        data: {
          title: 'Paquetes turísticos',
          description: 'Administración de los paquetes turísticos.',
        },
      },
      {
        path: 'salidas',
        loadComponent: () =>
          import('./features/placeholder/placeholder').then(
            (m) => m.Placeholder
          ),
        data: {
          title: 'Salidas',
          description: 'Gestión de las salidas y fechas de los paquetes.',
        },
      },
      {
        path: 'proveedores',
        loadComponent: () =>
          import('./features/placeholder/placeholder').then(
            (m) => m.Placeholder
          ),
        data: {
          title: 'Proveedores',
          description: 'Administración de los proveedores turísticos.',
        },
      },
      {
        path: 'reservas',
        loadComponent: () =>
          import('./features/placeholder/placeholder').then(
            (m) => m.Placeholder
          ),
        data: {
          title: 'Reservas',
          description: 'Gestión de las reservas de los viajeros.',
        },
      },
      {
        path: 'pagos',
        loadComponent: () =>
          import('./features/placeholder/placeholder').then(
            (m) => m.Placeholder
          ),
        data: {
          title: 'Pagos',
          description: 'Consulta y gestión de los pagos registrados.',
        },
      },
      {
        path: 'cancelaciones',
        loadComponent: () =>
          import('./features/placeholder/placeholder').then(
            (m) => m.Placeholder
          ),
        data: {
          title: 'Cancelaciones',
          description: 'Administración de las cancelaciones de reservas.',
        },
      },
      {
        path: 'comprobantes',
        loadComponent: () =>
          import('./features/placeholder/placeholder').then(
            (m) => m.Placeholder
          ),
        data: {
          title: 'Comprobantes',
          description: 'Consulta de los comprobantes de las reservas.',
        },
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'construir',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'construir',
  },
];
```

![](images/clipboard-1919471325.png)

### Conectar el menú lateral con las rutas

Ahora agregaremos todas las secciones de WayuuTravel al menú lateral para poder navegar entre ellas.

Abrimos:

``` typescript
code src/app/layout/shell/shell.ts
```

Reemplazamos el contenido por:

``` typescript
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { Header } from '../header/header';
import { Aside } from '../aside/aside';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
    Aside,
    Footer
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.css'
})
export class Shell {
  readonly menuOpen = signal(true);

  readonly menuItems: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: '/construir'
    },
    {
      separator: true
    },
    {
      label: 'Gestión turística',
      items: [
        {
          label: 'Clientes',
          icon: 'pi pi-users',
          routerLink: '/clientes'
        },
        {
          label: 'Paquetes turísticos',
          icon: 'pi pi-map',
          routerLink: '/paquetes'
        },
        {
          label: 'Salidas',
          icon: 'pi pi-calendar',
          routerLink: '/salidas'
        },
        {
          label: 'Proveedores',
          icon: 'pi pi-truck',
          routerLink: '/proveedores'
        }
      ]
    },
    {
      label: 'Gestión comercial',
      items: [
        {
          label: 'Reservas',
          icon: 'pi pi-book',
          routerLink: '/reservas'
        },
        {
          label: 'Pagos',
          icon: 'pi pi-wallet',
          routerLink: '/pagos'
        },
        {
          label: 'Cancelaciones',
          icon: 'pi pi-times-circle',
          routerLink: '/cancelaciones'
        },
        {
          label: 'Comprobantes',
          icon: 'pi pi-file',
          routerLink: '/comprobantes'
        }
      ]
    }
  ];

  toggleMenu(): void {
    this.menuOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
```

![](images/clipboard-262390861.png)

![](images/clipboard-1830903407.png)

#  **ISS-03 · CRUD de clientes con signals**

### **Narrativa**

### 

En esta unidad desarrollé el CRUD de clientes para el proyecto front-storelab-django, integrando el frontend Angular 22 con la API REST construida en Django. Implementé la consulta, creación, edición y baja lógica de clientes mediante los métodos HTTP GET, POST, PATCH y DELETE, respectivamente.

Organicé la funcionalidad utilizando componentes standalone y una arquitectura basada en features, separando la lógica de presentación, el formulario y el acceso a la API. Implementé Signals para administrar el estado de la lista, los indicadores de carga, los errores y la visibilidad del diálogo. También incorporé propiedades reactivas mediante `input()` y `output()` para comunicar el formulario con el componente principal.

Además, desarrollé un buscador local utilizando `computed` y la función reutilizable `filterRows`, evitando solicitudes innecesarias al backend durante la búsqueda. Finalmente, incorporé validaciones reactivas, notificaciones, confirmación de bajas, pruebas unitarias y verificación de compilación para comprobar el correcto funcionamiento de la funcionalidad.

### Generar los componentes

Primero verificaremos la estructura actual y después generaremos `client-list` y `client-form` sin sobrescribir archivos existentes.

Verificamos si ya existe la carpeta:

``` sql
ls src/app/features/clients
```

Si todavía no existen los componentes, ejecutamos:

``` sql
ng generate component features/clients/client-list --skip-tests --defaults ng generate component features/clients/client-form --skip-tests --defaults
```

Verificamos los archivos generados:

``` sql
tree src/app/features/clients -L 3
```

salida:

``` sql
src/app/features/clients
├── client-form
│   ├── client-form.css
│   ├── client-form.html
│   └── client-form.ts
└── client-list
    ├── client-list.css
    ├── client-list.html
    └── client-list.ts
```

###  Preparar el modelo de clientes

Primero verificaremos si el modelo `Client` y el servicio `ClientApi` de ISS-02 ya existen, para reutilizarlos y evitar duplicaciones.

Ejecutamos:

``` sql
tree src/app/core -L 4
```

###  Revisar modelo y servicio existentes

Ejecutamos estos comandos:

``` typescript
cat src/app/core/models/client.model.ts
```

``` typescript
cat src/app/core/services/client.service.ts
```

``` typescript
cat src/app/core/models/api.model.ts
```

``` typescript
cat src/app/core/utils/filter-rows.ts
```

Y verificamos la configuración de la API:

``` typescript
cat src/environments/environment.ts
```

![](images/clipboard-2053764791.png)

###  Revisar los modelos compartidos y el filtro

Ejecutamos:

``` typescript
cat src/app/core/models/api.model.ts
```

``` typescript
cat src/app/core/utils/filter-rows.ts
```

![](images/clipboard-2944335611.png)

### Comprobar dependencias y contrato del backend

Ejecutamos:

``` sql
grep -R "ClientService\|filterRows" -n src/app
```

``` typescript
cat src/environments/environment.development.ts
```

Comprobamos la respuesta real de Django:

```         
curl -s http://localhost:8000/api/clients/ | head -c 1500
```

![](images/clipboard-3136223011.png)

### Adaptar el modelo de clientes

Vamos a conservar el nombre `ClientService` que ya utiliza tu proyecto y adaptar el modelo al contrato.

Primero, ejecutamos:

``` typescript
cat src/app/core/models/package.model.ts
```

``` typescript
cat src/app/core/models/booking.model.ts
```

### Crear el modelo compartido de API

Primero crearemos `api.model.ts`, que contendrá los tipos compartidos.

Abrimos:

``` typescript
nano src/app/core/models/api.model.ts
```

Pegamos este código:

``` typescript
export type Status = 'active' | 'inactive';

export interface Timestamps {
  createdAt: string;
  updatedAt: string;
}
```

![](images/clipboard-4048537766.png)

### Actualizar el modelo de clientes

Abrimos:

```         
nano src/app/core/models/client.model.ts
```

Reemplazamos todo el contenido por:

``` typescript
import type { Status, Timestamps } from './api.model';

export type RecordStatus = Status;

export interface Client extends Timestamps {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  status: Status;
}

export interface ClientPayload {
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
}

// Compatibilidad con los nombres anteriores.
export type CreateClient = ClientPayload;
export type UpdateClient = Partial<ClientPayload>;
```

![](images/clipboard-4041011558.png)

### Adaptar el servicio de clientes

Actualizaremos `ClientService` para que cumpla el contrato:

- `GET /clients/`: listar clientes.

- `POST /clients/`: crear con `status: 'active'`.

- `PATCH /clients/{id}/`: editar sin modificar el estado.

- `DELETE /clients/{id}/`: dar de baja y recibir `204`.

Abrimos:

``` typescript
nano src/app/core/services/client.service.ts
```

Reemplazamos todo el contenido por:

``` typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Status } from '../models/api.model';
import {
  Client,
  ClientPayload
} from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/clients`;

  list(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.base}/`);
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.base}/${id}/`);
  }

  create(payload: ClientPayload & { status: Status }): Observable<Client> {
    return this.http.post<Client>(`${this.base}/`, payload);
  }

  update(id: number, payload: ClientPayload): Observable<Client> {
    return this.http.patch<Client>(`${this.base}/${id}/`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}/`);
  }
}
```

![](images/clipboard-3456798907.png)

### Actualizar el filtro reutilizable

La función actual de `filterRows` tiene una firma diferente a la que necesitamos. Como todavía no tiene otros consumidores, podemos adaptarla directamente.

Abrimos:

``` typescript
nano src/app/core/utils/filter-rows.ts
```

Reemplazamos todo el contenido por:

``` typescript
export function filterRows<T>(
  rows: readonly T[],
  query: string,
  pick: (row: T) => Array<string | number | null | undefined>
): T[] {
  const term = query.trim().toLowerCase();

  if (!term) {
    return [...rows];
  }

  return rows.filter((row) =>
    pick(row).some((value) =>
      (value ?? '').toString().toLowerCase().includes(term)
    )
  );
}
```

![](images/clipboard-229189238.png)

###  Revisar servicios y componentes compartidos

Antes de construir `client-list.ts`, vamos a revisar cómo están implementadas las notificaciones y los componentes compartidos para reutilizarlos correctamente.

Ejecutamos:

``` sql
cat src/app/core/services/notification.service.ts 
cat src/app/core/utils/to-api-message.ts 
tree src/app/shared -L 3
```

![](images/clipboard-2114940301.png)

### Revisar componentes compartidos

Ahora necesitamos conocer las propiedades y eventos de los tres componentes compartidos.

Ejecutamos:

``` sql
cat src/app/shared/ui/empty-state/empty-state.ts
cat src/app/shared/ui/empty-state/empty-state.html

cat src/app/shared/ui/page-header/page-header.ts
cat src/app/shared/ui/page-header/page-header.html

cat src/app/shared/ui/status-tag/status-tag.ts
cat src/app/shared/ui/status-tag/status-tag.html
```

###  Revisar configuración e integración

Antes de implementar el listado, revisaremos las rutas, el menú y la configuración de PrimeNG.

Ejecutamos:

``` sql
cat src/app/app.routes.ts tree src/app/layout -L 3 
cat src/app/app.config.ts
cat src/app/core/services/client.service.ts
```

### Preparar el listado de clientes

Vamos a conectar el componente con el menú y las rutas existentes antes de implementar su lógica.

Ejecutamos:

``` sql
cat src/app/app.routes.ts
```

``` sql
tree src/app/layout -L 3
```

``` sql
cat src/app/core/models/client.model.ts
```

###  Conectar la ruta de clientes

Abrimos:

``` typescript
nano src/app/app.routes.ts
```

remplasamos solo:

``` sql
loadComponent: () =>
  import('./features/clients/client-list/client-list').then(
    (m) => m.ClientList
  ),
```

![](images/clipboard-697292978.png)

### Implementar `client-list.ts`

Vamos a incorporar Signals, carga de clientes, búsqueda, eliminación lógica, confirmaciones y notificaciones.

Primero reemplazamos el archivo completo.

Abrimos:

``` typescript
nano src/app/features/clients/client-list/client-list.ts
```

remplazamos por este codigo:

``` typescript
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import { Client, ClientPayload } from '../../../core/models/client.model';
import { ClientService } from '../../../core/services/client.service';
import { NotificationService } from '../../../core/services/notification.service';
import { filterRows } from '../../../core/utils/filter-rows';
import { toApiMessage } from '../../../core/utils/to-api-message';

import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';

import { ClientForm } from '../client-form/client-form';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    InputTextModule,
    TableModule,
    TooltipModule,
    PageHeader,
    EmptyState,
    StatusTag,
    ClientForm
  ],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css'
})
export class ClientList implements OnInit {
  private readonly clientService = inject(ClientService);
  private readonly notification = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<Client[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly filter = signal('');
  readonly dialogVisible = signal(false);
  readonly editing = signal<Client | null>(null);
  readonly resetKey = signal(0);

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (client) => [
      client.id,
      client.name,
      client.address,
      client.phone,
      client.email,
      client.status
    ])
  );

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.clientService.list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (clients) => this.rows.set(clients),
        error: (err) => {
          const message = toApiMessage(err);
          this.error.set(message);
          this.notification.error(message);
        }
      });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((value) => value + 1);
    this.dialogVisible.set(true);
  }

  openEdit(client: Client): void {
    this.editing.set(client);
    this.dialogVisible.set(true);
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
    this.editing.set(null);
    this.resetKey.update((value) => value + 1);
  }

  save(payload: ClientPayload): void {
    this.saving.set(true);

    const client = this.editing();

    const request = client
      ? this.clientService.update(client.id, payload)
      : this.clientService.create({
          ...payload,
          status: 'active'
        });

    request
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(
            client
              ? 'Cliente actualizado correctamente.'
              : 'Cliente registrado correctamente.'
          );

          this.closeDialog();
          this.load();
        },
        error: (err) => {
          const message = toApiMessage(err);
          this.error.set(message);
          this.notification.error(message);
        }
      });
  }

  confirmDelete(client: Client): void {
    this.confirmation.confirm({
      header: 'Eliminar cliente',
      message: `¿Estás seguro de eliminar a ${client.name}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => this.remove(client)
    });
  }

  private remove(client: Client): void {
    this.clientService.remove(client.id).subscribe({
      next: () => {
        this.rows.update((rows) =>
          rows.filter((row) => row.id !== client.id)
        );

        this.notification.success('Cliente eliminado correctamente.');
      },
      error: (err) => {
        const message = toApiMessage(err);
        this.notification.error(message);
      }
    });
  }
}
```

![](images/clipboard-256836280.png)

### Implementar `client-list.html`

Ahora construiremos la interfaz del listado: encabezado, búsqueda, tabla de clientes, estados y acciones.

Abrimos:

``` html
nano src/app/features/clients/client-list/client-list.html
```

Pegamos este código:

``` html
<section class="space-y-6">
  <app-page-header
    title="Clientes"
    description="Administra los clientes registrados en WayuuTravel."
  />

  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="relative w-full sm:max-w-md">
      <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>

      <input
        pInputText
        type="text"
        class="w-full pl-10"
        placeholder="Buscar clientes..."
        [value]="filter()"
        (input)="filter.set($any($event.target).value)"
      />
    </div>

    <p-button
      label="Nuevo cliente"
      icon="pi pi-plus"
      (onClick)="openCreate()"
    />
  </div>

  @if (error()) {
    <div class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ error() }}
      <p-button
        label="Reintentar"
        icon="pi pi-refresh"
        severity="danger"
        [text]="true"
        (onClick)="load()"
      />
    </div>
  }

  @if (loading()) {
    <div class="flex justify-center py-12">
      <i class="pi pi-spin pi-spinner text-3xl text-teal-700"></i>
    </div>
  } @else if (visibleRows().length === 0) {
    <app-empty-state
      [title]="filter() ? 'No se encontraron clientes' : 'No hay clientes registrados'"
      [description]="filter() ? 'Intenta con otro término de búsqueda.' : 'Registra el primer cliente para comenzar.'"
      icon="pi pi-users"
    />
  } @else {
    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <p-table
        [value]="visibleRows()"
        [rowHover]="true"
        responsiveLayout="scroll"
      >
        <ng-template #header>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Correo electrónico</th>
            <th>Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </ng-template>

        <ng-template #body let-client>
          <tr>
            <td>{{ client.id }}</td>
            <td class="font-medium">{{ client.name }}</td>
            <td>{{ client.address || '—' }}</td>
            <td>{{ client.phone || '—' }}</td>
            <td>{{ client.email || '—' }}</td>
            <td>
              <app-status-tag [status]="client.status" />
            </td>
            <td>
              <div class="flex justify-center gap-2">
                <p-button
                  icon="pi pi-pencil"
                  severity="secondary"
                  [text]="true"
                  [rounded]="true"
                  pTooltip="Editar cliente"
                  (onClick)="openEdit(client)"
                />

                <p-button
                  icon="pi pi-trash"
                  severity="danger"
                  [text]="true"
                  [rounded]="true"
                  pTooltip="Eliminar cliente"
                  (onClick)="confirmDelete(client)"
                />
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  }
</section>

<p-dialog
  [header]="editing() ? 'Editar cliente' : 'Nuevo cliente'"
  [visible]="dialogVisible()"
  (visibleChange)="!$event && closeDialog()"
  [modal]="true"
  [draggable]="false"
  [resizable]="false"
  [style]="{ width: 'min(95vw, 600px)' }"
>
  <app-client-form
    [client]="editing()"
    [saving]="saving()"
    [resetKey]="resetKey()"
    (saved)="save($event)"
    (cancelled)="closeDialog()"
  />
</p-dialog>
```

![](images/clipboard-2560122057.png)

### Implementar `client-form.ts`

Ahora construiremos el formulario reactivo para registrar y editar clientes, con validaciones y Signals.

Abrimos:

``` typescript
nano src/app/features/clients/client-form/client-form.ts
```

Pegamos este código:

``` typescript
import {
  Component,
  effect,
  input,
  output
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import { Client, ClientPayload } from '../../../core/models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule
  ],
  templateUrl: './client-form.html',
  styleUrl: './client-form.css'
})
export class ClientForm {
  readonly client = input<Client | null>(null);
  readonly saving = input(false);
  readonly resetKey = input(0);

  readonly saved = output<ClientPayload>();
  readonly cancelled = output<void>();

  private readonly fb = new FormBuilder();

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    address: [''],
    phone: ['', [Validators.maxLength(30)]],
    email: ['', [Validators.email, Validators.maxLength(150)]]
  });

  constructor() {
    effect(() => {
      const client = this.client();
      this.resetKey();

      if (client) {
        this.form.reset({
          name: client.name,
          address: client.address ?? '',
          phone: client.phone ?? '',
          email: client.email ?? ''
        });
      } else {
        this.form.reset({
          name: '',
          address: '',
          phone: '',
          email: ''
        });
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const payload: ClientPayload = {
      name: value.name!.trim(),
      address: value.address?.trim() || null,
      phone: value.phone?.trim() || null,
      email: value.email?.trim() || null
    };

    this.saved.emit(payload);
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
```

![](images/clipboard-138298872.png)

###  Implementar `client-form.html`

Construiremos el formulario con campos, validaciones y botones para guardar o cancelar.

Abrimos:

``` html
nano src/app/features/clients/client-form/client-form.html
```

Pegamos este código:

``` html
<form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">

  <div class="space-y-2">
    <label for="name" class="block text-sm font-medium text-slate-700">
      Nombre completo *
    </label>

    <input
      pInputText
      id="name"
      formControlName="name"
      class="w-full"
      placeholder="Nombre del cliente"
    />

    @if (form.controls.name.touched && form.controls.name.invalid) {
      <small class="text-red-600">
        @if (form.controls.name.hasError('required')) {
          El nombre es obligatorio.
        } @else if (form.controls.name.hasError('minlength')) {
          El nombre debe tener al menos 3 caracteres.
        } @else {
          El nombre no puede superar los 150 caracteres.
        }
      </small>
    }
  </div>

  <div class="space-y-2">
    <label for="address" class="block text-sm font-medium text-slate-700">
      Dirección
    </label>

    <textarea
      pTextarea
      id="address"
      formControlName="address"
      rows="2"
      class="w-full"
      placeholder="Dirección del cliente"
    ></textarea>
  </div>

  <div class="space-y-2">
    <label for="phone" class="block text-sm font-medium text-slate-700">
      Teléfono
    </label>

    <input
      pInputText
      id="phone"
      formControlName="phone"
      class="w-full"
      placeholder="Número de contacto"
    />

    @if (form.controls.phone.touched && form.controls.phone.invalid) {
      <small class="text-red-600">
        El teléfono no puede superar los 30 caracteres.
      </small>
    }
  </div>

  <div class="space-y-2">
    <label for="email" class="block text-sm font-medium text-slate-700">
      Correo electrónico
    </label>

    <input
      pInputText
      id="email"
      type="email"
      formControlName="email"
      class="w-full"
      placeholder="correo@ejemplo.com"
    />

    @if (form.controls.email.touched && form.controls.email.invalid) {
      <small class="text-red-600">
        Ingresa un correo electrónico válido.
      </small>
    }
  </div>

  <div class="flex justify-end gap-3 border-t border-slate-200 pt-5">
    <p-button
      label="Cancelar"
      severity="secondary"
      [outlined]="true"
      type="button"
      (onClick)="cancel()"
    />

    <p-button
      [label]="client() ? 'Guardar cambios' : 'Registrar cliente'"
      icon="pi pi-check"
      type="submit"
      [loading]="saving()"
      [disabled]="saving()"
    />
  </div>

</form>
```

![](images/clipboard-3493461830.png)

### Verificar archivos y rutas

Ya tenemos implementados los dos componentes. Ahora vamos a comprobar que la ruta de clientes esté conectada y que los archivos CSS estén vacíos.

Ejecutamos:

``` typescript
cat src/app/app.routes.ts
```

``` typescript
wc -c src/app/features/clients/client-list/client-list.css
wc -c src/app/features/clients/client-form/client-form.css
```

``` typescript
cat src/app/core/models/client.model.ts
cat src/app/core/services/client.service.ts
```

![](images/clipboard-1406579581.png)

### Revisar las pruebas

Primero verificaremos qué pruebas y scripts tiene configurados el proyecto.

Ejecutamos:

``` json
cat package.json
```

``` typescript
find src -name "*.spec.ts"
```

### Ejecutar pruebas

Ejecutamos:

```         
ng test --watch=false
```

![](images/clipboard-925650600.png)

### Probar la interfaz

Ahora vamos a comprobar visualmente el módulo.

Ejecutamos:

```         
ng serve
```

![](images/clipboard-1090359849.png)
