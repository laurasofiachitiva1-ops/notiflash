# NotiFlash | Noticias al instante

Prototipo funcional de un portal de noticias desarrollado con HTML, CSS y JavaScript.
Proyecto académico de Front End (Entrega 2 – Semana 5).

**Demo en línea:** https://TU-USUARIO.github.io/notiflash
**Repositorio:** https://github.com/TU-USUARIO/notiflash

## Autor

- Nombre: TU NOMBRE COMPLETO
- Curso: Front End
- Profesor: NOMBRE DEL PROFESOR

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
- [ ] Renderizado dinámico de las noticias desde `noticias.json`
- [ ] Funcionalidad de favoritos (guardada en `localStorage`)
- [ ] Formularios con validaciones (contacto y gestionar)
- [ ] Crear y eliminar noticias

> Las casillas se irán marcando a medida que se completen.

## Estructura del proyecto

```
notiflash/
├── index.html
├── noticias.html
├── detalle.html
├── favoritos.html
├── gestionar.html
├── contacto.html
├── noticias.json        # Datos de las noticias
├── css/
│   ├── styles.css       # Estilos comunes: variables, botones, header y footer
│   └── <pagina>.css     # Estilos propios de cada página
├── js/
│   ├── noticias.js      # Lógica de los filtros
│   └── contacto.js      # Comportamiento del formulario de contacto
└── README.md
```

## Cómo ejecutarlo

**Opción 1: en línea.** Abre el enlace de la demo de GitHub Pages.

**Opción 2: en tu computador.** Al cargar datos desde `noticias.json` con `fetch`, el navegador exige un servidor; abrir el archivo con doble clic no funciona.

1. Clona o descarga el repositorio.
2. Ábrelo en Visual Studio Code e instala la extensión **Live Server**.
3. Clic derecho sobre `index.html` y elige **Open with Live Server**.

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
