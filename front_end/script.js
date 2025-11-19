const getDoctores_container = document.querySelector('.getDoctores_container')
const getPacientes_container = document.querySelector('.getPacientes_container')
const getDoctores_btn = document.querySelector('.getDoctores_btn')
const get_doctores_id = document.querySelector('.doctor_id_input')
const get_paciente_id = document.querySelector('.paciente_id_input')
const get_doctores_especialidad = document.querySelector('.doctor_especialidad_input')
const get_doctor_agenda = document.querySelector('.doctor_agenda_input')

const doctor_nombre_nuevo = document.querySelector('.doctor_nombre_nuevo')
const doctor_especialidad_nuevo = document.querySelector('.doctor_especialidad_nuevo')
const doctor_inicio_nuevo = document.querySelector('.doctor_inicio_nuevo')
const doctor_final_nuevo = document.querySelector('.doctor_final_nuevo')
const doctor_dias_nuevo = document.querySelectorAll('.doctor_dias_nuevo')

const paciente_id_actualizar = document.querySelector('.paciente_id_actualizar')
const paciente_nombre_actualizar = document.querySelector('.paciente_nombre_actualizar')
const paciente_edad_actualizar = document.querySelector('.paciente_edad_actualizar')
const paciente_telefono_actualizar = document.querySelector('.paciente_telefono_actualizar')
const paciente_email_actualizar = document.querySelector('.paciente_email_actualizar')

const paciente_id_nuevo = document.querySelector('.paciente_id_nuevo')
const paciente_nombre_nuevo = document.querySelector('.paciente_nombre_nuevo')
const paciente_edad_nuevo = document.querySelector('.paciente_edad_nuevo')
const paciente_telefono_nuevo = document.querySelector('.paciente_telefono_nuevo')
const paciente_email_nuevo = document.querySelector('.paciente_email_nuevo')

const getCitas_container = document.querySelector('.getCitas_container')
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

async function get_doctores() {
    getDoctores_container.innerHTML = ''
    const especialidad = get_doctores_especialidad.value
    const agenda = get_doctor_agenda.value
    const id_s = get_doctores_id.value
    let url = ''
    
    if(id_s) {
        url = `http://localhost:9797/api/doctores/${id_s}`
    } else if(especialidad){
        url = `http://localhost:9797/api/doctores/especialidad/${especialidad}`
    } else if(agenda) {
        url = `http://localhost:9797/api/citas/doctor/${agenda}`
    } else {
        url = `http://localhost:9797/api/doctores`
    }
    
    try {
        const results = await fetch(url)
        if (!results.ok) {
            throw new Error(`Error: ${results.status}`)
        }
        const datas = await results.json()
        if(id_s || (datas.data && !Array.isArray(datas.data))) {
            print_doctor(datas)
        } else {
            print_doctores(datas)
        }
    } catch (error) {
        console.log(`Error: ${error}`)
        getDoctores_container.innerHTML = `<div class="error">Error al cargar doctores: ${error.message}</div>`
    }
}

async function post_doctor() {
    getPacientes_container.innerHTML = '';
    const nombre = doctor_nombre_nuevo.value
    const especialidad = doctor_especialidad_nuevo.value
    const inicio = doctor_inicio_nuevo.value
    const final = doctor_final_nuevo.value
    const dias = Array.from(doctor_dias_nuevo)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
    
    let url = `http://localhost:9797/api/doctores`;
    const addData = {
        "nombre": nombre,
        "especialidad": especialidad,
        "horarioInicio": inicio,
        "horarioFin": final,
        "diasDisponibles": dias
    };
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(addData)
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        const result = await response.json();
    } catch (error) {
        console.log(`Error: ${error}`);
        getPacientes_container.innerHTML = `<div class="error">Error al actualizar paciente: ${error.message}</div>`
    }
}

function print_doctores(doctores) {
    if (!doctores.data || doctores.data.length === 0) {
        getDoctores_container.innerHTML = '<div>No se encontraron doctores</div>'
        return
    }
    
    for(let i = 0; i < doctores.data.length; i++) {
        getDoctores_container.innerHTML += `
        <div class="doctor-item">
            <strong>ID:</strong> ${doctores.data[i].id} | 
            <strong>Nombre:</strong> ${doctores.data[i].nombre} | 
            <strong>Especialidad:</strong> ${doctores.data[i].especialidad} | 
            <strong>Horario:</strong> ${doctores.data[i].horarioInicio} - ${doctores.data[i].horarioFin} | 
            <strong>Disponibilidad:</strong> ${doctores.data[i].diasDisponibles}
        </div>`
    }
}

function print_doctor(doctor) {
    if (!doctor.data) {
        getDoctores_container.innerHTML = '<div>No se encontró el doctor</div>'
        return
    }
    
    getDoctores_container.innerHTML = `
    <div class="doctor-item">
        <strong>ID:</strong> ${doctor.data.id}<br>
        <strong>Nombre:</strong> ${doctor.data.nombre}<br>
        <strong>Especialidad:</strong> ${doctor.data.especialidad}<br>
        <strong>Horario Inicio:</strong> ${doctor.data.horarioInicio}<br>
        <strong>Horario Fin:</strong> ${doctor.data.horarioFin}<br>
        <strong>Disponibilidad:</strong> ${doctor.data.diasDisponibles}
    </div>`
}

