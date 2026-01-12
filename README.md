# AsisPoch - Sistema de Asistencia para ESPOCH

Sistema de asistencia y accesibilidad para la comunidad ESPOCH, diseñado para ayudar a estudiantes con necesidades especiales de movilidad y accesibilidad.

## 🚀 Características

- **Solicitudes de Asistencia**: Sistema completo para solicitar ayuda de movilidad, académica, bienestar y emergencias
- **Navegación Accesible**: Rutas optimizadas para accesibilidad en el campus
- **Reporte de Incidentes**: Sistema para reportar barreras de accesibilidad
- **Panel de Administración**: Gestión de solicitudes y incidentes para el personal
- **Notificaciones en Tiempo Real**: Comunicación instantánea entre usuarios y personal

## 🛠️ Tecnologías

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL
- **Base de Datos**: PostgreSQL con tablas para solicitudes, incidentes, usuarios y ubicaciones

## 📦 Instalación

### Prerrequisitos
- Node.js 16+
- PostgreSQL 12+

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   npm install --save-dev @types/babel__traverse
   
2. Start the development server (tanto en backend como en la ruta principal ejecutar):
   ```
   npm run start

   ```

## 📁 Project Structure

```
react_app/
├── backend/
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   │   ├──ui
│   │   │   └──Button.jsx
│   │   │   └──CheckBox.jsx
│   │   │   └──Header.jsx
│   │   │   └──Input.jsx
│   │   │   └──Modal.jsx
│   │   │   └──Select.jsx
│   │   └──AppIcon.jsx
│   │   └──AppImage.jsx
│   │   └──DebugPanel.jsx
│   │   └──ErrorBoundary.jsx
│   │   └──ScrollTop.jsx
│   ├── hooks/ 
│   │   └──useAssistanceRequestForm.js
│   ├── services/ 
│   │   └──AssistanceRequestService.js
│   │   └──apiService.js
│   └─── pages/          # Page components
│       ├──incident-reporting
│       │   └──Components
│       │   └──index.jsx
│       ├──campus-incident-monitor
│       │   └──Components
│       │   └──index.jsx
│       ├──login
│       │   └──Components
│       │   └──index.jsx
│       ├──request-assistance
│       │   └──Components
│       │   └──index.jsx
│       ├──route-navigation
│       │   └──Components
│       │   └──index.jsx
│       ├──student-dashboard
│           └──Components
│           └──index.jsx
├── ├── styles/         # Global styles and Tailwind configuration
├── ├── utils/         # Global styles and Tailwind configuration
├── ├── App.jsx         # Main application component
├── ├── Routes.jsx      # Application routes
├── └── index.jsx       # Application entry point
├── .env                # Environment variables
├── index.html          # HTML template
├── package.json        # Project dependencies and scripts
├── tailwind.config.js  # Tailwind CSS configuration
└── docker-compose.yml
└── favicon.ico
└── jsconfig.json
└── vite.config.mjs
```
## Implementación del Patrón Chain of Responsibility
## Estructura de Clases Base
```
src/
├── patterns/
│   ├── chain-of-responsibility/
│   │   ├── handlers/
│   │   │   ├── BaseHandler.js
│   │   │   ├── EmergencyHandler.js
│   │   │   ├── MobilityHandler.js
│   │   │   ├── AcademicHandler.js
│   │   │   └── WellbeingHandler.js
│   │   ├── RequestContext.js
│   │   └── AssistanceChain.js
│   ├── incident-chain/
│   │   ├── handlers/
│   │   │   ├── AccessibilityIncidentHandler.js
│   │   │   ├── DocumentationHandler.js
│   │   │   ├── EmergencyIncidentHandler.js
│   │   │   ├── InfrastructureIncidentHandler.js
│   │   │   └── NotificationHandler.js
│   │   ├── BaseHandler.js
│   │   ├── IncidentChain.js
│   │   └── IncidentContext.js
```
```
```
## 🧩 Adding Routes

To add new routes to the application, update the `Routes.jsx` file:

```jsx
import { useRoutes } from "react-router-dom";
import HomePage from "pages/HomePage";
import AboutPage from "pages/AboutPage";

const ProjectRoutes = () => {
  let element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/about", element: <AboutPage /> },
    // Add more routes as needed
  ]);

  return element;
};
```

## 🎨 Styling

This project uses Tailwind CSS for styling. The configuration includes:

- Forms plugin for form styling
- Typography plugin for text styling
- Aspect ratio plugin for responsive elements
- Container queries for component-specific responsive design
- Fluid typography for responsive text
- Animation utilities

## 📱 Responsive Design

The app is built with responsive design using Tailwind CSS breakpoints.


## 📦 Deployment

Build the application for production:

```bash
npm run build
```

## 📦 BASE DE DATOS

Crea el archivo docker-compose.yml en tu proyecto:
docker-compose up -d

# Verificar que el contenedor esté corriendo
docker ps

# Conectarse a la base de datos
docker exec -it asispoch-db psql -U postgres -d asispoch

# O desde fuera del contenedor
psql -h localhost -p 5432 -U postgres -d asispoch

# Backup de la base de datos (EN CASO DE SER NECESARIO)
docker exec asispoch-db pg_dump -U postgres asispoch > backup.sql

# Restaurar backup (EN CASO DE SER NECESARIO)
docker exec -i asispoch-db psql -U postgres -d asispoch < backup.sql
```