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

const doctor_id_actualizar = document.querySelector('.doctor_id_actualizar')
const doctor_nombre_actualizar = document.querySelector('.doctor_nombre_actualizar')
const doctor_especialidad_actualizar = document.querySelector('.doctor_especialidad_actualizar')
const doctor_horainicio_actualizar = document.querySelector('.doctor_horainicio_actualizar')
const doctor_horafin_actualizar = document.querySelector('.doctor_horafin_actualizar')
const doctor_dias_actualizar = document.querySelectorAll('.doctor_dias_actualizar')
const doctor_actualizar_r = document.querySelector('.doctor_actualizar_r')

async function get_doctores(id) {
    let id_s
    let especialidad
    if(!id) {
        getDoctores_container.innerHTML = ''
        especialidad = get_doctores_especialidad.value
        id_s = get_doctores_id.value
    }else {
      id_s = id
    }
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
        // if (!results.ok) {
        //     throw new Error(`Error: ${results.status}`)
        // }
        const datas = await results.json()
        if(!results.ok) {
            alert(`${datas?.message}`)
            return
        }
        // getDoctores_container.innerHTML = `${datas?.message}`
        if(id) {
            return datas
        }
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
        const datas = await results.json()
        if (!results.ok) {
            alert(`{datas?.message}`)
            return
        }
        return datas
    } catch (error) {
        console.log(`Error: ${error}`)
        getDoctores_container.innerHTML = `<div class="error">Error al cargar doctores: ${error.message}</div>`
    }
}

async function post_doctor() {
    const nuevo_d = document.querySelector('.nuevo_d')
    nuevo_d.innerHTML = '';
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
        
        
        const result = await response.json();
        if (!response.ok) {
            alert(`${result?.message}`)
            return
        }
        alert(`${result?.message}`)
        // nuevo_d.innerHTML = `${result?.message}`
    } catch (error) {
        console.log(`Error: ${error}`);
        nuevo_d.innerHTML = `<div class="error">Error al crear doctor: ${error.message}</div>`
    }
}
async function put_doctor() {

    doctor_actualizar_r.innerHTML = '';
    const id_s = doctor_id_actualizar.value;
    const nombre = doctor_nombre_actualizar.value
    const especialidad = doctor_especialidad_actualizar.value
    const horarioInicio = doctor_horainicio_actualizar.value
    const horarioFin = doctor_horafin_actualizar.value
    const dias = Array.from(doctor_dias_actualizar)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    if (!id_s) {
        alert(`Error: Se requiere ID del doctor`)
        // doctor_actualizar_r.innerHTML = '<div class="error">Error: Se requiere ID del doctor</div>'
        return;
    }

    let url = `http://localhost:9797/api/doctores/${id_s}`;
    const updatedData = {
        "nombre": nombre,
        "especialidad": especialidad,
        "horarioInicio": horarioInicio,
        "horarioFin": horarioFin,
        "diasDisponibles": dias
    };

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        });


        const result = await response.json();
        if (!response.ok) {
            alert(`${result?.message}`)
            return

        }
        alert(`${result?.message}`)
        // doctor_actualizar_r.innerHTML = `<div class="ok">${result?.message}</div>`
        // if (!response.ok || (result && result.success === false)) {
        //    const errorMessage = result?.message || `Error: ${response.status} - ${response.statusText}`;
        //    throw new Error(errorMessage);
        // }
    } catch (error) {
        console.log(`Error: ${error}`);
        doctor_actualizar_r.innerHTML = `<div class="error">Error al actualizar doctor: ${error.message}</div>`
    }
}
async function get_put_doctor() {
    const id_s = doctor_id_actualizar.value;
    if (!id_s) {
        alert('Por favor ingrese un ID de doctor')
        return
    }
    
    const doctor = await get_doctores(id_s)
    
    if (!doctor || !doctor.data) {
        alert('Doctor no encontrado')
        return
    }
    
    doctor_nombre_actualizar.value = doctor.data.nombre || ''
    doctor_especialidad_actualizar.value = doctor.data.especialidad || ''
    doctor_horainicio_actualizar.value = doctor.data.horarioInicio || ''
    doctor_horafin_actualizar.value = doctor.data.horarioFin || ''
    const dias = Array.isArray(doctor.data.diasDisponibles) 
                ? doctor.data.diasDisponibles 
                : doctor.data.diasDisponibles.split(',');
    doctor_dias_actualizar.forEach(checkbox => {
                checkbox.checked = dias.includes(checkbox.value);
    });
    
}
function print_doctores(doctores) {
    if (!doctores.data || doctores.data.length === 0) {
        alert(`No se encontraron doctores`)
        // getDoctores_container.innerHTML = '<div>No se encontraron doctores</div>'
        return
    }
    
    getDoctores_container.innerHTML = `
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
                 ${doctores.data.map(doctor => `
                     <tr>
                         <td>${doctor.id}</td>
                         <td>${doctor.nombre}</td>
                         <td>${doctor.especialidad}</td>
                         <td>${doctor.horarioInicio} - ${doctor.horarioFin}</td>
                         <td>${doctor.diasDisponibles}</td>
                     </tr>
                 `).join('')}
             </tbody>
         </table>
    `;
}

function print_doctor(doctor) {
    if (!doctor.data) {
        alert(`No se encontró el doctor`)
        // getDoctores_container.innerHTML = '<div>No se encontró el doctor</div>'
        return
    }
    console.log(doctor)
    getDoctores_container.innerHTML = `
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
                 <tr>
                     <td>${doctor.data.id}</td>
                     <td>${doctor.data.nombre}</td>
                     <td>${doctor.data.especialidad}</td>
                     <td>${doctor.data.horarioInicio} - ${doctor.data.horarioFin}</td>
                     <td>${doctor.data.diasDisponibles}</td>
                 </tr>
             </tbody>
         </table>
    `;
}

async function amount_doctores() {
    getDoctores_container_front.innerHTML = ''
    
    let url = `http://localhost:9797/api/doctores`
    
    try {
        const results = await fetch(url)
        const datas = await results.json()
        option = ''
        const especialidad_doctor = document.querySelector('#especialidad-doctor')
        for(let i=0;i<datas.data.length;i++) {
            if(i===0) {
                option += `<option value="">Todas especialidades</option>`
            }
            option += `<option value="${datas.data[i].especialidad}">${datas.data[i].especialidad}</option>`
        }
        especialidad_doctor.innerHTML = `${option}`
        if (!results.ok) {
            throw new Error(`${datas?.message}`)
        }
        getDoctores_container_front.innerHTML = `
            <h2>Total de doctores activos</h2>
            Doctores: ${datas.data.length}
        `
    } catch (error) {
        const doctores_registrados = document.querySelector('.doctores_registrados')
        doctores_registrados.innerHTML = `${error}`
        console.log(`Error: ${error}`)
    }
}
let currentPage = window.location.pathname.split('/').pop()
if (currentPage === 'index.html' || currentPage === '') {
    amount_doctores()
}
