const fs = require('fs')
const path = require('path')

const DB_DOCTORES = path.join(__dirname,'../data/doctores.json')
const DB_PACIENTES = path.join(__dirname,'../data/pacientes.json')
const DB_CITAS = path.join(__dirname,'../data/citas.json')

const leerDB_DOCTORES = () => {
    try {
	const data = fs.readFileSync(DB_DOCTORES, 'utf-8')
	return JSON.parse(data)
    }catch(error) {
	return {}
    }
}
const escribirDB_DOCTORES = (data) => {
    try {
	fs.writeFileSync(DB_DOCTORES,JSON.stringify(data,null,2),'utf-8')
    }catch(error) {
	return false
    }
}
const obtenerDoctores = () => {
    const db = leerDB_DOCTORES()
    return db
}
const obtenerDoctoresId = (id) => {
    const db = leerDB_DOCTORES()
    return db.find(u => u.id === id)
}
const obtenerDoctorNE = (nombre,especialidad) => {
    const db = leerDB_DOCTORES()
    return db.find(u => u.nombre === nombre && u.especialidad === especialidad)
}
const obtenerDoctoresEspecialidad = (especialidad) => {
    const db = leerDB_DOCTORES()
    return db.filter(u => u.especialidad === especialidad)
}
const crearDoctor = (nombre, especialidad, horarioInicio, horarioFin, diasDisponibles) => {
    const db = leerDB_DOCTORES()
    let id = db.length > 0 ? Math.max(...db.map(u => parseInt(u.id.slice(1)))) + 1 : 1
    id = id.toString().length === 1 ? "D00"+id : id.toString().length === 2 ? "D0"+id : "D"+id 
    const nuevoDoctor = {id, nombre, especialidad, horarioInicio, horarioFin, diasDisponibles}

    db.push(nuevoDoctor)
    escribirDB_DOCTORES(db)
    return nuevoDoctor
}
//===============================================================================================================
const leerDB_PACIENTES = () => {
    try {
	const data = fs.readFileSync(DB_PACIENTES, 'utf-8')
	return JSON.parse(data)
    }catch(error) {
	return {}
    }
}
const escribirDB_PACIENTES = (data) => {
    try {
	fs.writeFileSync(DB_PACIENTES,JSON.stringify(data,null,2),'utf-8')
    }catch(error) {
	return false
    }
}
const obtenerPacientes = () => {
    const db = leerDB_PACIENTES()
    return db
}
const obtenerPacientesId = (id) => {
    const db = leerDB_PACIENTES()
    return db.find(u => u.id === id)
}
const obtenerPacienteEmail = (email) => {
    const db = leerDB_PACIENTES()
    return db.find(u => u.email === email)
}
const crearPaciente = (nombre,edad,telefono,email,fechaRegistro) => {
    const db = leerDB_PACIENTES()
    let id = db.length > 0 ? Math.max(...db.map(u => parseInt(u.id.slice(1)))) + 1 : 1
    id = id.toString().length === 1 ? "P00"+id : id.toString().length === 2 ? "P0"+id : "P"+id 
    const nuevoPaciente = {id,nombre,edad,telefono,email,fechaRegistro}

    db.push(nuevoPaciente)
    escribirDB_PACIENTES(db)
    return nuevoPaciente
}
const actualizarPaciente = (id,nombre,edad,telefono,email) => {
    const db = leerDB_PACIENTES()
    console.log(db)
    const index = db.findIndex(u => u.id === id)

    if(index === -1) return null
    if(nombre) db[index].nombre = nombre
    if(edad) db[index].edad = edad
    if(telefono) db[index].telefono = telefono
    if(email) db[index].email = email
    escribirDB_PACIENTES(db)
    return db[index]
}
//===============================================================================================================
const leerDB_CITAS = () => {
    try {
	const data = fs.readFileSync(DB_CITAS, 'utf-8')
	return JSON.parse(data)
    }catch(error) {
	return {}
    }
}
const escribirDB_CITAS = (data) => {
    try {
	fs.writeFileSync(DB_CITAS,JSON.stringify(data,null,2),'utf-8')
    }catch(error) {
	return false
    }
}
const obtenerCitas = () => {
    const db = leerDB_CITAS()
    return db
}
const obtenerCitasId = (id) => {
    const db = leerDB_CITAS()
    return db.find(u => u.id === id)
}
const crearCita = (pacienteId,doctorId,fecha,hora,motivo,estado) => {
    const db = leerDB_CITAS()
    let id = db.length > 0 ? Math.max(...db.map(u => parseInt(u.id.slice(1)))) + 1 : 1
    id = id.toString().length === 1 ? "C00"+id : id.toString().length === 2 ? "C0"+id : "C"+id 
    const nuevaCita = {id,pacienteId,doctorId,fecha,hora,motivo,estado}

    db.push(nuevaCita)
    escribirDB_CITAS(db)
    return nuevaCita
}
const cancelarCita = (id) => {
    const db = leerDB_CITAS()
    const index = db.findIndex(u => u.id === id)

    if(index === -1) return null
    db[index].estado = "cancelada"
    escribirDB_CITAS(db)
    return db[index]
}
const obtenerHistorialCitasId = (id) => {
    const db = leerDB_CITAS()
    return db.filter(u => u.pacienteId === id)
}
const agendaDoctor = (id) => {
    const db = leerDB_CITAS()
    return db.filter(u => u.doctorId === id)
}
const obtenerCitaHoraFecha = (hora,fecha) => {
    const db = leerDB_CITAS()
    return db.find(u => u.hora === hora && u.fecha === fecha)
}

module.exports = {
    obtenerDoctores,
    obtenerDoctoresId,
    obtenerDoctorNE,
    obtenerDoctoresEspecialidad,
    crearDoctor,
    obtenerPacientes,
    obtenerPacientesId,
    obtenerPacienteEmail,
    crearPaciente,
    actualizarPaciente,
    obtenerCitas,
    obtenerCitasId,
    crearCita,
    cancelarCita,
    obtenerHistorialCitasId,
    agendaDoctor,
    obtenerCitaHoraFecha
}
