# MideFácil: Calculadora de IMC (ejemplo para clases)

> **Importante: este proyecto es solo un ejemplo.**
> Sirve para que revisen la **estructura** de una página web (HTML, CSS y JavaScript separados) y la **lógica** de una calculadora sencilla.
> **No es lo que se solicita en el ejercicio.** No lo copien ni lo entreguen como propio: úsenlo como referencia para entender cómo se organiza un proyecto y luego construyan el suyo según el enunciado de su actividad.

## ¿Qué hace la aplicación?

Calcula el **Índice de Masa Corporal (IMC)** de una persona a partir de su peso y su estatura, y muestra su clasificación según la Organización Mundial de la Salud (OMS).

La página tiene tres secciones, a las que se accede desde el menú:

1. **Inicio:** bienvenida y descripción de la herramienta.
2. **Calculadora:** formulario para ingresar peso y estatura, con el resultado y un historial de los últimos 5 cálculos.
3. **Tabla IMC:** rangos de clasificación de la OMS y un ejemplo resuelto.

## La fórmula

```
IMC = peso (kg) / estatura (m)²
```

Como el usuario ingresa la estatura en **centímetros**, primero se divide por 100 para pasarla a metros.

**Ejemplo:** 70 kg y 175 cm

```
estatura en metros = 175 / 100 = 1,75
IMC = 70 / (1,75 × 1,75) = 70 / 3,0625 = 22,9
```

| IMC | Clasificación |
|---|---|
| Menos de 18,5 | Bajo peso |
| 18,5 a 24,9 | Peso normal |
| 25,0 a 29,9 | Sobrepeso |
| 30,0 o más | Obesidad |

## Estructura del proyecto

```
calculadora_ejemploB4/
├── index.html    → estructura y contenido de la página
├── estilos.css   → apariencia (colores, tamaños, distribución)
├── script.js     → lógica y comportamiento
└── img/
    ├── logo.jpg
    ├── banner.jpg
    └── fondo.jpg
```

Cada archivo tiene **una sola responsabilidad**. Esta separación es una buena práctica: si quieren cambiar un color, van al CSS; si quieren cambiar un cálculo, van al JavaScript; si quieren agregar un texto, van al HTML.

## Cómo está organizado el código

### index.html

- Usa etiquetas **semánticas**: `header`, `nav`, `main`, `section` y `footer`.
- Cada sección tiene un `id` (`inicio`, `calculadora`, `tabla`) que el menú usa para navegar.
- Cada `input` tiene su `label` asociado con el atributo `for`, lo que mejora la accesibilidad.
- El archivo `script.js` se carga al final del `body`, cuando los elementos de la página ya existen.

### estilos.css

- Los colores se definen una sola vez como **variables** en `:root` (por ejemplo `--naranja`) y luego se reutilizan.
- La distribución general (encabezado, menú, contenido y pie) se arma con **CSS Grid**.
- Al final hay una sección `@media (max-width: 700px)` que adapta el diseño a celulares.

### script.js

El archivo está dividido en bloques numerados con comentarios. Léanlo en este orden:

1. **Datos de configuración:** constantes con los límites válidos (`PESO_MIN`, `PESO_MAX`, `ESTATURA_MIN`, `ESTATURA_MAX`).
2. **Referencias a la página:** se obtienen los elementos con `document.getElementById`.
3. **Funciones de cálculo:** `calcularImc()` y `clasificarImc()`. No tocan la página, solo reciben números y devuelven un resultado. Así son fáciles de probar y reutilizar.
4. **Funciones de apoyo:** leer números (acepta coma o punto), mostrar mensajes, marcar campos inválidos y agregar al historial.
5. **Navegación:** `mostrarSeccion()` muestra una sección y oculta las demás.
6. **Eventos:** qué ocurre al presionar *Calcular* (evento `submit`) y *Limpiar* (evento `reset`).
7. **Inicio de la aplicación:** se conectan los botones y se muestra la sección inicial.

### El flujo al presionar "Calcular"

```
Usuario presiona Calcular (o Enter)
        ↓
Se leen los textos de peso y estatura
        ↓
¿Son números dentro del rango permitido?
   ├─ No → se marca el campo en rojo y se muestra un mensaje de error
   └─ Sí → se calcula el IMC → se clasifica → se muestra el resultado
                                              → se agrega al historial
```

## Validaciones incluidas

- El campo no puede estar vacío ni contener letras.
- Se acepta `68,5` y también `68.5`.
- Peso entre 1 y 400 kg.
- Estatura entre 50 y 250 cm.

Validar los datos **antes** de calcular evita resultados sin sentido (por ejemplo, dividir por cero si la estatura es 0).

## Cómo ejecutarlo

No necesita instalación. Basta con abrir `index.html` en el navegador (doble clic o arrastrarlo a una ventana).

También pueden usar la extensión **Live Server** de Visual Studio Code para que la página se recargue sola al guardar cambios.

## Preguntas para revisar el ejemplo

Úsenlas para comprobar si entendieron la estructura y la lógica:

1. ¿Por qué la función `calcularImc()` divide la estatura por 100?
2. ¿Qué pasaría si se eliminara `evento.preventDefault()` en el evento `submit`?
3. ¿Dónde cambiarían el límite máximo de peso? ¿Por qué conviene que sea una constante?
4. ¿Cómo hace el menú para saber qué sección mostrar?
5. ¿Qué parte del CSS hace que la página se vea bien en un celular?
6. ¿Por qué las funciones de cálculo están separadas de las que modifican la página?

## Recordatorio final

Este repositorio muestra **una forma** de organizar un proyecto, no la única ni la respuesta del ejercicio. Revisen el enunciado de su actividad, identifiquen qué se les pide y apliquen lo que aprendieron aquí a su propia solución.

> **Nota:** el IMC es solo una referencia general para adultos y no reemplaza una evaluación médica.
