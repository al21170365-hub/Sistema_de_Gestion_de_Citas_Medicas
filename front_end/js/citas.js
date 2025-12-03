const getCitas_container = document.querySelector('.getCitas_container')
const getCitasFiltro_container_front = document.querySelector('.citas_programadas_hoy')
const citas_pendiente_24_horas = document.querySelector('.citas_pendiente_24_horas')
const citas_id_input = document.querySelector('.citas_id_input')
const citas_agenda_id_input = document.querySelector('.citas_agenda_id_input')
const citas_historial_id_input = document.querySelector('.citas_historial_id_input')

const citas_paciente_nuevo = document.querySelector('.citas_paciente_nuevo')
const citas_doctor_nuevo = document.querySelector('.citas_doctor_nuevo')
const citas_fecha_nuevo = document.querySelector('.citas_fecha_nuevo')
const citas_hora_nuevo = document.querySelector('.citas_hora_nuevo')
const citas_motivo_nuevo = document.querySelector('.citas_motivo_nuevo')

const citas_id_cancelar = document.querySelector('.citas_id_cancelar')

const getEstadisticas_container = document.querySelector('.getEstadisticas_container')

const getFiltros_container = document.querySelector('.getFiltros_container')
const citas_fecha_filtro = document.querySelector('.citas_fecha_filtro')
const citas_estado_filtro = document.querySelector('.citas_estado_filtro')

const doctores_fecha_filtro = document.querySelector('.doctores_fecha_filtro')
const doctores_hora_filtro = document.querySelector('.doctores_hora_filtro')

const getProximas_container = document.querySelector('.getProximas_container')
const getCitasFiltro_container = document.querySelector('.getCitasFiltro_container')

const get_doctores_id2 = document.querySelector('.doctor_id_input')
const getDoctores_container2 = document.querySelector('.getDoctores_container')

async function get_citas(id_s,id_a,id_h) {
    let url = ''
    if(id_h) {
        url = `http://localhost:9797/api/pacientes/${id_h}/historial`
    }else if(id_a) {
        url = `http://localhost:9797/api/citas/doctor/${id_a}`
    }else if(id_s) {
        url = `http://localhost:9797/api/citas/${id_s}`
    } else {
        url = `http://localhost:9797/api/citas`
    }
    
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

async function post_citas() {
    getCitas_container.innerHTML = '';
    const paciente = citas_paciente_nuevo.value;
    const doctor = citas_doctor_nuevo.value
    const fecha = citas_fecha_nuevo.value
    const hora = citas_hora_nuevo.value
    const motivo = citas_motivo_nuevo.value
    
    let url = `http://localhost:9797/api/citas`;
    const updatedData = {
        "pacienteId": paciente,
        "doctorId": doctor,
        "fecha": fecha,
        "hora": hora,
        "motivo": motivo
    };
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        const result = await response.json();
        getCitas_container.innerHTML = `
            <div>
                <strong>ID Cita:</strong> ${result.data.id} | 
                <strong>Paciente:</strong> ${result.data.pacienteId} | 
                <strong>Doctor:</strong> ${result.data.doctorId} | 
                <strong>Fecha:</strong> ${result.data.fecha} | 
                <strong>Hora:</strong> ${result.data.hora} | 
                <strong>Motivo:</strong> ${result.data.motivo} | 
                <strong>Estado:</strong> ${result.data.estado}
            </div>
            <p>${result?.message}</p>`
    } catch (error) {
        console.log(`Error: ${error}`);
        getPacientes_container.innerHTML = `<div class="error">Error al actualizar paciente: ${error.message}</div>`
    }
}

