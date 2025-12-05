const busqueda_globals = document.querySelector('.busqueda_global')
const contenedor = document.querySelector('.contenedor')

async function get_pacientess(id_s) {
    let url = `http://localhost:9797/api/pacientes`
    
    try {
        const results = await fetch(url)
        if (!results.ok) {
            throw new Error(`Error: ${results.status}`)
        }
        const datas = await results.json()
        return datas
    } catch (error) {
        console.log(`Error: ${error}`)
        return null
    }
}
async function get_doctores(id) {
    let url = `http://localhost:9797/api/doctores`
    
    try {
        const results = await fetch(url)
        if (!results.ok) {
            throw new Error(`Error: ${results.status}`)
        }
        const datas = await results.json()
        return datas
    } catch (error) {
        console.log(`Error: ${error}`)
        getDoctores_container.innerHTML = `<div class="error">Error al cargar doctores: ${error.message}</div>`
    }
}
async function get_citas(id_s,id_a,id_h) {
    let url = `http://localhost:9797/api/citas`
    
    try {
        const results = await fetch(url)
        if (!results.ok) {
            throw new Error(`Error: ${results.status}`)
        }
        const datas = await results.json()
        return datas
    } catch (error) {
        console.log(`Error: ${error}`)
        return null
    }
}

async function busqueda_global() {
    let pacientes = await get_pacientess()
    let doctores = await get_doctores()
    let citas = await get_citas()

    let texto = busqueda_globals.value
    
    if(!texto) {
        alert(`Ingrese texto`)
        // contenedor.innerHTML = '<p>Ingrese texto</p>'
        return
    }
    contenedor.innerHTML = ''
    const buscarEnObjeto = (objeto, textoBusqueda) => {
        return Object.values(objeto).some(valor => 
            valor !== null && 
            valor !== undefined && 
            valor.toString().toLowerCase().includes(textoBusqueda.toLowerCase())
        );
    };

    const pacientesFiltrados = pacientes.data.filter(paciente => 
        buscarEnObjeto(paciente, texto)
    );

    const doctoresFiltrados = doctores.data.filter(doctor => 
        buscarEnObjeto(doctor, texto)
    );

    const citasFiltradas = citas.data.filter(cita => 
        buscarEnObjeto(cita, texto)
    );

    const citasConDetallesFiltradas = citas.data.filter(cita => {
        if (buscarEnObjeto(cita, texto)) {
            return true;
        }
        
        const paciente = pacientes.data.find(p => p.id === cita.pacienteId);
        if (paciente && buscarEnObjeto(paciente, texto)) {
            return true;
        }
        
        const doctor = doctores.data.find(d => d.id === cita.doctorId);
        if (doctor && buscarEnObjeto(doctor, texto)) {
            return true;
        }
        
        return false;
    });

    let html = ''

    html = `
      ${pacientesFiltrados.map(paciente => `
          <tr>
              <td>${paciente.id}</td>
              <td>${paciente.nombre}</td>
              <td>${paciente.edad}</td>
              <td>${paciente.telefono}</td>
              <td>${paciente.email}</td>
              <td>${paciente.fechaRegistro}</td>
          </tr>
      `).join('')}
    `
    contenedor.innerHTML += `
          <br>
          <h3>Pacientes</h3>
         <table class="pacientes-table">
             <thead>
                 <tr>
                     <th>ID</th>
                     <th>Nombre</th>
                     <th>Edad</th>
                     <th>Telefono</th>
                     <th>Email</th>
                     <th>Fecha de Registro</th>
                 </tr>
             </thead>
             <tbody>
                ${html}
             </tbody>
         </table>
    `;
    html = `
      ${doctoresFiltrados.map(doctor => `
          <tr>
              <td>${doctor.id}</td>
              <td>${doctor.nombre}</td>
              <td>${doctor.especialidad}</td>
              <td>${doctor.horarioInicio} - ${doctor.horarioFin}</td>
              <td>${doctor.diasDisponibles}</td>
          </tr>
      `).join('')}
    `
    contenedor.innerHTML += `
          <br>
          <h3>Doctores</h3>
         <table class="pacientes-table">
             <thead>
                 <tr>
                     <th>ID</th>
                     <th>Nombre</th>
                     <th>Especialidad</th>
                     <th>Horario</th>
                     <th>Disponibilidad</th>
                 </tr>
             </thead>
             <tbody>
                ${html}
             </tbody>
         </table>
    `;
    html = `
      ${citasFiltradas.map(citas => `
            <tr>
              <td>${citas.id}</td>
              <td>${citas.pacienteId}</td>
              <td>${citas.doctorId}</td>
              <td>${citas.fecha}</td>
              <td>${citas.hora}</td>
              <td>${citas.motivo}</td>
              <td>${citas.estado}</td>
          </tr>
      `).join('')}
    `
    contenedor.innerHTML += `
          <br>
          <h3>Citas</h3>
         <table class="pacientes-table">
             <thead>
                 <tr>
                     <th>ID</th>
                     <th>Paciente</th>
                     <th>Doctor</th>
                     <th>Fecha</th>
                     <th>Hora</th>
                     <th>Motivo</th>
                     <th>Estado</th>
                 </tr>
             </thead>
             <tbody>
                ${html}
             </tbody>
         </table>
    `;
}

