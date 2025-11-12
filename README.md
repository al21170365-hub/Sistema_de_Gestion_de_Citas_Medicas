# Sistema de Gestión de Citas Medicas

## Portada Institucional

**Institución:** Instituto Tecnologico de Ensenada 

**Carrera:** Ingeniería en Sistemas de Información 

**Materia:** Desarollo Web I 

**Actividad:** Sistema de Gestión de Citas Médicas

**Estudiante:** Jose Eduardo Lazcano Beltran  

**Docente:** Ing. Xenia Padilla Madrid  

**Fecha:** 12 de Noviembre de 2025

---

## Instrucciones de Instalación

### Prerrequisitos
- Node.js
- npm
- docker(si gusta)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/al21170365-hub/Sistema_de_Gestion_de_Citas_Medicas.git
2. **Dirigirte a la carpeta**
   ```bash
   cd Sistema_de_Gestion_de_Citas_Medicas
3. **Iniciar el API**
   ```bash
   nmp start dev

### Pasos de Instalación con Docker(si gusta)

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/al21170365-hub/Sistema_de_Gestion_de_Citas_Medicas.git
2. **Dirigirte a la carpeta**
   ```bash
   cd Sistema_de_Gestion_de_Citas_Medicas
3. **Crear imagen docker**
   ```bash
   docker build -t node-app .
