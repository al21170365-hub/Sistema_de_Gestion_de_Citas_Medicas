const getDoctores_container = document.querySelector('.getDoctores_container')
const getDoctores_container_front = document.querySelector('.doctores_registrados')
const getDoctores_btn = document.querySelector('.getDoctores_btn')
const get_doctores_id = document.querySelector('.doctor_id_input')
const get_doctores_especialidad = document.querySelector('.doctor_especialidad_input')
const doctor_nombre_nuevo = document.querySelector('.doctor_nombre_nuevo')
const doctor_especialidad_nuevo = document.querySelector('.doctor_especialidad_nuevo')
const doctor_inicio_nuevo = document.querySelector('.doctor_inicio_nuevo')
const doctor_final_nuevo = document.querySelector('.doctor_final_nuevo')
const doctor_dias_nuevo = document.querySelectorAll('.doctor_dias_nuevo')

async function get_doctores() {
    getDoctores_container.innerHTML = ''
    const especialidad = get_doctores_especialidad.value
    const id_s = get_doctores_id.value
    let url = ''
    
    if(id_s) {
        url = `http://localhost:9797/api/doctores/${id_s}`
    } else if(especialidad){
        url = `http://localhost:9797/api/doctores/especialidad/${especialidad}`
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
async function get_doctores_a(id_a) {
    let url = `http://localhost:9797/api/doctores/${id_a}`
    
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

async function amount_doctores() {
    getDoctores_container_front.innerHTML = ''
    
    let url = `http://localhost:9797/api/doctores`
    
    try {
        const results = await fetch(url)
        if (!results.ok) {
            throw new Error(`Error: ${results.status}`)
        }
        const datas = await results.json()
        getDoctores_container_front.innerHTML = `
            <h2>Total de doctores activos</h2>
            Doctores: ${datas.data.length}
        `
    } catch (error) {
        console.log(`Error: ${error}`)
        getDoctores_container_front.innerHTML = `<div class="error">Error al cargar doctores: ${error.message}</div>`
    }
}
let currentPage = window.location.pathname.split('/').pop()
if (currentPage === 'index.html' || currentPage === '') {
    amount_doctores()
}
