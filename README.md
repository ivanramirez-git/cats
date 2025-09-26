# Cat Breeds Frontend - Angular# Frontend



Frontend desarrollado en Angular 20 con Material Design para explorar razas de gatos.This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.3.



## 🌐 Demo en Producción## Development server



**🔗 [https://cats.freeloz.com](https://cats.freeloz.com)**To start a local development server, run:



## ⚡ Características```bash

ng serve

- ✅ Autenticación JWT con guards```

- ✅ Búsqueda en tiempo real

- ✅ Galería de imágenes interactivaOnce the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

- ✅ Vista tabla con filtros

- ✅ Responsive design## Code scaffolding

- ✅ Clean Architecture (SOLID)

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

## 🛠️ Tecnologías

```bash

- Angular 20ng generate component component-name

- Angular Material```

- TypeScript

- RxJSFor a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

- Docker + Nginx

```bash

## 🚀 Desarrollo Localng generate --help

```

```bash

# Instalar dependencias## Building

npm install

To build the project run:

# Servidor de desarrollo

ng serve```bash

ng build

# Build de producción```

ng build --configuration=production

```This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.



## 🐳 Docker## Running unit tests



```bashTo execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

# Build imagen

docker build -t cats-frontend .```bash

ng test

# Ejecutar contenedor```

docker run -p 4200:80 cats-frontend

```## Running end-to-end tests



---For end-to-end (e2e) testing, run:

*Frontend - XpertGroup Prueba Técnica*
```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
