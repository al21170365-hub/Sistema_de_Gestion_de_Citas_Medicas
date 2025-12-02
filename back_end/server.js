const express = require('express')
const {
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
} = require('./utils/fileManager')
const app = express()
const cors = require('cors');
const PORT = process.env.PORT || 9797

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.get('/', (req,res) => {
    res.send('!Servidor Express funcionando correctamente!')
})
app.get('/api/doctores', (req,res) => {
    const doctores = obtenerDoctores()
    if(doctores.length === 0) {
	return res.status(404).json({
	    success: false,
	    message: 'No se encuentra ningun doctor registrado'
	})
    }
    res.json({
	success: true,
	data: doctores
    })
})
app.get('/api/doctores/:id', (req,res) => {
    const doctor = obtenerDoctoresId(req.params.id)

    if(!doctor) {
	return res.status(400).json({
	    success: false,
	    message: 'Doctor no encontrado'
	})
    }
    res.status(200).json({
	success: true,
	data:doctor
    })
})
app.get('/api/doctores/especialidad/:especialidad', (req,res) => {
    const doctor = obtenerDoctoresEspecialidad(req.params.especialidad)

    if(doctor.length === 0) {
	return res.status(404).json({
	    success: false,
	    message: 'Especialidad de Doctor no encontrado'
	})
    }
    res.status(200).json({
	success: true,
	data:doctor
    })
})
app.post('/api/doctores', (req,res) => {
    const {nombre, especialidad, horarioInicio, horarioFin, diasDisponibles} = req.body
    const existe = obtenerDoctorNE(nombre,especialidad)
    if(existe) {
	return res.status(400).json({
	    success: false,
	    message: `La especialidad ${especialidad} ya tiene al doctor ${nombre}`
	})
    }
    if(horarioInicio >= horarioFin) {
	return res.status(400).json({
	    success: false,
	    message: `El horario de inicio ${horarioInicio} tiene que ser menor que el horario fin ${horarioFin}`
	})
    }
    if(diasDisponibles.length === 0) {
	return res.status(400).json({
	    success: false,
	    message: `El doctor tiene que tener dias disponible`
	})
    }
    if(!nombre || !especialidad || !horarioInicio || !horarioFin || !diasDisponibles) {
	return res.status(400).json({
	    success: false,
	    message: 'Totos los datos son requeridos'
	})
    }
    const nuevoDoctor = crearDoctor(nombre, especialidad, horarioInicio, horarioFin, diasDisponibles)
    res.status(201).json({
	success: true,
	message: 'Doctor creado exitosamente',
	data: nuevoDoctor
    })
})
//=====================================================================================================================
app.get('/api/pacientes', (req,res) => {
    const pacientes = obtenerPacientes()
    if(pacientes.length === 0) {
	return res.status(404).json({
	    success: false,
	    message: 'No se encuentra ningun paciente registrado'
	})
    }
    res.json({
	success: true,
	data: pacientes
    })
})
app.get('/api/pacientes/:id', (req,res) => {
    const paciente = obtenerPacientesId(req.params.id)

    if(!paciente) {
	return res.status(400).json({
	    success: false,
	    message: 'Paciente no encontrado'
	})
    }
    res.status(200).json({
	success: true,
	data:paciente
    })
})
app.post('/api/pacientes', (req,res) => {
    const {nombre,edad,telefono,email} = req.body
    const existe = obtenerPacienteEmail(email)
    if(existe) {
	return res.json({
	    succes:false,
	    message: `Paciente con email: ${email} ya existe.`
	})
    }
    if(edad < 1) {
	return res.status(400).json({
	    success: false,
	    message: 'Edad tiene que ser mayor a 0'
	})
    }
    if(!validateEmail(email)) {
    return res.status(400).json({
	    success: false,
	    message: 'Email incorrecto'
	})
    }
    if(!nombre || !edad || !telefono || !email) {
	return res.status(400).json({
	    success: false,
	    message: 'Totos los datos son requeridos'
	})
    }
    const fechaRegistro = new Date().toLocaleString("en-US", {timeZone: "America/Tijuana"});
    const nuevoPaciente = crearPaciente(nombre,edad,telefono,email,fechaRegistro)
    res.status(201).json({
	success: true,
	message: 'Paciente creado exitosamente',
	data: nuevoPaciente
    })
})
app.put('/api/pacientes/:id', (req,res) => {
    const {nombre,edad,telefono,email} = req.body
    const actualizar = actualizarPaciente(
	req.params.id,
	nombre,
	edad,
	telefono,
	email
    )
    if(!actualizar) {
	return res.status(404).json({
	    success: false,
	    message: 'Paciente no encontrado'
	})
    }
    res.status(200).json({
	success: true,
	message: 'Paciente actualizado exitosamente',
	data: actualizar
    })
})
app.get('/api/pacientes/:id/historial', (req,res) => {
    const historial = obtenerHistorialCitasId (
	req.params.id,
    )
    const p = obtenerPacientesId(req.params.id)
    if(!p) {
	return res.status(404).json({
	    success: false,
	    message: 'Paciente no encontrado'
	})
    }
    if(historial.length === 0) {
	return res.status(404).json({
	    success: false,
	    message: 'Paciente no a tenido citas'
	})
    }
    res.status(200).json({
	success: true,
	message: 'Obtncion de historial exitosamente',
	data: historial
    })
})
//=====================================================================================================================
app.get('/api/citas', (req,res) => {
    const { fecha, estado } = req.query
    
    const citas = obtenerCitas()
    if(citas.length === 0) {
	return res.status(404).json({
	    "success": false,
	    "message": "No se encuentra ninguna cita registrada"
	})
    }
    const filtro = citas.filter(cita => {
        const coincideFecha = !fecha || cita.fecha === fecha
        const coincideEstado = !estado || cita.estado === estado
        return coincideFecha && coincideEstado
    })

    if(filtro.length === 0) {
	return res.status(404).json({
	    "success": false,
	    "message": "Cita no encontrada"
	})
    }
    
    res.json({
        success: true,
	message: 'Filtro exitoso',
        data: filtro
    })
})
app.get('/api/citas/:id', (req,res) => {
    const citas = obtenerCitasId(req.params.id)

    if(!citas) {
	return res.status(400).json({
	    success: false,
	    message: 'Cita no encontrado'
	})
    }
    res.status(200).json({
	success: true,
	data:citas
    })
})
app.post('/api/citas', (req,res) => {
    const {pacienteId,doctorId,fecha,hora,motivo} = req.body
    const estado = 'programada'
    const existeP = obtenerPacientesId(pacienteId)
    if(!existeP) {
	return res.status(404).json({
	    success: false,
	    message: `Paciente ${pacienteId} no existe`
	})
    }
    const existeD = obtenerDoctoresId(doctorId)
    if(!existeD) {
	return res.status(404).json({
	    success: false,
	    message: `Doctor ${doctorId} no existe`
	})
    }
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    const fechaNow = `${year}-${(month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;

    if(new Date(fecha) < new Date(fechaNow)) {
	return res.status(400).json({
	    success: false,
	    message: `Fehca: ${fecha} tiene que ser mayor que ${fechaNow}`
	})
    }

    const diaObj = new Date(fecha)
    const fechaN = diaObj.getUTCDay()
    
    const nameD = (day) => {
        switch(day) {
            case 0: return "Domingo";
            case 1: return "Lunes";
            case 2: return "Martes";
            case 3: return "Miércoles";
            case 4: return "Jueves";
            case 5: return "Viernes";
            case 6: return "Sábado";
            default: return "Día inválido";
        }
    }
    const disponible = existeD.diasDisponibles.find(u => u === nameD(fechaN))
    if(!disponible) {
	return res.status(400).json({
	    success: false,
	    message: `El doctor ${existeD.nombre} no se encuentra disponble el dia ${fecha}: ${nameD(fechaN)}`
	})
    }
    if(hora < existeD.horarioInicio || hora >= existeD.horarioFin) {
	return res.status(400).json({
	    success: false,
	    message: `El doctor ${existeD.nombre} no esta disponible a las ${hora}`
	})
    }
    const citaHF = obtenerCitaHoraFecha(hora,fecha)
    if(citaHF) {
	return res.status(404).json({
	    success: false,
	    message: `Ya existe una cita para el ${fecha} a las ${hora}`
	})
    }

    if(!pacienteId || !doctorId || !fecha || !hora || !motivo) {
	return res.status(400).json({
	    success: false,
	    message: 'Totos los datos son requeridos'
	})
    }
    const nuevaCita = crearCita(pacienteId,doctorId,fecha,hora,motivo,estado)
    res.status(201).json({
	success: true,
	message: 'Cita creado exitosamente',
	data: nuevaCita
    })
})
app.put('/api/citas/:id/cancelar', (req,res) => {
    const existe = obtenerCitasId(req.params.id)
    if(!existe) {
	return res.status(404).json({
	    "success": false,
	    "message": "Cita no encontrada"
	})
    }
    if(existe.estado !== "programada") {
	return res.status(400).json({
	    success: false,
	    message: 'La cita no se encuentra programada para cancelarla'
	})
    }
    const cancelar = cancelarCita(
	req.params.id,
    )
    if(!cancelar) {
	return res.status(404).json({
	    success: false,
	    message: 'Cita no encontrado'
	})
    }
    res.status(200).json({
	success: true,
	message: 'Cita cancelada exitosamente',
	data: cancelar
    })
})
app.get('/api/citas/doctor/:doctorId', (req,res) => {
    const citas = agendaDoctor(req.params.doctorId)
    if(citas.length === 0) {
	return res.status(404).json({
	    success: false,
	    message: 'No se encuentra cita agendada'
	})
    }
    res.json({
	success: true,
	data: citas
    })
})
//=====================================================================================================================
app.get('/api/estadisticas/doctores', (req,res) => {
    const citas = obtenerCitas()
    const count = citas.reduce((resultado, cita) => {
	const doctor = cita.doctorId
	if(!resultado[doctor]) {
	    resultado[doctor] = 0
	}
	resultado[doctor]++
	return resultado
    }, {})
    const max = Math.max(...Object.values(count))
    const doctores = Object.entries(count).filter(([id,cantidad]) => cantidad === max)
    
    if(doctores.length === 0) {
	return res.status(404).json({
	    "success":false,
	    "message": "No se encontraron citas para obtener estadisticas"
	})
    }

    res.status(200).json({
	seccess: true,
	mesage: 'Estadistica de daoctores extraida exitosamente',
	data: doctores.map(u => u[0])
    })
})
app.get('/api/estadisticas/especialidades', (req,res) => {
    const citas = obtenerCitas()
    const count = citas.reduce((resultado, cita) => {
	const id = cita.doctorId
	const doctor = obtenerDoctoresId(id)
	if(!resultado[doctor.especialidad]) {
	    resultado[doctor.especialidad] = 0
	}
	resultado[doctor.especialidad]++
	return resultado
    }, {})
    const max = Math.max(...Object.values(count))
    const doctores = Object.entries(count).filter(([id,cantidad]) => cantidad === max)
       
    if(doctores.length === 0) {
	return res.status(404).json({
	    "success":false,
	    "message": "No se encontraron citas para obtener estadisticas"
	})
    }

    res.status(200).json({
	seccess: true,
	mesage: 'Estadistica de especialidades extraida exitosamente',
	data: doctores.map(u => u[0])
    })
})
//=====================================================================================================================
app.get('/api/doctoresf/disponibles', (req, res) => {
    const { fecha, hora } = req.query

    const diaObj = new Date(fecha)
    const fechaN = diaObj.getUTCDay()
    
    const nameD = (day) => {
        switch(day) {
            case 0: return "Domingo";
            case 1: return "Lunes";
            case 2: return "Martes";
            case 3: return "Miércoles";
            case 4: return "Jueves";
            case 5: return "Viernes";
            case 6: return "Sábado";
            default: return "Día inválido";
        }
    }

    const doctores = obtenerDoctores()

    if(doctores.length === 0) {
        return res.status(404).json({
            "success": false,
            "message": "No hay doctores registrado"
        })
    }
    
    const filtro = doctores.filter(doctor => {
        const coincideFecha = !fecha || doctor.diasDisponibles.find(u => u === nameD(fechaN))
        const coincideHora = !hora || doctor.horarioInicio <= hora && hora <= doctor.horarioFin
        return coincideFecha && coincideHora
    })

    if(filtro.length === 0) {
        return res.status(404).json({
            "success": false,
            "message": "No hay doctor disponible"
        })
    }

    res.status(200).json({
        success: true,
        message: 'Filtro exitoso',
        data: filtro
    })
})
//=====================================================================================================================
app.get('/api/proximas', (req,res) => {
    const citas = obtenerCitas()
    const today = getTomorrow()
    
    const tomorrow = citas.filter(u => today === u.fecha)

    if(tomorrow.length === 0) {
	return res.status(404).json({
	    "success": false,
	    "message": "No hay citas el dia de manana"
	})
    }

    res.status(200).json({
	success: true,
	message: 'Citas del dia siguiente',
	data: tomorrow
    })
})

app.listen(PORT, ()=> {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

function getTomorrow() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1); // Add 1 day
    
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}