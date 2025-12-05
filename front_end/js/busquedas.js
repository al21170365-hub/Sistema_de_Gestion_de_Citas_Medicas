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
        contenedor.innerHTML = '<p>Ingrese texto</p>'
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

    for (let i = 0; i < pacientesFiltrados.length; i++) {
        contenedor.innerHTML += `
            <div class="paciente-item">
                <strong>ID:</strong> ${pacientesFiltrados[i].id} | 
                <strong>Nombre:</strong> ${pacientesFiltrados[i].nombre} | 
                <strong>Edad:</strong> ${pacientesFiltrados[i].edad} | 
                <strong>Teléfono:</strong> ${pacientesFiltrados[i].telefono} | 
                <strong>Email:</strong> ${pacientesFiltrados[i].email} | 
                <strong>Fecha registro:</strong> ${pacientesFiltrados[i].fechaRegistro}
            </div>
        `
    }
    for (let i = 0; i < doctoresFiltrados.length; i++) {
        contenedor.innerHTML += `
        <div class="doctor-item">
            <strong>ID:</strong> ${doctoresFiltrados[i].id} | 
            <strong>Nombre:</strong> ${doctoresFiltrados[i].nombre} | 
            <strong>Especialidad:</strong> ${doctoresFiltrados[i].especialidad} | 
            <strong>Horario:</strong> ${doctoresFiltrados[i].horarioInicio} - ${doctoresFiltrados[i].horarioFin} | 
            <strong>Disponibilidad:</strong> ${doctoresFiltrados[i].diasDisponibles}
        </div>
        `
    }
    for (let i = 0; i < citasFiltradas.length; i++) {
        contenedor.innerHTML += `
            <div class="cita-item">
                <strong>ID:</strong> ${citasFiltradas[i].id} | 
                <strong>Paciente ID:</strong> ${citasFiltradas[i].pacienteId} | 
                <strong>Doctor ID:</strong> ${citasFiltradas[i].doctorId} | 
                <strong>Fecha:</strong> ${citasFiltradas[i].fecha} | 
                <strong>Hora:</strong> ${citasFiltradas[i].hora} | 
                <strong>Motivo:</strong> ${citasFiltradas[i].motivo} | 
                <strong>Estado:</strong> ${citasFiltradas[i].estado}
            </div>`
        
    }
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
    
    // Mostrar resultados de pacientes
    if (pacientesFiltrados.length > 0) {
        contenedor.innerHTML += `
            <div class="categoria-resultados">
                <h3>Pacientes encontrados (${pacientesFiltrados.length})</h3>
            </div>
        `;
        
        for (let i = 0; i < pacientesFiltrados.length; i++) {
            contenedor.innerHTML += `
                <div class="paciente-item resultado-item">
                    <div class="resultado-header">
                        <span class="badge paciente-badge">Paciente</span>
                        <strong>ID:</strong> ${pacientesFiltrados[i].id}
                    </div>
                    <div class="resultado-detalles">
                        <div><strong>Nombre:</strong> ${pacientesFiltrados[i].nombre}</div>
                        <div><strong>Edad:</strong> ${pacientesFiltrados[i].edad}</div>
                        <div><strong>Teléfono:</strong> ${pacientesFiltrados[i].telefono}</div>
                        <div><strong>Email:</strong> ${pacientesFiltrados[i].email}</div>
                        <div><strong>Fecha registro:</strong> ${pacientesFiltrados[i].fechaRegistro}</div>
                    </div>
                </div>
            `;
        }
        totalResultados += pacientesFiltrados.length;
    }
    
    // Mostrar resultados de doctores
    if (doctoresFiltrados.length > 0) {
        contenedor.innerHTML += `
            <div class="categoria-resultados">
                <h3>Doctores encontrados (${doctoresFiltrados.length})</h3>
            </div>
        `;
        
        for (let i = 0; i < doctoresFiltrados.length; i++) {
            contenedor.innerHTML += `
                <div class="doctor-item resultado-item">
                    <div class="resultado-header">
                        <span class="badge doctor-badge">Doctor</span>
                        <strong>ID:</strong> ${doctoresFiltrados[i].id}
                    </div>
                    <div class="resultado-detalles">
                        <div><strong>Nombre:</strong> ${doctoresFiltrados[i].nombre}</div>
                        <div><strong>Especialidad:</strong> ${doctoresFiltrados[i].especialidad}</div>
                        <div><strong>Horario:</strong> ${doctoresFiltrados[i].horarioInicio} - ${doctoresFiltrados[i].horarioFin}</div>
                        <div><strong>Días disponibles:</strong> ${doctoresFiltrados[i].diasDisponibles}</div>
                    </div>
                </div>
            `;
        }
        totalResultados += doctoresFiltrados.length;
    }
    
    // Mostrar resultados de citas
    if (citasFiltradas.length > 0) {
        contenedor.innerHTML += `
            <div class="categoria-resultados">
                <h3>Citas encontradas (${citasFiltradas.length})</h3>
            </div>
        `;
        
        for (let i = 0; i < citasFiltradas.length; i++) {
            // Buscar información del paciente y doctor para esta cita
            const paciente = pacientes.data.find(p => p.id === citasFiltradas[i].pacienteId);
            const doctor = doctores.data.find(d => d.id === citasFiltradas[i].doctorId);
            
            contenedor.innerHTML += `
                <div class="cita-item resultado-item">
                    <div class="resultado-header">
                        <span class="badge cita-badge">Cita</span>
                        <strong>ID:</strong> ${citasFiltradas[i].id}
                    </div>
                    <div class="resultado-detalles">
                        <div><strong>Fecha y hora:</strong> ${citasFiltradas[i].fecha} ${citasFiltradas[i].hora}</div>
                        <div><strong>Motivo:</strong> ${citasFiltradas[i].motivo}</div>
                        <div><strong>Estado:</strong> <span class="estado-${citasFiltradas[i].estado}">${citasFiltradas[i].estado}</span></div>
                        <div><strong>Paciente:</strong> ${paciente ? paciente.nombre : 'No encontrado'} (ID: ${citasFiltradas[i].pacienteId})</div>
                        <div><strong>Doctor:</strong> ${doctor ? doctor.nombre : 'No encontrado'} (ID: ${citasFiltradas[i].doctorId})</div>
                    </div>
                </div>
            `;
        }
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
    
    // Mostrar resumen
    // if (contenedor) {
    //     contenedor.innerHTML += `
    //         <div class="resumen-busqueda">
    //             <h4>Resumen de búsqueda</h4>
    //             <p><strong>Total resultados:</strong> ${totalResultados}</p>
    //             <p><strong>Pacientes:</strong> ${pacientesFiltrados.length}</p>
    //             <p><strong>Doctores:</strong> ${doctoresFiltrados.length}</p>
    //             <p><strong>Citas:</strong> ${citasFiltradas.length}</p>
    //         </div>
    //     `;
    // }
}

function limpiarBusqueda() {
  contenedor.innerHTML = ''
}
