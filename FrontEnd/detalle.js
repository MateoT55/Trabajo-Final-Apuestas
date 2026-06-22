// URL base de interconexión con el Backend Node.js
const API_BASE_URL = 'http://localhost:3000/apuestas';

// Elementos de Interfaz
const detalleContainer = document.getElementById('detalle-card-container');

// Estado Global en Memoria Técnica del Detalle
let apuestaId = null;

document.addEventListener('DOMContentLoaded', () => {
    extraerIdDeUrl();
    if (apuestaId) {
        fetchDetalleApuesta();
    } else {
        renderError('No se especificó un ID de apuesta válido en los parámetros de la URL.');
    }
});

// Procesa los parámetros de entrada por URL de forma nativa
function extraerIdDeUrl() {
    const params = new URLSearchParams(window.location.search);
    apuestaId = params.get('id');
}

// consume la consulta JOIN relacional calculada en el Backend
async function fetchDetalleApuesta() {
    try {
        const response = await fetch(`${API_BASE_URL}/detalle/${apuestaId}`);
        
        if (response.status === 404) throw new Error('La apuesta solicitada no se encuentra registrada.');
        if (!response.ok) throw new Error('Fallo crítico en el procesamiento del servidor.');
        
        const detalleApuesta = await response.json();
        renderDetalle(detalleApuesta);
    } catch (error) {
        renderError(error.message);
    }
}

// Renderiza los bloques de datos y métricas financieras de montos
function renderDetalle(apuesta) {
    const esDestacada = apuesta.destacada === true || apuesta.destacada === 1;
    const estadoAbierta = apuesta.estado === 'Abierta';
    
    // Conversiones numéricas seguras de los valores agregados de SQL Server (SUM de Jugadas)
    const totalA = parseFloat(apuesta.totalA || 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
    const totalB = parseFloat(apuesta.totalB || 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });

    detalleContainer.innerHTML = `
        <header class="detalle-header">
            <div class="detalle-header-info">
                <span class="badge ${estadoAbierta ? 'badge-abierta' : 'badge-cerrada'}" style="margin-bottom: 0.5rem; display:inline-block;">
                    ${apuesta.estado}
                </span>
                <h2>${apuesta.enunciado}</h2>
            </div>
            <div id="destacada-badge-container">
                ${esDestacada ? `
                    <span class="badge badge-destacada" style="padding: 0.5rem 0.75rem;">
                        <svg class="icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        Apuesta Destacada
                    </span>
                ` : '<span class="badge" style="background:#e2e8f0; color:#64748b">Sin destacar</span>'}
            </div>
        </header>

        <div class="detalle-body">
            <h3 style="font-size:1rem; margin-bottom:1rem; color: var(--color-text-muted); font-weight:600">
                DISTRIBUCIÓN DE FONDOS EN JUGADAS
            </h3>
            
            <div class="metrics-container">
                <div class="metric-box">
                    <div class="metric-title">Opción A</div>
                    <div class="metric-value">${apuesta.opcion_a}</div>
                    <div class="metric-amount">${totalA}</div>
                </div>
                <div class="metric-box">
                    <div class="metric-title">Opción B</div>
                    <div class="metric-value">${apuesta.opcion_b}</div>
                    <div class="metric-amount">${totalB}</div>
                </div>
            </div>

            <div class="detalle-actions-panel">
                <div class="panel-controls">
                    <label style="font-weight: 500;" for="select-detalle-estado">Modificar Estado:</label>
                    <select id="select-detalle-estado" class="select-control">
                        <option value="Abierta" ${estadoAbierta ? 'selected' : ''}>Abierta</option>
                        <option value="Cerrada" ${!estadoAbierta ? 'selected' : ''}>Cerrada</option>
                    </select>
                </div>
                
                <div class="panel-controls">
                    <button id="btn-detalle-star" class="btn btn-star ${esDestacada ? 'active' : ''}">
                        <svg class="icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        ${esDestacada ? 'Quitar de Destacadas' : 'Destacar Apuesta'}
                    </button>
                </div>
            </div>
        </div>
    `;

    // Adjuntar escuchas una vez inyectados los elementos en el DOM
    vincularEventosDetalle(esDestacada);
}

function vincularEventosDetalle(esDestacadaActual) {
    let destacadaStatus = esDestacadaActual;
    const btnStar = document.getElementById('btn-detalle-star');
    const selectEstado = document.getElementById('select-detalle-estado');

    // Manejo de Destacados
    btnStar.addEventListener('click', async () => {
        const endpoint = destacadaStatus ? `/quitar-destacada/${apuestaId}` : `/destacar/${apuestaId}`;
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'PUT' });
            if (!response.ok) throw new Error('Error al procesar la actualización del destaque.');
            
            const data = await response.json();
            showToast(data.mensaje, 'success');
            
            // Re-renderizado de este fragmento
            destacadaStatus = !destacadaStatus;
            btnStar.classList.toggle('active', destacadaStatus);
            btnStar.innerHTML = `
                <svg class="icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                ${destacadaStatus ? 'Quitar de Destacadas' : 'Destacar Apuesta'}
            `;
            
            const badgeContainer = document.getElementById('destacada-badge-container');
            badgeContainer.innerHTML = destacadaStatus ? `
                <span class="badge badge-destacada" style="padding: 0.5rem 0.75rem;">
                    <svg class="icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    Apuesta Destacada
                </span>
            ` : '<span class="badge" style="background:#e2e8f0; color:#64748b">Sin destacar</span>';

        } catch (error) {
            showToast(error.message, 'error');
        }
    });

    // Manejo de cambio de estado
    selectEstado.addEventListener('change', async () => {
        const nuevoEstado = selectEstado.value;
        try {
            const response = await fetch(`${API_BASE_URL}/estado/${apuestaId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            
            if (!response.ok) throw new Error('El servidor denegó la alteración del estado.');
            
            const data = await response.json();
            showToast(data.mensaje, 'success');
            fetchDetalleApuesta(); 
        } catch (error) {
            showToast(error.message, 'error');
            fetchDetalleApuesta();
        }
    });
}

// Inyección de contenedor de error descriptivo en pantalla
function renderError(msg) {
    detalleContainer.innerHTML = `
        <div class="loading-indicator" style="padding: 3rem 1rem;">
            <p style="color: var(--color-danger); font-weight:600; font-size:1.1rem">⚠️ Fallo en la Operación</p>
            <p style="text-align:center; max-width:500px; margin-top:0.5rem">${msg}</p>
            <a href="index.html" class="btn btn-secondary" style="margin-top:1.5rem">Regresar al Panel Principal</a>
        </div>
    `;
}

// Inyección de alertas efímeras
function showToast(message, type = 'success') {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <span style="margin-left:10px; cursor:pointer; font-weight:bold" onclick="this.parentElement.remove()">×</span>
    `;
    container.appendChild(toast);
    setTimeout(() => { if(toast) toast.remove(); }, 4000);
}