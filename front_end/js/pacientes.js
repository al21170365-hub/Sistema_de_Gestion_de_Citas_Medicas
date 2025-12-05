const getPacientes_container = document.querySelector('.getPacientes_container')
const getPacientes_container_front = document.querySelector('.pasientes_registrados')
const get_paciente_id = document.querySelector('.paciente_id_input')

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

async function get_pacientes(id_s) {
    let url = ''
    if(id_s) {
        url = `http://localhost:9797/api/pacientes/${id_s}`
    } else {
        url = `http://localhost:9797/api/pacientes`
    }
    try {
        const results = await fetch(url)
        const datas = await results.json()
        if (!results.ok) {
            throw new Error(`Error: ${datas?.message}`)
        }
        return datas
    } catch (error) {
        console.log(`Error: ${error}`)
        return error
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
        
        const result = await response.json();
        const nuevo_p = document.querySelector('.nuevo_p')
        nuevo_p.innerHTML = `<div class="ok">${result?.message}</div>`
        if (!response.ok || (result && result.success === false)) {
           const errorMessage = result?.message || `Error: ${response.status} - ${response.statusText}`;
           throw new Error(errorMessage);
        }
    } catch (error) {
        getPacientes_container.innerHTML = `<div class="error">${error}</div>`
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
        const actualizar_p = document.querySelector('.actualizar_p')
        actualizar_p.innerHTML = `<div class="ok">${result?.message}</div>`
        if (!response.ok || (result && result.success === false)) {
           const errorMessage = result?.message || `Error: ${response.status} - ${response.statusText}`;
           throw new Error(errorMessage);
        }
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
            <table class="pacientes-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Edad</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Fecha Registro</th>
                    </tr>
                </thead>
                <tbody>
                     <tr>
                         <td>${pacientes.data.id}</td>
                         <td>${pacientes.data.nombre}</td>
                         <td>${pacientes.data.edad}</td>
                         <td>${pacientes.data.telefono}</td>
                         <td>${pacientes.data.email}</td>
                         <td>${pacientes.data.fechaRegistro}</td>
                    </tr>
                </tbody>
            </table>
       `;
    } else {
       getPacientes_container.innerHTML = `
            <table class="pacientes-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Edad</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Fecha Registro</th>
                    </tr>
                </thead>
                <tbody>
                    ${pacientes.data.map(paciente => `
                        <tr>
                            <td>${paciente.id}</td>
                            <td>${paciente.nombre}</td>
                            <td>${paciente.edad}</td>
                            <td>${paciente.telefono}</td>
                            <td>${paciente.email}</td>
                            <td>${paciente.fechaRegistro}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
       `;
    }
}

async function amount_pacientes() {
    let url = `http://localhost:9797/api/pacientes`
    
    try {
        const results = await fetch(url)
        const datas = await results.json()
        if (!results.ok) {
            throw new Error(`Error: ${datas?.message}`)
        }
        getPacientes_container_front.innerHTML = `
            <h2>Total de pacientes registrados</h2>
            Pacientes: ${datas.data.length}
        `
    } catch (error) {
        console.log(`Error: ${error}`)
        return error
    }
}
let currentPage2 = window.location.pathname.split('/').pop()
if (currentPage2 === 'index.html' || currentPage2 === '') {
    amount_pacientes()
}
