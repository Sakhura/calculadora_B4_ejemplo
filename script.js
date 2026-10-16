/* =========================================================
   MideFácil - Lógica de la aplicación
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   1. Datos de configuración
   Cada unidad se expresa en metros (unidad base). Para agregar
   una unidad nueva basta con añadir una línea a este objeto.
   --------------------------------------------------------- */
const UNIDADES = {
  mm: { nombre: 'Milímetro (mm)', factor: 0.001 },
  cm: { nombre: 'Centímetro (cm)', factor: 0.01 },
  m:  { nombre: 'Metro (m)', factor: 1 },
  km: { nombre: 'Kilómetro (km)', factor: 1000 },
  in: { nombre: 'Pulgada (in)', factor: 0.0254 },
  ft: { nombre: 'Pie (ft)', factor: 0.3048 }
};

const MAX_HISTORIAL = 5;

const formatoNumero = new Intl.NumberFormat('es-CL', {
  maximumFractionDigits: 6
});

/* ---------------------------------------------------------
   2. Referencias a los objetos de la página
   --------------------------------------------------------- */
const formConversion = document.getElementById('form-conversion');
const txtMedida = document.getElementById('txt-medida');
const selDesde = document.getElementById('sel-desde');
const selHacia = document.getElementById('sel-hacia');
const txtResultado = document.getElementById('txt-resultado');
const msgConversion = document.getElementById('msg-conversion');
const btnIntercambiar = document.getElementById('btn-intercambiar');
const btnLimpiar = document.getElementById('btn-limpiar');
const listaHistorial = document.getElementById('lista-historial');

const formImc = document.getElementById('form-imc');
const txtPeso = document.getElementById('txt-peso');
const txtEstatura = document.getElementById('txt-estatura');
const txtImc = document.getElementById('txt-imc');
const msgImc = document.getElementById('msg-imc');

/* ---------------------------------------------------------
   3. Funciones de cálculo (no dependen de la página)
   --------------------------------------------------------- */

// Convierte un valor pasando primero por metros.
function convertir(valor, desde, hacia) {
  const enMetros = valor * UNIDADES[desde].factor;
  return enMetros / UNIDADES[hacia].factor;
}

// Calcula el IMC con la estatura en centímetros.
function calcularImc(pesoKg, estaturaCm) {
  const estaturaM = estaturaCm / 100;
  return pesoKg / (estaturaM * estaturaM);
}

// Clasificación de la OMS para adultos.
function clasificarImc(imc) {
  if (imc < 18.5) return 'Bajo peso';
  if (imc < 25) return 'Peso normal';
  if (imc < 30) return 'Sobrepeso';
  return 'Obesidad';
}

/* ---------------------------------------------------------
   4. Funciones de apoyo para la interfaz
   --------------------------------------------------------- */

// Acepta coma o punto como separador decimal ("2,5" o "2.5").
function leerNumero(texto) {
  const limpio = texto.trim().replace(',', '.');
  const numero = Number(limpio);
  if (limpio === '' || !Number.isFinite(numero)) {
    return null;
  }
  return numero;
}

function mostrarMensaje(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = 'mensaje ' + tipo;
}

function marcarInvalido(input, invalido) {
  input.classList.toggle('invalido', invalido);
  input.setAttribute('aria-invalid', invalido);
}

// Llena una lista desplegable con las unidades disponibles.
function cargarUnidades(select, seleccionada) {
  for (const clave in UNIDADES) {
    const opcion = document.createElement('option');
    opcion.value = clave;
    opcion.textContent = UNIDADES[clave].nombre;
    opcion.selected = clave === seleccionada;
    select.appendChild(opcion);
  }
}

function agregarAlHistorial(texto) {
  const vacio = listaHistorial.querySelector('.historial-vacio');
  if (vacio) {
    vacio.remove();
  }
  const item = document.createElement('li');
  item.textContent = texto;
  listaHistorial.prepend(item);
  while (listaHistorial.children.length > MAX_HISTORIAL) {
    listaHistorial.lastElementChild.remove();
  }
}

/* ---------------------------------------------------------
   5. Navegación entre secciones
   --------------------------------------------------------- */
