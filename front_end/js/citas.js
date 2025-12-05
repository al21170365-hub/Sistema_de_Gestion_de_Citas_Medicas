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

const myChart = document.querySelector('.myChart')
const ctx = document.getElementById('myChart');
const citas_mes = document.querySelector('.citas_mes')
const myChart2 = document.querySelector('.myChart2')
const tasa_citas_canceladas = document.querySelector('.tasa_citas_canceladas')
const notificationBadge = document.getElementById('notificationBadge')

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
        const datas = await results.json()
        if (!results.ok) {
            throw new Error(`Error: ${datas?.message}`)
        }
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
        const nuevaa = document.querySelector('.nuevaa')
        nuevaa.innerHTML = `${result?.message}`
    } catch (error) {
        getCitas_container.innerHTML = `<div class="error">Error al actualizar paciente: ${error.message}</div>`
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
        const form_group = document.querySelector('.canceladaa')
        form_group.innerHTML = `${result?.message}`
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
        id_s = citas_id_input.value;
        // id_a = citas_agenda_id_input.value
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
    if(id === 4) {
        mostrarTasaCancelacionesSimple(citas.data)
        return
    }
    if(id === 3) {
      mostrarResumenMensualActual(citas.data)
      return
    }
    if(id === 2) {
        getDoctores_container2.innerHTML = ''
       getDoctores_container2.innerHTML = `
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
                     <tr>
                    ${citas.data.map(cita => `
                         <td>${cita.id}</td>
                         <td>${cita.pacienteId}</td>
                         <td>${cita.doctorId}</td>
                         <td>${cita.fecha}</td>
                         <td>${cita.hora}</td>
                         <td>${cita.motivo}</td>
                         <td>${cita.estado}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
       `;
    }
  else if(id_s) {
       getCitas_container.innerHTML = `
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
                     <tr>
                         <td>${citas.data.id}</td>
                         <td>${citas.data.pacienteId}</td>
                         <td>${citas.data.doctorId}</td>
                         <td>${citas.data.fecha}</td>
                         <td>${citas.data.hora}</td>
                         <td>${citas.data.motivo}</td>
                         <td>${citas.data.estado}</td>
                    </tr>
                </tbody>
            </table>
       `;
    } else {
       getCitas_container.innerHTML = `
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
                     <tr>
                    ${citas.data.map(cita => `
                         <td>${cita.id}</td>
                         <td>${cita.pacienteId}</td>
                         <td>${cita.doctorId}</td>
                         <td>${cita.fecha}</td>
                         <td>${cita.hora}</td>
                         <td>${cita.motivo}</td>
                         <td>${cita.estado}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
       `;
    }
}
function mostrarResumenMensualActual(citas) {
    // Obtener el año actual
    const añoActual = new Date().getFullYear();
    
    // Inicializar contadores para cada mes (0-11 representa enero-diciembre)
    const citasPorMes = Array(12).fill(0);
    const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Asegurarse de que citas sea un array
    const listaCitas = Array.isArray(citas) ? citas : [citas];

    // Filtrar y contar citas del año actual
    listaCitas.forEach(cita => {
        if (cita && cita.fecha) {
            const fechaCita = new Date(cita.fecha);
            const añoCita = fechaCita.getFullYear();
            
            // Solo contar citas del año actual
            if (añoCita === añoActual) {
                const mes = fechaCita.getMonth(); // 0-11
                citasPorMes[mes]++;
            }
        }
    });

    // Calcular totales
    let totalCitas = 0;
    let cant = [];
    
    citasPorMes.forEach((cantidad, index) => {
        totalCitas += cantidad;
        cant.push(cantidad);
    });

    myChart.innerHTML = `<h3>Resumen de Citas ${añoActual}</h3>`;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nombresMeses,
            datasets: [{
                label: `Citas por mes ${añoActual}`,
                data: cant,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Citas: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Citas'
                    },
                    ticks: {
                        stepSize: 1
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: `Meses del ${añoActual}`
                    }
                }
            }
        }
    });

    let textoResumen = `<div style="margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px;">`;
    textoResumen += `<p><strong>Total de citas en ${añoActual}:</strong> ${totalCitas}</p>`;
    textoResumen += `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">`;
    
    citasPorMes.forEach((cantidad, index) => {
        textoResumen += `<div style="padding: 5px;">
            <strong>${nombresMeses[index]}:</strong> ${cantidad}
        </div>`;
    });
    
    textoResumen += `</div></div>`;
}

