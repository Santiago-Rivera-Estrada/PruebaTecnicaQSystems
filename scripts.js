// =============================
// Ejercicio A: Formulario inteligente de registro
// =============================

// Valida que la contraseña tenga mínimo 8 caracteres, al menos 1 mayúscula y 1 número
function validarContrasena(pass) {
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(pass);
}

// Valida el formato del correo electrónico
function validarCorreo(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
}

// Cifrado César (rotación 3)
function cifrarCesar(texto) {
  return texto.replace(/[a-zA-Z]/g, function(c) {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode((c.charCodeAt(0) - base + 3) % 26 + base);
  });
}

// Manejo del formulario de registro
const formRegistro = document.getElementById('form-registro');
if (formRegistro) {
  formRegistro.addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const contrasena = document.getElementById('contrasena').value;

    let errores = [];
    if (!validarContrasena(contrasena)) {
      errores.push("La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.");
    }
    if (!validarCorreo(correo)) {
      errores.push("El correo no tiene un formato válido.");
    }

    const resultado = document.getElementById('resultado-registro');
    if (errores.length > 0) {
      resultado.innerHTML = errores.join("<br>");
      resultado.style.color = "red";
      return;
    }

    // Mostrar datos (sin contraseña) y contraseña cifrada
    resultado.innerHTML = `
      <strong>Nombre:</strong> ${nombre}<br>
      <strong>Correo:</strong> ${correo}<br>
      <strong>Contraseña cifrada:</strong> ${cifrarCesar(contrasena)}
    `;
    resultado.style.color = "green";
  });
}

// =============================
// Ejercicio B: Analizador de texto 
// =============================

// Función para eliminar tildes y normalizar palabras
function normalizarPalabra(palabra) {
  // Quita tildes y convierte a minúsculas
  return palabra
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Elimina diacríticos
    .toLowerCase();
}

const analizarBtn = document.getElementById('analizar-btn');
if (analizarBtn) {
  analizarBtn.addEventListener('click', function() {
    const texto = document.getElementById('texto-analizar').value.trim();
    if (!texto) {
      document.getElementById('resultado-analisis').innerHTML = "Introduce un texto.";
      return;
    }
    // Elimina signos de puntuación y separa palabras
    let palabras = texto
      .replace(/[^\p{L}\s]/gu, "") // Solo letras y espacios (soporta acentos)
      .split(/\s+/)
      .map(normalizarPalabra)
      .filter(p => p.length >= 2); // Solo palabras de 2 letras o más

    const numPalabras = palabras.length;

    // Encontrar palabra más larga y más corta
    let palabraLarga = "", palabraCorta = palabras[0] || "";
    palabras.forEach(palabra => {
      if (palabra.length > palabraLarga.length) palabraLarga = palabra;
      if (palabra.length < palabraCorta.length) palabraCorta = palabra;
    });

    // Palabras únicas ordenadas
    const unicas = [...new Set(palabras)].sort();

    document.getElementById('resultado-analisis').innerHTML = `
      <strong>Número de palabras:</strong> ${numPalabras}<br>
      <strong>Palabra más larga:</strong> ${palabraLarga}<br>
      <strong>Palabra más corta:</strong> ${palabraCorta}<br>
      <strong>Palabras únicas ordenadas:</strong> ${unicas.join(", ")}
    `;
  });
}

// =============================
// Ejercicio C: Temporizador interactivo
// =============================

let timerInterval;
const iniciarTemporizadorBtn = document.getElementById('iniciar-temporizador');
if (iniciarTemporizadorBtn) {
  iniciarTemporizadorBtn.addEventListener('click', function() {
    clearInterval(timerInterval);
    let segundos = parseInt(document.getElementById('segundos').value, 10);
    const display = document.getElementById('cuenta-regresiva');
    if (isNaN(segundos) || segundos <= 0) {
      display.innerHTML = "Introduce un número válido de segundos.";
      return;
    }
    display.innerHTML = segundos;
    timerInterval = setInterval(() => {
      segundos--;
      if (segundos > 0) {
        display.innerHTML = segundos;
      } else {
        clearInterval(timerInterval);
        display.innerHTML = "👉 <strong>¡Tiempo finalizado!</strong>";
      }
    }, 1000);
  });
}