function mostrarSeccion(id) {
  const secciones = document.querySelectorAll('.seccion');
  const destino = document.getElementById(id) ? id : 'inicio';

  secciones.forEach(function (seccion) {
    seccion.hidden = seccion.id !== destino;
  });

  document.querySelectorAll('.menu a').forEach(function (enlace) {
    if (enlace.dataset.seccion === destino) {
      enlace.setAttribute('aria-current', 'page');
    } else {
      enlace.removeAttribute('aria-current');
    }
  });
}

/* ---------------------------------------------------------
   6. Eventos de la calculadora de conversión
   --------------------------------------------------------- */

// Evento submit del formulario: se activa con el botón Calcular o con Enter.
formConversion.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const valor = leerNumero(txtMedida.value);

  if (valor === null) {
    marcarInvalido(txtMedida, true);
    txtResultado.value = '';
    mostrarMensaje(msgConversion, 'Ingrese una medida numérica, por ejemplo 2,5.', 'error');
    txtMedida.focus();
    return;
  }

  if (valor < 0) {
    marcarInvalido(txtMedida, true);
    txtResultado.value = '';
    mostrarMensaje(msgConversion, 'Una longitud no puede ser negativa.', 'error');
    txtMedida.focus();
    return;
  }

  marcarInvalido(txtMedida, false);

  const desde = selDesde.value;
  const hacia = selHacia.value;
  const resultado = convertir(valor, desde, hacia);
  const texto = formatoNumero.format(valor) + ' ' + desde + ' = ' +
                formatoNumero.format(resultado) + ' ' + hacia;

  txtResultado.value = formatoNumero.format(resultado) + ' ' + hacia;
  mostrarMensaje(msgConversion, texto, 'exito');
  agregarAlHistorial(texto);
});

// Intercambia las unidades y recalcula si ya había un resultado.
btnIntercambiar.addEventListener('click', function () {
  const temporal = selDesde.value;
  selDesde.value = selHacia.value;
  selHacia.value = temporal;

  if (txtResultado.value !== '') {
    formConversion.requestSubmit();
  }
});

// Deja la calculadora como al inicio.
btnLimpiar.addEventListener('click', function () {
  txtMedida.value = '';
  txtResultado.value = '';
  marcarInvalido(txtMedida, false);
  mostrarMensaje(msgConversion, '', '');
  txtMedida.focus();
});

// Si el usuario cambia una unidad, el resultado anterior ya no es válido.
[selDesde, selHacia].forEach(function (select) {
  select.addEventListener('change', function () {
    txtResultado.value = '';
    mostrarMensaje(msgConversion, '', '');
  });
});

/* ---------------------------------------------------------
   7. Eventos de la calculadora de IMC
   --------------------------------------------------------- */
formImc.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const peso = leerNumero(txtPeso.value);
  const estatura = leerNumero(txtEstatura.value);
  const pesoValido = peso !== null && peso > 0 && peso <= 400;
  const estaturaValida = estatura !== null && estatura >= 50 && estatura <= 250;

  marcarInvalido(txtPeso, !pesoValido);
  marcarInvalido(txtEstatura, !estaturaValida);

  if (!pesoValido || !estaturaValida) {
    txtImc.value = '';
    mostrarMensaje(msgImc, 'Revise los datos: peso entre 1 y 400 kg, estatura entre 50 y 250 cm.', 'error');
    return;
  }

  const imc = calcularImc(peso, estatura);
  txtImc.value = imc.toFixed(1).replace('.', ',');
  mostrarMensaje(msgImc, 'Clasificación: ' + clasificarImc(imc), 'exito');
});

formImc.addEventListener('reset', function () {
  marcarInvalido(txtPeso, false);
  marcarInvalido(txtEstatura, false);
  mostrarMensaje(msgImc, '', '');
});

/* ---------------------------------------------------------
   8. Inicio de la aplicación
   --------------------------------------------------------- */
document.querySelectorAll('[data-ir]').forEach(function (boton) {
  boton.addEventListener('click', function () {
    location.hash = boton.dataset.ir;
  });
});

window.addEventListener('hashchange', function () {
  mostrarSeccion(location.hash.substring(1));
});

cargarUnidades(selDesde, 'cm');
cargarUnidades(selHacia, 'm');
mostrarSeccion(location.hash.substring(1));
