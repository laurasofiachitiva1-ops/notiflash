# NotiFlash | Noticias al instante

Prototipo funcional de un portal de noticias desarrollado con HTML, CSS y JavaScript.
Proyecto académico de Front End (Entrega 2 – Semana 5).

**Demo en línea:** https://laurasofiachitiva1-ops.github.io/notiflash
**Repositorio:** https://github.com/laurasofiachitiva1-ops/notiflash

## Autores

- Nombre: Laura Sofía Chitiva Lopez, María Isabel Valencia Arboleda, Vittorio Gomez Di Innocentis, Yully Alexandra Calderón Navarro
- Curso: Front End
- Profesor: John Olarte Ramos

## Tecnologías

- HTML5
- CSS3 (variables CSS, flexbox, diseño responsive)
- JavaScript (vanilla)
- [Bootstrap 5.3](https://getbootstrap.com/) mediante CDN (requiere conexión a internet)

## Páginas

| Página | Archivo | Descripción |
|---|---|---|
| Inicio | `index.html` | Slider principal, noticias destacadas y opiniones de lectores |
| Noticias | `noticias.html` | Listado completo con filtros por categoría, búsqueda y orden |
| Detalle | `detalle.html` | Contenido completo de una noticia y noticias relacionadas |
| Favoritos | `favoritos.html` | Noticias guardadas por el usuario |
| Gestionar | `gestionar.html` | Crear y eliminar noticias (mini CRUD) |
| Contacto | `contacto.html` | Formulario de contacto con validaciones |

## Funcionalidades de la Entrega 2

- [x] Estructura HTML y CSS de todas las páginas, con diseño responsive
- [x] Estilos compartidos en un solo archivo (`css/styles.css`)
- [x] Filtros de categoría en el listado de noticias
- [x] Renderizado dinámico de las noticias desde `noticias.json`
- [x] Funcionalidad de favoritos (guardada en `localStorage`)
- [x] Formularios con validaciones (contacto y gestionar)
- [x] Crear y eliminar noticias

## Estructura del proyecto

```
notiflash/
├── index.html           # Página principal con noticias destacadas dinámicas
├── noticias.html        # Listado con filtros, búsqueda, ordenación y favoritos
├── detalle.html         # Vista detallada de la noticia y artículos relacionados
├── favoritos.html       # Noticias guardadas en localStorage
├── gestionar.html       # Mini CRUD para crear y eliminar noticias
├── contacto.html        # Formulario de contacto con validaciones
├── noticias.json        # Datos iniciales de las noticias
├── css/
│   ├── styles.css       # Estilos comunes: variables, botones, header y footer
│   └── <pagina>.css     # Estilos propios de cada página
├── js/
│   ├── app.js           # Capa de datos compartida, localStorage y utilidades
│   ├── inicio.js        # Lógica de noticias destacadas en el inicio
│   ├── noticias.js      # Filtrado dinámico, búsqueda, orden y favoritos
│   ├── detalle.js       # Renderizado del artículo y noticias relacionadas
│   ├── favoritos.js     # Gestión y renderizado de noticias guardadas
│   ├── gestionar.js     # Mini CRUD: crear con validación y eliminar con confirmación
│   └── contacto.js      # Validaciones y feedback del formulario de contacto
└── README.md
```

## Cómo ejecutarlo

Al cargar datos desde `noticias.json` con `fetch`, el navegador requiere ejecutarse sobre un servidor web local (o en línea):

**Opción A: con Python (sin instalar nada adicional)**
Abre una terminal en la carpeta del proyecto y ejecuta:
```bash
python -m http.server 8000
```
Luego abre en tu navegador: [http://localhost:8000](http://localhost:8000)

**Opción B: con Live Server en VS Code**
1. Abre la carpeta del proyecto en Visual Studio Code.
2. Instala la extensión **Live Server**.
3. Clic derecho sobre `index.html` y selecciona **Open with Live Server**.

**Opción C: con Node.js / npx**
```bash
npx serve .
```

**Opción D: en línea**
Abre el enlace de la demo desplegada en GitHub Pages:
https://laurasofiachitiva1-ops.github.io/notiflash

## Estructura de los datos

Cada noticia en `noticias.json` tiene esta forma:

```json
{
  "id": 1,
  "titulo": "Título de la noticia",
  "categoria": "Educación",
  "imagen": "",
  "resumen": "Breve resumen",
  "contenido": "Texto completo",
  "autor": "Redacción NotiFlash",
  "fecha": "2026-09-12",
  "destacada": true
}
```

Categorías disponibles: Educación, Tecnología, Turismo y Comercial.

## Licencia

Proyecto con fines académicos.
