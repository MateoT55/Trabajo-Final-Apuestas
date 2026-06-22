// URL base de interconexión con el Backend Node.js
const API_BASE_URL = 'http://localhost:3000/apuestas';

// Selectores del DOM
const apuestasGrid = document.getElementById('apuestas-grid');
const btnRefresh = document.getElementById('btn-refresh');
const loadingIndicator = document.getElementById('loading-indicator');

// Inicializar Aplicación al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    fetchApuestas();
    setupEventListeners();
});

// Configuración global de escuchas de eventos
function setupEventListeners() {
    btnRefresh.addEventListener('click', fetchApuestas);
    
    // Delegación de eventos en la grilla para capturar interacciones de las cards de forma eficiente
    apuestasGrid.addEventListener('click', handleGridActions);
    apuestasGrid.addEventListener('change', handleStatusChange);
}

// Obtener todas las apuestas desde el backend
async function fetchApuestas() {
    showLoading(true);
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('No se pudo establecer comunicación con el catálogo del servidor.');
        
        const apuestas = await response.json();
        renderApuestasGrid(apuestas);
    } catch (error) {
        showToast(error.message || 'Error de red al intentar sincronizar apuestas.', 'error');
        apuestasGrid.innerHTML = `
            <div class="loading-indicator">
                <p style="color: var(--color-danger);">⚠️ Falló la carga de datos. Asegúrate de que el backend esté encendido.</p>
            </div>
        `;
    } finally {
        showLoading(false);
    }
}

// Renderizado dinámico del listado estructurado
function renderApuestasGrid(apuestas) {
    if (!apuestas || apuestas.length === 0) {
        apuestasGrid.innerHTML = '<p class="loading-indicator">No se registran apuestas cargadas en el sistema actualmente.</p>';
        return;
    }

    // La base de datos ya las devuelve ordenadas por "destacada DESC, id_apuesta ASC" según el ApuestaService.js aportado.
    apuestasGrid.innerHTML = apuestas.map(apuesta => {
        const esDestacada = apuesta.destacada === true || apuesta.destacada === 1;
        const estadoAbierta = apuesta.estado === 'Abierta';
        
        return `
            <article class="card ${esDestacada ? 'destacada' : ''}" data-id="${apuesta.id_apuesta}">
                <div class="card-header-status">
                    <span class="badge ${estadoAbierta ? 'badge-abierta' : 'badge-cerrada'}">${apuesta.estado}</span>
                    ${esDestacada ? `
                        <span class="badge badge-destacada">
                            <svg class="icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                            Destacada
                        </span>
                    ` : ''}
                </div>
                
                <h3 class="card-enunciado">${apuesta.enunciado}</h3>
                
                <div class="card-opciones">
                    <div class="opcion-item">
                        <span class="opcion-label">Opción A:</span>
                        <span>${apuesta.opcion_a}</span>
                    </div>
                    <div class="opcion-item">
                        <span class="opcion-label">Opción B:</span>
                        <span>${apuesta.opcion_b}</span>
                    </div>
                </div>
                
                <div class="card-actions">
                    <div class="action-row-status">
                        <label for="status-${apuesta.id_apuesta}">Cambiar Estado:</label>
                        <select id="status-${apuesta.id_apuesta}" class="select-control action-select-estado">
                            <option value="Abierta" ${estadoAbierta ? 'selected' : ''}>Abierta</option>
                            <option value="Cerrada" ${!estadoAbierta ? 'selected' : ''}>Cerrada</option>
                        </select>
                    </div>
                    
                    <div class="action-row-buttons">
                        <a href="detalle.html?id=${apuesta.id_apuesta}" class="btn btn-primary">Ver detalle</a>
                        <button class="btn btn-star action-btn-toggle-star ${esDestacada ? 'active' : ''}" title="${esDestacada ? 'Quitar destacada' : 'Destacar apuesta'}">
                            <svg class="icon" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

// Controlador de acciones para clicks internos de la card
async function handleGridActions(e) {
    const target = e.target.closest('button');
    if (!target) return;
    
    const card = target.closest('.card');
    const id = card.dataset.id;
    
    if (target.classList.contains('action-btn-toggle-star')) {
        const esActivo = target.classList.contains('active');
        const endpoint = esActivo ? `/quitar-destacada/${id}` : `/destacar/${id}`;
        
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'PUT' });
            if (!response.ok) throw new Error('El servidor rechazó la solicitud de cambio de destaque.');
            
            const data = await response.json();
            showToast(data.mensaje || 'Destacado actualizado con éxito.', 'success');
            fetchApuestas(); // Recarga automática de la lista para reordenar la interfaz
        } catch (error) {
            showToast(error.message, 'error');
        }
    }
}

// Controlador para cambios de selectores de estado
async function handleStatusChange(e) {
    if (!e.target.classList.contains('action-select-estado')) return;
    
    const select = e.target;
    const card = select.closest('.card');
    const id = card.dataset.id;
    const nuevoEstado = select.value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/estado/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        
        if (!response.ok) throw new Error('Error al actualizar el estado de la apuesta.');
        
        const data = await response.json();
        showToast(data.mensaje || `Estado cambiado a ${nuevoEstado}`, 'success');
        fetchApuestas(); // Recarga y actualiza badges visuales
    } catch (error) {
        showToast(error.message, 'error');
        fetchApuestas(); // Revierte visualmente el select al estado real de la BD
    }
}

// Helper de visualización del Loader
function showLoading(state) {
    if (state) {
        loadingIndicator.classList.remove('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
    }
}

// Inyección y control dinámico de alertas flotantes (Toast)
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