async function put_citas() {
    const id_s = citas_id_cancelar.value

    if (!id_s) {
        getPacientes_container.innerHTML = '<div class="error">Error: Se requiere ID del paciente</div>'
        return;
    }
    
    let url = `http://localhost:9797/api/citas/${id_s}/cancelar`;
    
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        const result = await response.json();
        getCitas_container.innerHTML = `
            <div class="cita-item">
                <strong>ID:</strong> ${result.data.id} | 
                <strong>Paciente ID:</strong> ${result.data.pacienteId} | 
                <strong>Doctor ID:</strong> ${result.data.doctorId} | 
                <strong>Fecha:</strong> ${result.data.fecha} | 
                <strong>Hora:</strong> ${result.data.hora} | 
                <strong>Motivo:</strong> ${result.data.motivo} | 
                <strong>Estado:</strong> ${result.data.estado}
            </div>`
    } catch (error) {
        console.log(`Error: ${error}`);
        getPacientes_container.innerHTML = `<div class="error">Error al actualizar paciente: ${error.message}</div>`
    }
}

async function print_citas(id) {
    let id_s
    let id_a
    let id_h
    if(!id) {
        getCitas_container.innerHTML = ''
        id_s = citas_id_input.value
    }else if(id === 1){
        if(!citas_historial_id_input.value) {
            getCitas_container.innerHTML = '<div class="error">No se encuentra historial</div>'
            return
        }
        id_h = citas_historial_id_input.value
    }else if(id === 2) {
        if(!get_doctores_id2.value) {
            getDoctores_container2.innerHTML = '<div class="error">No se encuentran agendas</div>'
            return
        }
        id_a = get_doctores_id2.value
    }
    let citas = await get_citas(id_s,id_a,id_h)
    
    if (!citas || !citas.data) {
        getCitas_container.innerHTML = '<div class="error">No se encontraron citas</div>'
        return
    }
    if(id === 2) {
        for(let i = 0; i < citas.data.length; i++) {
            getDoctores_container2.innerHTML += `
                <div class="cita-item">
                    <strong>ID:</strong> ${citas.data[i].id} | 
                    <strong>Paciente ID:</strong> ${citas.data[i].pacienteId} | 
                    <strong>Doctor ID:</strong> ${citas.data[i].doctorId} | 
                    <strong>Fecha:</strong> ${citas.data[i].fecha} | 
                    <strong>Hora:</strong> ${citas.data[i].hora} | 
                    <strong>Motivo:</strong> ${citas.data[i].motivo} | 
                    <strong>Estado:</strong> ${citas.data[i].estado}
                </div>`
    }
  else if(id_s) {
        getCitas_container.innerHTML = `
            <div class="cita-item">
                <strong>ID:</strong> ${citas.data.id} | 
                <strong>Paciente ID:</strong> ${citas.data.pacienteId} | 
                <strong>Doctor ID:</strong> ${citas.data.doctorId} | 
                <strong>Fecha:</strong> ${citas.data.fecha} | 
                <strong>Hora:</strong> ${citas.data.hora} | 
                <strong>Motivo:</strong> ${citas.data.motivo} | 
                <strong>Estado:</strong> ${citas.data.estado}
            </div>`
    } else {
        for(let i = 0; i < citas.data.length; i++) {
            getCitas_container.innerHTML += `
                <div class="cita-item">
                    <strong>ID:</strong> ${citas.data[i].id} | 
                    <strong>Paciente ID:</strong> ${citas.data[i].pacienteId} | 
                    <strong>Doctor ID:</strong> ${citas.data[i].doctorId} | 
                    <strong>Fecha:</strong> ${citas.data[i].fecha} | 
                    <strong>Hora:</strong> ${citas.data[i].hora} | 
                    <strong>Motivo:</strong> ${citas.data[i].motivo} | 
                    <strong>Estado:</strong> ${citas.data[i].estado}
                </div>`
        }
    }
}

async function get_estadisticas_doctores() {
    getEstadisticas_container.innerHTML = ''
    let url = ''
    url = 'http://localhost:9797/api/estadisticas/doctores'
    
    try {
        const results = await fetch(url)
        if (!results.ok) {
            throw new Error(`Error: ${results.status}`)
        }
        const datas = await results.json()
        getEstadisticas_container.innerHTML = `
            <div class="cita-item">
                <strong>Doctores:</strong> ${datas.data}
            </div>`
    } catch (error) {
        console.log(`Error: ${error}`)
        return null
    }
}

async function get_estadisticas_especialidades() {
    getEstadisticas_container.innerHTML = ''
    let url = ''
    url = 'http://localhost:9797/api/estadisticas/especialidades'
    
    try {
        const results = await fetch(url)
        if (!results.ok) {
            throw new Error(`Error: ${results.status}`)
        }
        const datas = await results.json()
        getEstadisticas_container.innerHTML = `
            <div class="cita-item">
                <strong>Especialidades:</strong> ${datas.data}
            </div>`
    } catch (error) {
        console.log(`Error: ${error}`)
        return null
    }
}

async function get_citas_filtro() {
    getCitasFiltro_container.innerHTML = '' 
    let fecha = citas_fecha_filtro.value
    let estado = citas_estado_filtro.value
    let url = 'http://localhost:9797/api/citas'
    const params = new URLSearchParams()
    if (fecha) params.append('fecha', fecha.replace(/\//g, '-'))
    if (estado) params.append('estado',estado)
    if (params.toString()) {
        url += `?${params.toString()}`
    }
    
    try {
        const results = await fetch(url)
        if (!results.ok) {
            throw new Error(`Error: ${results.status}`)
        }
        const datas = await results.json()
        for(let i = 0; i < datas.data.length; i++) {
            getCitasFiltro_container.innerHTML += `
                <div class="cita-item">
                    <strong>ID:</strong> ${datas.data[i].id} | 
                    <strong>Paciente ID:</strong> ${datas.data[i].pacienteId} | 
                    <strong>Doctor ID:</strong> ${datas.data[i].doctorId} | 
                    <strong>Fecha:</strong> ${datas.data[i].fecha} | 
                    <strong>Hora:</strong> ${datas.data[i].hora} | 
                    <strong>Motivo:</strong> ${datas.data[i].motivo} | 
                    <strong>Estado:</strong> ${datas.data[i].estado}
                </div>`
        }
    } catch (error) {
        console.log(`Error: ${error}`)
        getCitasFiltro_container.innerHTML = `<div class="error">Error al cargar citas: ${error.message}</div>`
    }
}
async function get_doctores_disponibles() {
    getFiltros_container.innerHTML = ''
    let fecha = doctores_fecha_filtro.value
    let hora = doctores_hora_filtro.value
    let url = 'http://localhost:9797/api/doctoresf/disponibles'
    const params = new URLSearchParams()
    if (fecha) params.append('fecha', fecha.replace(/\//g, '-'))
    if (hora) params.append('estado',hora)
    if (params.toString()) {
        url += `?${params.toString()}`
    }
    
    try {
        const results = await fetch(url)
        if (!results.ok) {
            throw new Error(`Error: ${results.status}`)
        }
        const datas = await results.json()
        console.log(datas)
        for(let i = 0; i < datas.data.length; i++) {
            getFiltros_container.innerHTML += `
                <div>
                    <strong>ID:</strong> ${datas.data[i].id} | 
                    <strong>Nombre:</strong> ${datas.data[i].nombre} | 
                    <strong>Especialidad:</strong> ${datas.data[i].especialidad} | 
                    <strong>Horario:</strong> ${datas.data[i].horarioInicio} - ${datas.data[i].horarioFin} | 
                    <strong>Disponibilidad:</strong> ${datas.data[i].diasDisponibles}
                </div>`
        }
    } catch (error) {
        console.log(`Error: ${error}`)
        return null
    }
}

async function citas_proximas() {
    getEstadisticas_container.innerHTML = ''
    let url = ''
    url = 'http://localhost:9797/api/proximas'
    
    try {
        const results = await fetch(url)
        if (!results.ok) {
            throw new Error(`Error: ${results.status}`)
        }
        const datas = await results.json()
        for(let i = 0; i < datas.data.length; i++) {
            getProximas_container.innerHTML += `
                <div class="cita-item">
                    <strong>ID:</strong> ${datas.data[i].id} | 
                    <strong>Paciente ID:</strong> ${datas.data[i].pacienteId} | 
                    <strong>Doctor ID:</strong> ${datas.data[i].doctorId} | 
                    <strong>Fecha:</strong> ${datas.data[i].fecha} | 
                    <strong>Hora:</strong> ${datas.data[i].hora} | 
                    <strong>Motivo:</strong> ${datas.data[i].motivo} | 
                    <strong>Estado:</strong> ${datas.data[i].estado}
                </div>`
        }
    } catch (error) {
        console.log(`Error: ${error}`)
        return null
    }
}

async function show_citas_programadas_hoy() {
    getCitasFiltro_container_front.innerHTML = '' 
    let fecha = new Date()
    const year = fecha.getFullYear();
    const month = fecha.getMonth();
    const date = fecha.getDate();
    fecha = `${year}-${(month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;

    console.log(fecha)
    let url = `http://localhost:9797/api/citas?fecha=${fecha}`
    
    try {
        const results = await fetch(url)
        if (!results.ok) {
            if(results.status === 404) {
                getCitasFiltro_container_front.innerHTML = `
                    <h2>Citas programadas hoy</h2>
                    No se a programado una cita hoy
                `
                return
            }
            throw new Error(`Error: ${results.status}`)
        }
        const datas = await results.json()
        getCitasFiltro_container_front.innerHTML = `<h2>Citas programadas hoy</h2>`
        for(let i = 0; i < datas.data.length; i++) {
            let paciente = await get_pacientes(datas.data[i].pacienteId)
            let doctor = await get_doctores_a(datas.data[i].doctorId)
            console.log(paciente+"\n"+doctor)
            getCitasFiltro_container_front.innerHTML += `
                <div">
                    <strong>Hora:</strong> ${datas.data[i].hora}<br>
                    <strong>Paciente:</strong> ${paciente.data.nombre}<br>
                    <strong>Doctor:</strong> ${doctor.data.nombre}<br>
                    <strong>Estado:</strong> ${datas.data[i].estado}<br>
                </div>`
        }
    } catch (error) {
        console.log(`Error: ${error}`)
        getCitasFiltro_container_front.innerHTML = `<div class="error">Error al cargar citas: ${error.message}</div>`
    }
}
async function show_citas_proximas() {
    citas_pendiente_24_horas.innerHTML = ''
    let url = 'http://localhost:9797/api/proximas'
    
    try {
        const results = await fetch(url)
        if (!results.ok) {
            if(results.status === 404) {
                citas_pendiente_24_horas.innerHTML = `
                    <h2>Citas pendientes proximas 24 horas</h2>
                    No se encuentra una cita en las proximas 24 horas
                `
            }
            throw new Error(`Error: ${results.status}`)
        }
        const datas = await results.json()
        citas_pendiente_24_horas.innerHTML = `<h2>Citas pendientes proximas 24 horas</h2>`
        for(let i = 0; i < datas.data.length; i++) {
            citas_pendiente_24_horas.innerHTML += `
                <div class="cita-item">
                    <strong>ID:</strong> ${datas.data[i].id}<br> 
                    <strong>Paciente ID:</strong> ${datas.data[i].pacienteId}<br> 
                    <strong>Doctor ID:</strong> ${datas.data[i].doctorId}<br> 
                    <strong>Fecha:</strong> ${datas.data[i].fecha}<br> 
                    <strong>Hora:</strong> ${datas.data[i].hora}<br> 
                    <strong>Motivo:</strong> ${datas.data[i].motivo}<br> 
                    <strong>Estado:</strong> ${datas.data[i].estado}
                </div>`
        }
    } catch (error) {
        console.log(`Error: ${error}`)
        return null
    }
}
let currentPage3 = window.location.pathname.split('/').pop()
if (currentPage3 === 'index.html' || currentPage3 === '') {
    show_citas_programadas_hoy()
    show_citas_proximas()
}