//=====================================================================================================================================================================

async function get_pacientes(id_s) {
    let url = ''
    if(id_s) {
        url = `http://localhost:9797/api/pacientes/${id_s}`
    } else {
        url = `http://localhost:9797/api/pacientes`
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

async function post_paciente() {
    getPacientes_container.innerHTML = '';
    const nombre = paciente_nombre_nuevo.value
    const edad = paciente_edad_nuevo.value
    const telefono = paciente_telefono_nuevo.value
    const email = paciente_email_nuevo.value
    
    let url = `http://localhost:9797/api/pacientes`;
    const addData = {
        "nombre": nombre,
        "edad": edad,
        "telefono": telefono,
        "email": email
    };
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(addData)
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        const result = await response.json();
    } catch (error) {
        console.log(`Error: ${error}`);
        getPacientes_container.innerHTML = `<div class="error">Error al actualizar paciente: ${error.message}</div>`
    }
}

async function put_paciente() {

    getPacientes_container.innerHTML = '';
    const id_s = paciente_id_actualizar.value;
    const nombre = paciente_nombre_actualizar.value
    const edad = paciente_edad_actualizar.value
    const telefono = paciente_telefono_actualizar.value
    const email = paciente_email_actualizar.value
    
    if (!id_s) {
        getPacientes_container.innerHTML = '<div class="error">Error: Se requiere ID del paciente</div>'
        return;
    }
    
    let url = `http://localhost:9797/api/pacientes/${id_s}`;
    const updatedData = {
        "nombre": nombre,
        "edad": edad,
        "telefono": telefono,
        "email": email
    };
    
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        });
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        const result = await response.json();
        getPacientes_container.innerHTML = `
            <div class="success">
                <strong>Paciente actualizado exitosamente:</strong><br>
                <strong>ID:</strong> ${result.data.id} | 
                <strong>Nombre:</strong> ${result.data.nombre} | 
                <strong>Edad:</strong> ${result.data.edad} | 
                <strong>Teléfono:</strong> ${result.data.telefono} | 
                <strong>Email:</strong> ${result.data.email} | 
                <strong>Fecha registro:</strong> ${result.data.fechaRegistro}
            </div>`
    } catch (error) {
        console.log(`Error: ${error}`);
        getPacientes_container.innerHTML = `<div class="error">Error al actualizar paciente: ${error.message}</div>`
    }
}

async function get_put_paciente() {
    const id_s = paciente_id_actualizar.value;
    if (!id_s) {
        alert('Por favor ingrese un ID de paciente')
        return
    }
    
    const paciente = await get_pacientes(id_s)
    
    if (!paciente || !paciente.data) {
        alert('Paciente no encontrado')
        return
    }
    
    paciente_nombre_actualizar.value = paciente.data.nombre || ''
    paciente_edad_actualizar.value = paciente.data.edad || ''
    paciente_telefono_actualizar.value = paciente.data.telefono || ''
    paciente_email_actualizar.value = paciente.data.email || ''
}

async function print_pacientes() {
    getPacientes_container.innerHTML = ''
    const id_s = get_paciente_id.value
    let pacientes = await get_pacientes(id_s)
    
    if (!pacientes || !pacientes.data) {
        getPacientes_container.innerHTML = '<div class="error">No se encontraron pacientes</div>'
        return
    }
    
    if(id_s) {
        getPacientes_container.innerHTML = `
            <div class="paciente-item">
                <strong>ID:</strong> ${pacientes.data.id} | 
                <strong>Nombre:</strong> ${pacientes.data.nombre} | 
                <strong>Edad:</strong> ${pacientes.data.edad} | 
                <strong>Teléfono:</strong> ${pacientes.data.telefono} | 
                <strong>Email:</strong> ${pacientes.data.email} | 
                <strong>Fecha registro:</strong> ${pacientes.data.fechaRegistro}
            </div>`
    } else {
        for(let i = 0; i < pacientes.data.length; i++) {
            getPacientes_container.innerHTML += `
                <div class="paciente-item">
                    <strong>ID:</strong> ${pacientes.data[i].id} | 
                    <strong>Nombre:</strong> ${pacientes.data[i].nombre} | 
                    <strong>Edad:</strong> ${pacientes.data[i].edad} | 
                    <strong>Teléfono:</strong> ${pacientes.data[i].telefono} | 
                    <strong>Email:</strong> ${pacientes.data[i].email} | 
                    <strong>Fecha registro:</strong> ${pacientes.data[i].fechaRegistro}
                </div>`
        }
    }
}

//=====================================================================================================================================================================

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
            </div>`
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

async function print_citas() {
    getCitas_container.innerHTML = ''
    const id_s = citas_id_input.value
    const id_a = citas_agenda_id_input.value
    const id_h = citas_historial_id_input.value
    let citas = await get_citas(id_s,id_a,id_h)
    
    if (!citas || !citas.data) {
        getCitas_container.innerHTML = '<div class="error">No se encontraron citas</div>'
        return
    }
    
    if(id_s) {
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
    
}