async function get_estadisticas_doctores() {
    getEstadisticas_container.innerHTML = ''
    // myChart2.innerHTML = ''
    let url = ''
    url = 'http://localhost:9797/api/estadisticas/doctores'
    
    try {
        const results = await fetch(url)
        if (!results.ok) {
            throw new Error(`Error: ${results.status}`)
        }
        const datas = await results.json()
        //console.log(datas.data)
        //mostrarResumenEstadisticasDoctores(datas)
        getEstadisticas_container.innerHTML = `
            <div class="cita-item">
                <strong>Doctores:</strong> ${datas.data[0][0]}
            </div>`
    } catch (error) {
        console.log(`Error: ${error}`)
        return null
    }
}
function mostrarResumenEstadisticasEspecialidades(datas) {
    // Extraer labels (IDs de doctores) y datos (cantidad de citas)
    const labels = datas.data.map(item => item[0]); // ["D001", "D002", "D003"]
    const datos = datas.data.map(item => item[1]);  // [5, 5, 5]

    // O puedes extraer nombres si los tienes
    // const labels = datas.map(item => `Dr. ${item[0]}`);

    // Calcular total
    const totalCitas = datos.reduce((sum, current) => sum + current, 0);

    // Colores para las barras
    const colores = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)'
    ];

    // Crear el gráfico
    new Chart(myChart2, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Citas',
                data: datos,
                backgroundColor: colores.slice(0, labels.length),
                borderColor: colores.map(color => color.replace('0.7', '1')),
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'x', // 'x' para barras verticales, 'y' para horizontales
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: true,
                    text: `Especialidades más solicitados - Total: ${totalCitas} citas`,
                    font: {
                        size: 16
                    },
                    padding: 20
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const porcentaje = ((context.parsed.y / totalCitas) * 100).toFixed(1);
                            return `Citas: ${context.parsed.y} (${porcentaje}%)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Citas'
                    },
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            if (Number.isInteger(value)) {
                                return value;
                            }
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Doctores'
                    }
                }
            }
        }
    });
}

async function get_estadisticas_especialidades(id) {
    if(!id) {
        getEstadisticas_container.innerHTML = ''
    }
    let url = ''
    url = 'http://localhost:9797/api/estadisticas/especialidades'
    
    try {
        const results = await fetch(url)
        if (!results.ok) {
            throw new Error(`Error: ${results.status}`)
        }
        const datas = await results.json()
        if(id) {
            mostrarResumenEstadisticasEspecialidades(datas)
            return
        }
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
       getCitasFiltro_container.innerHTML = `
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
                     <tr>
                    ${datas.data.map(cita => `
                         <td>${cita.id}</td>
                         <td>${cita.pacienteId}</td>
                         <td>${cita.doctorId}</td>
                         <td>${cita.fecha}</td>
                         <td>${cita.hora}</td>
                         <td>${cita.motivo}</td>
                         <td>${cita.estado}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
       `;
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
       getFiltros_container.innerHTML = `
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
                    ${datas.data.map(doctor => `
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
    } catch (error) {
        console.log(`Error: ${error}`)
        return null
    }
}

// async function citas_proximas() {
//     getEstadisticas_container.innerHTML = ''
//     let url = ''
//     url = 'http://localhost:9797/api/proximas'
//
//     try {
//         const results = await fetch(url)
//         if (!results.ok) {
//             throw new Error(`Error: ${results.status}`)
//         }
//         const datas = await results.json()
//        getProximas_container.innerHTML = `
//             <table class="pacientes-table">
//                 <thead>
//                     <tr>
//                         <th>ID</th>
//                         <th>Paciente</th>
//                         <th>Doctor</th>
//                         <th>Fecha</th>
//                         <th>Hora</th>
//                         <th>Motivo</th>
//                         <th>Estado</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                      <tr>
//                     ${datas.data.map(cita => `
//                          <td>${cita.id}</td>
//                          <td>${cita.pacienteId}</td>
//                          <td>${cita.doctorId}</td>
//                          <td>${cita.fecha}</td>
//                          <td>${cita.hora}</td>
//                          <td>${cita.motivo}</td>
//                          <td>${cita.estado}</td>
//                     </tr>
//                     `).join('')}
//                 </tbody>
//             </table>
//             <p>${datas?.message}</p>
//        `;
//     } catch (error) {
//         console.log(`Error: ${error}`)
//         return null
//     }
// }

async function show_citas_programadas_hoy() {
    getCitasFiltro_container_front.innerHTML = '' 
    let fecha = new Date()
    let cont = 0;
    const year = fecha.getFullYear();
    const month = fecha.getMonth();
    const date = fecha.getDate();
    fecha = `${year}-${(month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;

    let url = `http://localhost:9797/api/citas?fecha=${fecha}&estado=programada`
    
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
        notificationBadge.innerText = datas.data.length
        // Primero, construimos todas las filas de la tabla
        let filasHTML = ''
        
        for(let i = 0; i < datas.data.length; i++) {
            let paciente = await get_pacientes(datas.data[i].pacienteId);
            let doctor = await get_doctores_a(datas.data[i].doctorId);
            
            filasHTML += `
                <tr>
                    <td>${datas.data[i].hora}</td>
                    <td>${paciente.data.nombre}</td>
                    <td>${doctor.data.nombre}</td>
                    <td>${datas.data[i].estado}</td>
                </tr>`
        }
        
        // Luego, creamos UNA sola tabla con todas las filas
        getCitasFiltro_container_front.innerHTML = `
            <h3><i class="fas fa-calendar-day"></i> Citas Programadas para Hoy</h3>
            <table class="pacientes-table">
                <thead>
                    <tr>
                        <th>Hora</th>
                        <th>Paciente</th>
                        <th>Doctor</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${filasHTML}
                </tbody>
            </table>
        `
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
       citas_pendiente_24_horas.innerHTML = `
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
                     <tr>
                    ${datas.data.map(cita => `
                         <td>${cita.id}</td>
                         <td>${cita.pacienteId}</td>
                         <td>${cita.doctorId}</td>
                         <td>${cita.fecha}</td>
                         <td>${cita.hora}</td>
                         <td>${cita.motivo}</td>
                         <td>${cita.estado}</td>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
       `;
    } catch (error) {
        console.log(`Error: ${error}`)
        return null
    }
}

function mostrarTasaCancelacionesSimple(citas) {
    const añoActual = new Date().getFullYear();
    const programadasPorMes = Array(12).fill(0);
    const canceladasPorMes = Array(12).fill(0);
    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const listaCitas = Array.isArray(citas) ? citas : [citas];

    listaCitas.forEach(cita => {
        if (cita && cita.fecha && cita.estado) {
            const fecha = new Date(cita.fecha);
            if (fecha.getFullYear() === añoActual) {
                const mes = fecha.getMonth();
                const estado = cita.estado.toLowerCase();
                
                if (estado === 'programada') {
                    programadasPorMes[mes]++;
                } else if (estado === 'cancelada') {
                    canceladasPorMes[mes]++;
                }
            }
        }
    });

    const totalProgramadas = programadasPorMes.reduce((a, b) => a + b, 0);
    const totalCanceladas = canceladasPorMes.reduce((a, b) => a + b, 0);
    const totalCitas = totalProgramadas + totalCanceladas;
    const tasaCancelacion = totalCitas > 0 ? ((totalCanceladas / totalCitas) * 100).toFixed(1) : 0;

  // document.querySelector('.tasa_citas_canceladasR').innerHTML = `<h1>Porcentaje de citas canceladas</h1><h3>Tasa de Cancelación: ${tasaCancelacion}%</h3>`;
    
    new Chart(tasa_citas_canceladas, {
        type: 'bar',
        data: {
            labels: nombresMeses,
            datasets: [
                {
                    label: 'Programadas',
                    data: programadasPorMes,
                    backgroundColor: '#4CAF50',
                },
                {
                    label: 'Canceladas',
                    data: canceladasPorMes,
                    backgroundColor: '#F44336',
                },
                {
                  label: `Tasa de cancelacion: ${tasaCancelacion}%`,
                    backgroundColor: '#F0F0F0',
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    beginAtZero: true
                }
            }
        }
    });
}
let currentPage3 = window.location.pathname.split('/').pop()
if (currentPage3 === 'index.html' || currentPage3 === '') {
    show_citas_programadas_hoy()
    show_citas_proximas()
    print_citas(3)
    get_estadisticas_especialidades(4)
    // get_estadisticas_doctores()
    print_citas(4)
}
