/* =========================================================
   MideFácil - Lógica de la aplicación (Calculadora de IMC)
   ========================================================= */
'use strict';

/* ---------------------------------------------------------
   1. Datos de configuración
   Rangos válidos para los datos que ingresa el usuario.
   --------------------------------------------------------- */
const PESO_MIN = 1;        // kg
const PESO_MAX = 400;      // kg
const ESTATURA_MIN = 50;   // cm
const ESTATURA_MAX = 250;  // cm

const MAX_HISTORIAL = 5;

/* ---------------------------------------------------------
   2. Referencias a los objetos de la página
   --------------------------------------------------------- */
const formImc = document.getElementById('form-imc');
const txtPeso = document.getElementById('txt-peso');
const txtEstatura = document.getElementById('txt-estatura');
const txtImc = document.getElementById('txt-imc');
const msgImc = document.getElementById('msg-imc');
const listaHistorial = document.getElementById('lista-historial');

/* ---------------------------------------------------------
   3. Funciones de cálculo (no dependen de la página)
   --------------------------------------------------------- */

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

// Acepta coma o punto como separador decimal ("68,5" o "68.5").
function leerNumero(texto) {
  const limpio = texto.trim().replace(',', '.');
  const numero = Number(limpio);
  if (limpio === '' || !Number.isFinite(numero)) {
    return null;
  }
  return numero;
}

// Muestra un número con un decimal y coma: 22.857 -> "22,9".
function formatearDecimal(numero) {
  return numero.toFixed(1).replace('.', ',');
}

function mostrarMensaje(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = 'mensaje ' + tipo;
}

function marcarInvalido(input, invalido) {
  input.classList.toggle('invalido', invalido);
  input.setAttribute('aria-invalid', invalido);
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
   6. Eventos de la calculadora de IMC
   --------------------------------------------------------- */

// Evento submit del formulario: se activa con el botón Calcular o con Enter.
formImc.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const peso = leerNumero(txtPeso.value);
  const estatura = leerNumero(txtEstatura.value);
  const pesoValido = peso !== null && peso >= PESO_MIN && peso <= PESO_MAX;
  const estaturaValida = estatura !== null && estatura >= ESTATURA_MIN && estatura <= ESTATURA_MAX;

  marcarInvalido(txtPeso, !pesoValido);
  marcarInvalido(txtEstatura, !estaturaValida);

  if (!pesoValido || !estaturaValida) {
    txtImc.value = '';
    mostrarMensaje(msgImc, 'Revise los datos: peso entre ' + PESO_MIN + ' y ' + PESO_MAX +
                   ' kg, estatura entre ' + ESTATURA_MIN + ' y ' + ESTATURA_MAX + ' cm.', 'error');
    (pesoValido ? txtEstatura : txtPeso).focus();
    return;
  }

  const imc = calcularImc(peso, estatura);
  const clasificacion = clasificarImc(imc);

  txtImc.value = formatearDecimal(imc);
  mostrarMensaje(msgImc, 'Clasificación: ' + clasificacion, 'exito');
  agregarAlHistorial(formatearDecimal(peso) + ' kg, ' + formatearDecimal(estatura) +
                     ' cm → IMC ' + formatearDecimal(imc) + ' (' + clasificacion + ')');
});

// Deja la calculadora como al inicio (el navegador vacía los campos).
formImc.addEventListener('reset', function () {
  marcarInvalido(txtPeso, false);
  marcarInvalido(txtEstatura, false);
  mostrarMensaje(msgImc, '', '');
  txtPeso.focus();
});

/* ---------------------------------------------------------
   7. Inicio de la aplicación
   --------------------------------------------------------- */
document.querySelectorAll('[data-ir]').forEach(function (boton) {
  boton.addEventListener('click', function () {
    location.hash = boton.dataset.ir;
  });
});

window.addEventListener('hashchange', function () {
  mostrarSeccion(location.hash.substring(1));
});

mostrarSeccion(location.hash.substring(1));