4. **Inicializar el contenedor**
   ```bash
   docker run -p 9797:9797 node-app

## Documentación de Endpoints

### Base URL
```text
http://localhost:9797
```

### 📋 DOCTORES
1. **Obtener todos los doctores**
   
   GET /api/doctores

   Respuesta:
   ```json
   {
       "success": true,
       "data": [
           {
               "id": "D001",
               "nombre": "Dr. Carlos Méndez",
               "especialidad": "Cardiologo",
               "horarioInicio": "09:00",
               "horarioFin": "18:00",
               "diasDisponibles": [
                   "Lunes",
                   "Miércoles",
                   "Viernes"
               ]
           },
           {
               "id": "D002",
               "nombre": "Dra. Ana Rodríguez",
               "especialidad": "Pediatra",
               "horarioInicio": "08:00",
               "horarioFin": "16:00",
               "diasDisponibles": [
                   "Martes",
                   "Jueves",
                   "Sábado"
               ]
           }
       ]
   }   
   ```
   Respuesta(error):
   ```json
   {
     "success": false,
     "message": "No se encuentra ningun doctor registrado"
   }
   ```
3. **Obtener doctor por ID**
   
   GET /api/doctores/:id

   Respuesta:
   ```json
   {
       "success": true,
       "data": {
           "id": "D001",
           "nombre": "Dr. Carlos Méndez",
           "especialidad": "Cardiologo",
           "horarioInicio": "09:00",
           "horarioFin": "18:00",
           "diasDisponibles": [
               "Lunes",
               "Miércoles",
               "Viernes"
           ]
       }
   }
   ```
   Respuesta(error):
   ```json
   {
     "success": false,
     "message": "Doctor no encontrado"
   }
   ```
4. **Obtener doctores por especialidad**
   
   GET /api/doctores/especialidad/:especialidad

   Respuesta:
   ```json
   {
       "success": true,
       "data": [
           {
               "id": "D002",
               "nombre": "Dra. Ana Rodríguez",
               "especialidad": "Pediatra",
               "horarioInicio": "08:00",
               "horarioFin": "16:00",
               "diasDisponibles": [
                   "Martes",
                   "Jueves",
                   "Sábado"
               ]
           }
       ]
   }
   ```
   Respuesta(error):
   ```json
   {
     "success": false,
     "message": "Especialidad de Doctor no encontrado"
   }
   ```
5. **Crear nuevo doctor**
   
   POST /api/doctores

   Requerimientos:
   ```json
   {
       "nombre": "Dra. Ana Rodríguez",
       "especialidad": "Pediatra",
       "horarioInicio": "08:00",
       "horarioFin": "16:00",
       "diasDisponibles": [
           "Martes",
           "Jueves",
           "Sábado"
       ]
   }
   ```
   Respuesta(exito):
   ```json
   {
       "success": true,
       "message": "Doctor creado exitosamente",
       "data": {
           "id": "D003",
           "nombre": "Dra. Ana Rodríguez",
           "especialidad": "Pediatra",
           "horarioInicio": "09:00",
           "horarioFin": "08:00",
           "diasDisponibles": [
               "Martes",
               "Jueves",
               "Sábado"
           ]
       }
   }
   ```
   Respuesta(error: especialidad repetida):
   ```json
   {
     "success": false,
     "message": "La especialidad Pediatría ya tiene al doctor Dra. Ana Rodríguez"
   }
   ```
   Respuesta(error: horario incorecto)
   ```json
   {
     "success": false,
     "message": "`El horario de inicio 09:00 tiene que ser menor que el horario fin 08:00"
   }
   ```
   Respuesta(error: doctor sin dias disponibles)
   ```json
   {
     "success": false,
     "message": "El doctor tiene que tener dias disponible"
   }
   ```
   Respuesta(error: sin un dato)
   ```json
   {
     "success": false,
     "message": "Totos los datos son requeridos"
   }
   ```
   
### 👥 PACIENTES
5. **Obtener todos los pacientes**
   
   GET /api/pacientes

   Respuesta:
   ```json
   {
       "success": true,
       "data": [
           {
               "id": "P001",
               "nombre": "María González",
               "edad": 1,
               "telefono": "555-0101",
               "email": "maria@gemail.com",
               "fechaRegistro": "2024-11-1"
           },
           {
               "id": "P002",
               "nombre": "Javier López",
               "edad": 45,
               "telefono": "555-0102",
               "email": "javier.lopez@email.com",
               "fechaRegistro": "2025-01-16"
           },
           {
               "id": "P003",
               "nombre": "Carmen Ruiz",
               "edad": 32,
               "telefono": "555-0103",
               "email": "carmen.ruiz@email.com",
               "fechaRegistro": "2025-01-17"
           }
       ]
   }
   ```
   Respuesta(error):
   ```json
   {
     "success": false,
     "message": "No se encuentra ningun paciente registrado"
   }
   ```
7. **Obtener paciente por ID**
   
   GET /api/pacientes/:id

   Respuesta:
   ```json
   {
       "success": true,
       "data": {
           "id": "P001",
           "nombre": "María González",
           "edad": 1,
           "telefono": "555-0101",
           "email": "maria@gemail.com",
           "fechaRegistro": "2024-11-1"
       }
   }
   ```
   Respuesta(error):
   ```json
   {
     "success": false,
     "message": "Paciente no encontrado"
   }
   ```
8. **Crear nuevo paciente**
    
   POST /api/pacientes

   Requerimientos:
   ```json
   {
       "nombre": "Carmen Ruiz",
       "edad": 32,
       "telefono": "555-0103",
       "email": "carmen.ruiz@email.com",
       "fechaRegistro": "2025-01-17"
   }
   ```
   Respuesta(exito):
   ```json
   {
     "success": true,
     "message": "Paciente creado exitosamente",
     "data": {
        "nombre": "Carmen Ruiz",
        "edad": 32,
        "telefono": "555-0103",
        "email": "carmen.ruiz@email.com",
        "fechaRegistro": "2025-01-17"
      }
   }
   ```
   Respuesta(error: email ya existe):
   ```json
   {
    "succes": false,
    "message": "Paciente con email: carmen.ruiz@email.com ya existe."
   }
   ```
   Respuesta(error: edad):
   ```json
   {
     "succes":false,
     "message": "Edad tiene que ser mayor a 0"
   }
   ```
   Respuesta(error: sin un dato):
   ```json
   {
     "succes":false,
     "message": "Totos los datos son requeridos"
   }
   ```
9. **Actualizar paciente**
   
   PUT /api/pacientes/:id

   Requerimientos:
   ```json
   {
       "nombre": "Lazcano",
       "edad": 35,
       "telefono": "555-0101",
       "email": "maria.g@email.com"
   }
   ```
   Respuesta(exito):
   ```json
   {
       "success": true,
       "message": "Paciente actualizado exitosamente",
       "data": {
           "id": "P001",
           "nombre": "Lazcano",
           "edad": 35,
           "telefono": "555-0101",
           "email": "maria.g@email.com",
           "fechaRegistro": "2024-11-1"
       }
   }
   ```
   Respuesta(error):
   ```json
   {
     "success": false,
     "message": "Paciente no encontrado"
   }
   ```
10. **Obtener historial de citas del paciente**
    
   GET /api/pacientes/:id/historial

   Respuesta:
   ```json
   {
       "success": true,
       "message": "Obtncion de historial exitosamente",
       "data": [
           {
               "id": "C001",
               "pacienteId": "P001",
               "doctorId": "D001",
               "fecha": "2025-11-10",
               "hora": "16:00",
               "motivo": "Revisión general",
               "estado": "programada"
           },
           {
               "id": "C004",
               "pacienteId": "P001",
               "doctorId": "D002",
               "fecha": "2025-11-13",
               "hora": "11:00",
               "motivo": "Vacunación",
               "estado": "programada"
           }
       ]
   }
   ```
   Respuesta(error):
   ```json
   {
     "success": false,
     "message": "Citas no encontradas"
   }
   ```
   
### 📅 CITAS
10. **Obtener todas las citas**
    
   GET /api/citas
   
   Respuesta:
   ```json
   {
       "success": true,
       "message": "Filtro exitoso",
       "data": [
           {
               "id": "C001",
               "pacienteId": "P001",
               "doctorId": "D001",
               "fecha": "2025-11-10",
               "hora": "16:00",
               "motivo": "Revisión general",
               "estado": "programada"
           },
           {
               "id": "C002",
               "pacienteId": "P002",
               "doctorId": "D002",
               "fecha": "2025-11-11",
               "hora": "10:30",
               "motivo": "Consulta por fiebre",
               "estado": "programada"
           },
           {
               "id": "C003",
               "pacienteId": "P003",
               "doctorId": "D001",
               "fecha": "2025-11-12",
               "hora": "14:15",
               "motivo": "Control mensual",
               "estado": "programada"
           },
           {
               "id": "C004",
               "pacienteId": "P001",
               "doctorId": "D002",
               "fecha": "2025-11-13",
               "hora": "11:00",
               "motivo": "Vacunación",
               "estado": "programada"
           },
           {
               "id": "C005",
               "pacienteId": "P003",
               "doctorId": "D002",
               "fecha": "2025-11-15",
               "hora": "09:45",
               "motivo": "Resultados de análisis",
               "estado": "programada"
           },
           {
               "id": "C006",
               "pacienteId": "P003",
               "doctorId": "D002",
               "fecha": "2025-11-18",
               "hora": "10:00",
               "motivo": "Resultados de análisis",
               "estado": "cancelada"
           }
       ]
   }
   ```
   Respuesta(error):
   ```json
   {
     "success": false,
     "message": "No se encuentra ninguna cita registrado"
   }
   ```
11. **Obtener cita por ID**
    
   GET /api/citas/:id

   Respuesta:
   ```json
   {
       "success": true,
       "data": {
           "id": "C001",
           "pacienteId": "P001",
           "doctorId": "D001",
           "fecha": "2025-11-10",
           "hora": "16:00",
           "motivo": "Revisión general",
           "estado": "programada"
       }
   }
   ```
   Respuesta(error):
   ```json
   {
     "success": false,
     "message": "Cita no encontradas"
   }
   ```
12. **Crear nueva cita**
    
    POST /api/citas

    Requerimientos:
   ```json
   {
       "pacienteId": "P003",
       "doctorId": "D002",
       "fecha": "2025-11-18",
       "hora": "10:00",
       "motivo": "Resultados de análisis",
       "estado": "programada"
   }
   ```
   Respuesta(exito):
   ```json
   {
       "success": true,
       "message": "Cita creado exitosamente",
       "data": {
           "id": "C006",
           "pacienteId": "P003",
           "doctorId": "D002",
           "fecha": "2025-11-18",
           "hora": "10:00",
           "motivo": "Resultados de análisis",
           "estado": "programada"
       }
   }
   ```
   Respuesta(error: paciente no existe)
   ```json
   {
     "success": false,
     "message": "Paciente P003 no existe"
   }
   ```
   Respuesta(error: doctor no existe)
   ```json
   {
     "success": false,
     "message": "Doctor D002 no existe"
   }
   ```
   Respuesta(error: fecha incorecta)
   ```json
   {
     "success": false,
     "message": "Fecha de cita tiene que ser hoy o mas en el futuro"
   }
   ```
   Respuesta(error: doctor no disponible por dia)
   ```json
   {
     "success": false,
     "message": "Doctor no disponible ese dia"
   }
   ```
   Respuesta(error: doctor no disponible por hora)
   ```json
   {
     "success": false,
     "message": "Doctor no disponible esa hora"
   }
   ```
   Respuesta(error: ya hay cita)
   ```json
   {
     "success": false,
     "message": "Ya existe una cita para la fecha a las horas"
   }
   ```
   Respuesta(error: falta de datos)
   ```json
   {
     "success": false,
     "message": "Todos los datos son requeridos"
   }
   ```
13. **Cancelar cita**
    
   PUT /api/citas/:id/cancelar

   Respuesta:
   ```json
   {
       "success": true,
       "message": "Cita cancelada exitosamente",
       "data": {
           "id": "C006",
           "pacienteId": "P003",
           "doctorId": "D002",
           "fecha": "2025-11-18",
           "hora": "10:00",
           "motivo": "Resultados de análisis",
           "estado": "cancelada"
       }
   }
   ```
   Respuesta(error: no hay cita programada con ese id):
   ```json
   {
     "success": false,
     "message": "La cita no se encuentra programada para cancelar"
   }
   ```
   Respuesta(error: no existe):
   ```json
   {
     "success": false,
     "message": "Cita no encontrad"
   }
   ```
14. **Obtener agenda del doctor**
    
   GET /api/citas/doctor/:doctorId

   Respuesta:
   ```json
   {
       "success": true,
       "data": [
           {
               "id": "C001",
               "pacienteId": "P001",
               "doctorId": "D001",
               "fecha": "2025-11-10",
               "hora": "16:00",
               "motivo": "Revisión general",
               "estado": "programada"
           },
           {
               "id": "C003",
               "pacienteId": "P003",
               "doctorId": "D001",
               "fecha": "2025-11-12",
               "hora": "14:15",
               "motivo": "Control mensual",
               "estado": "programada"
           }
       ]
   }
   ```
   Respuesta(error):
   ```json
   {
     "success": false,
     "message": "Doctor no tiene citas pendientes"
   }
   ```

### 📊 ESTADÍSTICAS
15. **Doctores con más citas**
    
    GET /api/estadisticas/doctores

    Respuesta:
   ```json
   {
       "seccess": true,
       "mesage": "Estadistica de daoctores extraida exitosamente",
       "data": [
           "D002"
       ]
   }
   ```
16. **Especialidad mas pedida**

    GET /api/estadisticas/especialidades

    Respuesta:
   ```json
   {
       "seccess": true,
       "mesage": "Estadistica de especialidades extraida exitosamente",
       "data": [
           "Pediatra"
       ]
   }
   ```

### 🔍 FILTROS ESPECIALES
17. **Doctores disponibles por fecha y hora**
    
   GET /api/doctoresf/disponibles?fecha=2025-11-10&hora=10:00

   Respuesta:
   ```json
   {
       "success": true,
       "message": "Filtro exitoso",
       "data": [
           {
               "id": "D001",
               "nombre": "Dr. Carlos Méndez",
               "especialidad": "Cardiologo",
               "horarioInicio": "09:00",
               "horarioFin": "18:00",
               "diasDisponibles": [
                   "Lunes",
                   "Miércoles",
                   "Viernes"
               ]
           }
       ]
   }
   ```
   Respuesta(error):
   ```json
   {
     "success": false,
     "message": "Doctor no tiene cita en esa fecah o hora"
   }
   ```
18. **Obtener todas las citas (con filtros opcionales)**

   GET /api/citas?fecha=2025-11-10&estado=programada

   Respuesta:
   ```json
   {
       "success": true,
       "message": "Filtro exitoso",
       "data": [
           {
               "id": "C001",
               "pacienteId": "P001",
               "doctorId": "D001",
               "fecha": "2025-11-10",
               "hora": "16:00",
               "motivo": "Revisión general",
               "estado": "programada"
           }
       ]
   }
   ```

### ❗️ Notificaciones
19. **Próximas citas (del día siguiente)**
    
    GET /api/proximas

    Respuesta(fecha actual 2025-11-10):
   ```json
   {
       "success": true,
       "message": "Citas del dia siguiente",
       "data": [
           {
               "id": "C002",
               "pacienteId": "P002",
               "doctorId": "D002",
               "fecha": "2025-11-11",
               "hora": "10:30",
               "motivo": "Consulta por fiebre",
               "estado": "programada"
           }
       ]
   }
   ```
   Respuesta(error):
   ```json
   {
     "success": false,
     "message": "Citas no encontradas"
   }
   ```

<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAtiaOuaFGUPWwx4wA_xvxzA0-ZmzEmReE9oXdkJD10keS0ItoSp_Jocd_pYGmMOoYXmrvgZtfPenmLiPU-8hkkAFCXIFWQDQuhGNsw52DjQ&s=10" width="100%" alt="Texto alternativo">