// =============================
// Ejercicio D: Buscador inteligente de coincidencias
// =============================

// Simulación de 20 usuarios
const roles = ["admin", "user", "guest"];
const estados = ["activo", "inactivo"];
const nombresEjemplo = [
  "Ana Torres", "Luis Pérez", "María López", "Carlos Gómez", "Lucía Fernández",
  "Pedro Ramírez", "Sofía Díaz", "Javier Morales", "Elena Ruiz", "Miguel Castro",
  "Valeria Romero", "Andrés Herrera", "Paula Vargas", "Diego Silva", "Carmen Ortega",
  "Raúl Mendoza", "Isabel Soto", "Tomás Navarro", "Gabriela León", "Hugo Rivas"
];

function generarCorreo(nombre) {
  return nombre.toLowerCase().replace(/ /g, ".") + "@mail.com";
}

const usuarios = nombresEjemplo.map((nombre, i) => ({
  nombreCompleto: nombre,
  correo: generarCorreo(nombre),
  rol: roles[i % roles.length],
  estado: estados[Math.floor(Math.random() * estados.length)]
}));

let ordenActual = { campo: null, asc: true };

function filtrarYMostrarUsuarios() {
  const busqueda = document.getElementById('busqueda-usuario').value.trim().toLowerCase();
  const rol = document.getElementById('filtro-rol').value;
  let filtrados = usuarios.filter(u => {
    const coincideBusqueda =
      u.nombreCompleto.toLowerCase().includes(busqueda) ||
      u.correo.toLowerCase().includes(busqueda);
    const coincideRol = rol ? u.rol === rol : true;
    return coincideBusqueda && coincideRol;
  });

  // Ordenamiento
  if (ordenActual.campo) {
    filtrados.sort((a, b) => {
      let valA = a[ordenActual.campo].toLowerCase();
      let valB = b[ordenActual.campo].toLowerCase();
      if (valA < valB) return ordenActual.asc ? -1 : 1;
      if (valA > valB) return ordenActual.asc ? 1 : -1;
      return 0;
    });
  }

  // Mostrar conteo
  document.getElementById('conteo-coincidencias').innerText = `Coincidencias: ${filtrados.length}`;

  // Mostrar en tabla
  const tbody = document.querySelector('#tabla-usuarios tbody');
  tbody.innerHTML = '';
  filtrados.forEach(u => {
    const tr = document.createElement('tr');
    if (u.estado === 'inactivo') {
      tr.style.background = '#f8d7da'; // Sombreado para inactivos
    }
    tr.innerHTML = `
      <td>${u.nombreCompleto}</td>
      <td>${u.correo}</td>
      <td>${u.rol}</td>
      <td>${u.estado}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Eventos de búsqueda y filtrado
const busquedaInput = document.getElementById('busqueda-usuario');
const filtroRol = document.getElementById('filtro-rol');
if (busquedaInput && filtroRol) {
  busquedaInput.addEventListener('input', filtrarYMostrarUsuarios);
  filtroRol.addEventListener('change', filtrarYMostrarUsuarios);
}

// Ordenar por nombre/correo
const btnOrdenarNombre = document.getElementById('ordenar-nombre');
const btnOrdenarCorreo = document.getElementById('ordenar-correo');
if (btnOrdenarNombre && btnOrdenarCorreo) {
  btnOrdenarNombre.addEventListener('click', function() {
    if (ordenActual.campo === 'nombreCompleto') {
      ordenActual.asc = !ordenActual.asc;
    } else {
      ordenActual.campo = 'nombreCompleto';
      ordenActual.asc = true;
    }
    filtrarYMostrarUsuarios();
  });
  btnOrdenarCorreo.addEventListener('click', function() {
    if (ordenActual.campo === 'correo') {
      ordenActual.asc = !ordenActual.asc;
    } else {
      ordenActual.campo = 'correo';
      ordenActual.asc = true;
    }
    filtrarYMostrarUsuarios();
  });
}

// Mostrar usuarios al cargar
filtrarYMostrarUsuarios();

// =============================
// Ejercicio E: Editor de tareas con historial
// =============================

// Estructura de cada tarea: { id, titulo, descripcion, historial: [ {titulo, descripcion, fecha} ] }
let tareas = [];
let tareaEditando = null; // id de la tarea que se está editando

function renderTareas() {
  const contenedor = document.getElementById('lista-tareas');
  if (!contenedor) return;
  if (tareas.length === 0) {
    contenedor.innerHTML = '<p>No hay tareas.</p>';
    return;
  }
  contenedor.innerHTML = '';
  tareas.forEach(tarea => {
    const div = document.createElement('div');
    div.className = 'tarea-item';
    div.style.border = '1px solid #eaeaea';
    div.style.borderRadius = '6px';
    div.style.margin = '12px 0';
    div.style.padding = '12px';
    div.innerHTML = `
      <strong>${tarea.titulo}</strong><br>
      <span>${tarea.descripcion}</span><br>
      <button data-id="${tarea.id}" class="editar-tarea">Editar</button>
      <button data-id="${tarea.id}" class="historial-tarea">Ver historial</button>
      <div class="historial-container" id="historial-${tarea.id}" style="display:none; margin-top:10px;"></div>
    `;
    contenedor.appendChild(div);
  });
  addTareaEventListeners();
}

function addTareaEventListeners() {
  // Editar tarea
  document.querySelectorAll('.editar-tarea').forEach(btn => {
    btn.onclick = function() {
      const id = this.getAttribute('data-id');
      const tarea = tareas.find(t => t.id == id);
      if (!tarea) return;
      // Guardar versión anterior antes de editar
      tarea.historial.push({
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        fecha: new Date().toLocaleString()
      });
      document.getElementById('titulo-tarea').value = tarea.titulo;
      document.getElementById('desc-tarea').value = tarea.descripcion;
      tareaEditando = id;
      document.querySelector('#form-tarea button[type="submit"]').textContent = 'Guardar cambios';
    };
  });
  // Ver historial
  document.querySelectorAll('.historial-tarea').forEach(btn => {
    btn.onclick = function() {
      const id = this.getAttribute('data-id');
      const tarea = tareas.find(t => t.id == id);
      const cont = document.getElementById('historial-' + id);
      if (!tarea || !cont) return;
      if (cont.style.display === 'none') {
        if (tarea.historial.length === 0) {
          cont.innerHTML = '<em>Sin historial</em>';
        } else {
          cont.innerHTML = tarea.historial.map((h, idx) => `
            <div style="border-bottom:1px solid #eee; margin-bottom:6px; padding-bottom:4px;">
              <strong>Versión ${idx + 1}:</strong> <br>
              <span><b>Título:</b> ${h.titulo}</span><br>
              <span><b>Descripción:</b> ${h.descripcion}</span><br>
              <span style="font-size:0.9em; color:#888;">${h.fecha}</span><br>
              <button data-id="${id}" data-idx="${idx}" class="revertir-tarea">Revertir a esta versión</button>
            </div>
          `).join('');
        }
        cont.style.display = 'block';
        addRevertirEventListeners();
      } else {
        cont.style.display = 'none';
      }
    };
  });
}

function addRevertirEventListeners() {
  document.querySelectorAll('.revertir-tarea').forEach(btn => {
    btn.onclick = function() {
      const id = this.getAttribute('data-id');
      const idx = this.getAttribute('data-idx');
      const tarea = tareas.find(t => t.id == id);
      if (!tarea) return;
      // Guardar versión actual antes de revertir
      tarea.historial.push({
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        fecha: new Date().toLocaleString()
      });
      // Revertir a la versión seleccionada
      const version = tarea.historial[idx];
      tarea.titulo = version.titulo;
      tarea.descripcion = version.descripcion;
      renderTareas();
    };
  });
}

// Manejo del formulario de tareas
const formTarea = document.getElementById('form-tarea');
if (formTarea) {
  formTarea.addEventListener('submit', function(e) {
    e.preventDefault();
    const titulo = document.getElementById('titulo-tarea').value.trim();
    const desc = document.getElementById('desc-tarea').value.trim();
    if (!titulo || !desc) return;
    if (tareaEditando) {
      // Editar tarea existente
      const tarea = tareas.find(t => t.id == tareaEditando);
      if (tarea) {
        tarea.titulo = titulo;
        tarea.descripcion = desc;
      }
      tareaEditando = null;
      formTarea.querySelector('button[type="submit"]').textContent = 'Agregar tarea';
    } else {
      // Agregar nueva tarea
      tareas.push({
        id: Date.now(),
        titulo,
        descripcion: desc,
        historial: []
      });
    }
    formTarea.reset();
    renderTareas();
  });
}

// Render inicial
renderTareas();

// =============================
// Exportar e importar historial de tareas (JSON)
// =============================

// Exportar tareas a JSON
const btnExportar = document.getElementById('exportar-tareas');
if (btnExportar) {
  btnExportar.onclick = function() {
    const dataStr = JSON.stringify(tareas, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tareas_historial.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
}

// Importar tareas desde JSON
const btnImportar = document.getElementById('importar-tareas');
const inputImportar = document.getElementById('input-importar-tareas');
if (btnImportar && inputImportar) {
  btnImportar.onclick = function() {
    inputImportar.value = '';
    inputImportar.click();
  };
  inputImportar.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const data = JSON.parse(evt.target.result);
        if (Array.isArray(data)) {
          // Validar estructura mínima
          tareas = data.map(t => ({
            id: t.id || Date.now() + Math.random(),
            titulo: t.titulo || '',
            descripcion: t.descripcion || '',
            historial: Array.isArray(t.historial) ? t.historial : []
          }));
          renderTareas();
          alert('¡Tareas importadas correctamente!');
        } else {
          alert('El archivo no tiene el formato correcto.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };
}

// =============================
// Autocompletado de dominios en el input de correo electrónico
// =============================

const dominiosCorreo = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "icloud.com"];
const inputCorreo = document.getElementById('correo');
const sugerenciasCorreo = document.getElementById('sugerencias-correo');

if (inputCorreo && sugerenciasCorreo) {
  inputCorreo.addEventListener('input', function() {
    const valor = this.value;
    sugerenciasCorreo.innerHTML = '';
    sugerenciasCorreo.style.display = 'none';
    const atIndex = valor.indexOf('@');
    if (atIndex === -1) return; // Solo sugerir si hay un @
    const parteDominio = valor.slice(atIndex + 1).toLowerCase();
    if (parteDominio.length === 0) {
      // Mostrar todos los dominios
      mostrarSugerenciasDominios(valor, dominiosCorreo);
    } else {
      // Filtrar dominios que coincidan
      const sugerencias = dominiosCorreo.filter(d => d.startsWith(parteDominio));
      if (sugerencias.length > 0) {
        mostrarSugerenciasDominios(valor, sugerencias);
      }
    }
  });
  // Ocultar sugerencias al perder foco
  inputCorreo.addEventListener('blur', function() {
    setTimeout(() => { sugerenciasCorreo.innerHTML = ''; sugerenciasCorreo.style.display = 'none'; }, 150);
  });
}

function mostrarSugerenciasDominios(valor, sugerencias) {
  sugerenciasCorreo.style.display = 'block';
  const atIndex = valor.indexOf('@');
  const parteUsuario = valor.slice(0, atIndex + 1); // Incluye el @
  sugerenciasCorreo.innerHTML = '';
  sugerencias.forEach(dominio => {
    const div = document.createElement('div');
    div.textContent = parteUsuario + dominio;
    div.className = 'sugerencia-item';
    div.onclick = function() {
      inputCorreo.value = parteUsuario + dominio;
      sugerenciasCorreo.innerHTML = '';
      sugerenciasCorreo.style.display = 'none';
      inputCorreo.focus();
    };
    sugerenciasCorreo.appendChild(div);
  });
} 