async function busqueda_multiple_criterios() {
    // Obtener los datos
    let pacientes = await get_pacientess()
    let doctores = await get_doctores()
    let citas = await get_citas()
    
    // Obtener valores de los campos de búsqueda individuales
    let textoPaciente = document.getElementById('busqueda-paciente').value || '';
    let textoDoctor = document.getElementById('busqueda-doctor').value || '';
    let textoCita = document.getElementById('busqueda-cita').value || '';
    let fechaDesde = document.getElementById('fecha-desde').value || '';
    let fechaHasta = document.getElementById('fecha-hasta').value || '';
    let estadoCita = document.getElementById('estado-cita').value || '';
    let especialidad = document.getElementById('especialidad-doctor').value || '';
    
    // Referencia al contenedor de resultados
    
    // Si todos los campos están vacíos, mostrar mensaje
    if (!textoPaciente && !textoDoctor && !textoCita && !fechaDesde && !fechaHasta && !estadoCita && !especialidad) {
        contenedor.innerHTML = '<p class="mensaje-info">Ingrese al menos un criterio de búsqueda</p>';
        return;
    }
    
    // Limpiar contenedor
    contenedor.innerHTML = '';
    
    // Función auxiliar para buscar en un objeto
    const buscarEnObjeto = (objeto, textoBusqueda, campoEspecifico = null) => {
        if (!textoBusqueda) return true; // Si no hay texto, no filtrar
        
        if (campoEspecifico) {
            // Buscar en un campo específico
            const valor = objeto[campoEspecifico];
            return valor !== null && 
                   valor !== undefined && 
                   valor.toString().toLowerCase().includes(textoBusqueda.toLowerCase());
        } else {
            // Buscar en todos los campos del objeto
            return Object.values(objeto).some(valor => 
                valor !== null && 
                valor !== undefined && 
                valor.toString().toLowerCase().includes(textoBusqueda.toLowerCase())
            );
        }
    };
    
    // Filtrar pacientes
    const pacientesFiltrados = pacientes.data.filter(paciente => {
        // Filtrar por búsqueda general en paciente
        if (textoPaciente && !buscarEnObjeto(paciente, textoPaciente)) {
            return false;
        }
        
        return true;
    });
    
    // Filtrar doctores
    const doctoresFiltrados = doctores.data.filter(doctor => {
        // Filtrar por búsqueda general en doctor
        if (textoDoctor && !buscarEnObjeto(doctor, textoDoctor)) {
            return false;
        }
        
        // Filtrar por especialidad si se especificó
        if (especialidad && doctor.especialidad !== especialidad) {
            return false;
        }
        
        return true;
    });
    
    // Filtrar citas con criterios múltiples
    const citasFiltradas = citas.data.filter(cita => {
        // Filtrar por búsqueda general en cita
        if (textoCita && !buscarEnObjeto(cita, textoCita)) {
            return false;
        }
        
        // Filtrar por estado si se especificó
        if (estadoCita && cita.estado !== estadoCita) {
            return false;
        }
        
        // Filtrar por fecha desde
        if (fechaDesde && cita.fecha < fechaDesde) {
            return false;
        }
        
        // Filtrar por fecha hasta
        if (fechaHasta && cita.fecha > fechaHasta) {
            return false;
        }
        
        // Verificar si coincide con pacientes filtrados
        if (textoPaciente && pacientesFiltrados.length > 0) {
            const pacienteEncontrado = pacientesFiltrados.find(p => p.id === cita.pacienteId);
            if (!pacienteEncontrado) {
                return false;
            }
        }
        
        // Verificar si coincide con doctores filtrados
        if ((textoDoctor || especialidad) && doctoresFiltrados.length > 0) {
            const doctorEncontrado = doctoresFiltrados.find(d => d.id === cita.doctorId);
            if (!doctorEncontrado) {
                return false;
            }
        }
        
        return true;
    });
    
    // Contadores de resultados
    let totalResultados = 0;
    let html = ''
    
    // Mostrar resultados de pacientes
    if (pacientesFiltrados.length > 0) {
        contenedor.innerHTML += `
            <div class="categoria-resultados">
                <h3>Pacientes encontrados (${pacientesFiltrados.length})</h3>
            </div>
        `;
        
         html = `
         ${pacientesFiltrados.map(paciente => `
             <tr>
                 <td>${paciente.id}</td>
                 <td>${paciente.nombre}</td>
                 <td>${paciente.edad}</td>
                 <td>${paciente.telefono}</td>
                 <td>${paciente.email}</td>
                 <td>${paciente.fechaRegistro}</td>
             </tr>
         `).join('')}
        `
        contenedor.innerHTML += `
             <table class="pacientes-table">
                 <thead>
                     <tr>
                         <th>ID</th>
                         <th>Nombre</th>
                         <th>Edad</th>
                         <th>Telefono</th>
                         <th>Email</th>
                         <th>Fecha de Registro</th>
                     </tr>
                 </thead>
                 <tbody>
                    ${html}
                 </tbody>
             </table>
        `;
        totalResultados += pacientesFiltrados.length;
    }
    
    // Mostrar resultados de doctores
    if (doctoresFiltrados.length > 0) {
        contenedor.innerHTML += `
            <div class="categoria-resultados">
                <h3>Doctores encontrados (${doctoresFiltrados.length})</h3>
            </div>
        `;
        
        html = `
          ${doctoresFiltrados.map(doctor => `
              <tr>
                  <td>${doctor.id}</td>
                  <td>${doctor.nombre}</td>
                  <td>${doctor.especialidad}</td>
                  <td>${doctor.horarioInicio} - ${doctor.horarioFin}</td>
                  <td>${doctor.diasDisponibles}</td>
              </tr>
          `).join('')}
        `
        contenedor.innerHTML += `
             <table class="pacientes-table">
                 <thead>
                     <tr>
                         <th>ID</th>
                         <th>Nombre</th>
                         <th>Especialidad</th>
                         <th>Horario</th>
                         <th>Disponibilidad</th>
                     </tr>
                 </thead>
                 <tbody>
                    ${html}
                 </tbody>
             </table>
        `
        totalResultados += doctoresFiltrados.length;
    }
    
    // Mostrar resultados de citas
    if (citasFiltradas.length > 0) {
        contenedor.innerHTML += `
            <div class="categoria-resultados">
                <h3>Citas encontradas (${citasFiltradas.length})</h3>
            </div>
        `;
        html = ''
        for (let i = 0; i < citasFiltradas.length; i++) {
            // Buscar información del paciente y doctor para esta cita
            const paciente = pacientes.data.find(p => p.id === citasFiltradas[i].pacienteId);
            const doctor = doctores.data.find(d => d.id === citasFiltradas[i].doctorId);
            html += `
                <tr>
                  <td>${citasFiltradas[i].id}</td>
                  <td>${citasFiltradas[i].fecha} ${citasFiltradas[i].hora}</td>
                  <td>${citasFiltradas[i].motivo}</td>
                  <td>${citasFiltradas[i].estado}</td>
                  <td>${paciente.nombre} (ID: ${citasFiltradas[i].pacienteId})</td>
                  <td>${doctor.nombre} (ID: ${citasFiltradas[i].doctorId})</td>
                </tr>
            `
            
        }
        contenedor.innerHTML += `
             <table class="pacientes-table">
                 <thead>
                     <tr>
                         <th>ID</th>
                         <th>Fecha y Hora</th>
                         <th>Motivo</th>
                         <th>Estado</th>
                         <th>Paciente</th>
                         <th>Doctor</th>
                     </tr>
                 </thead>
                 <tbody>
                    ${html}
                 </tbody>
             </table>
        `
        totalResultados += citasFiltradas.length;
    }
    
    // Si no hay resultados
    if (totalResultados === 0) {
        contenedor.innerHTML = `
            <div class="mensaje-sin-resultados">
                <h3>No se encontraron resultados</h3>
                <p>Intenta ajustar los criterios de búsqueda</p>
            </div>
        `;
    }
    
}

function limpiarBusqueda() {
  contenedor.innerHTML = `
            <h3><i class="fas fa-tachometer-alt"></i> Panel de Control</h3>
            <p>Bienvenido al sistema de gestión de citas médicas. Utilice los enlaces de navegación para acceder a las diferentes secciones.</p>`
}
