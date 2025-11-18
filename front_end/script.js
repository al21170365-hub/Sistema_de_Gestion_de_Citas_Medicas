const form = document.querySelector('.form_doctor');

form.addEventListener('submit', async (e)=> {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('doctor-name').value,
        specialty: document.getElementById('doctor-specialty').value,
        startTime: document.getElementById('start-time').value,
        endTime: document.getElementById('end-time').value,
        availableDays: getCheckedDays()
    };

    let url = 'http://localhost:9797/api/doctores'
    try {

        const results = await fetch(url)
        if (!results.ok) {
            throw new Error(`Error on results: ${results.status}`)
        }
        const datas = await results.json()
        console.log(datas)
        
    } catch (error) {
        console.log(`Error on try for fetch: ${error}`)
    }
    
    console.log('Form Data:', formData);
});
function getCheckedDays() {
    const days = [];
    const checkboxes = document.querySelectorAll('input[name="days"]:checked');
    
    checkboxes.forEach(checkbox => {
        days.push(checkbox.value);
    });
    
    return days;
}









function display_doctor() {
    document.querySelector('.doctors_section').classList.add('active-section');
    document.querySelector('.pacientes_section').classList.remove('active-section');
    document.querySelector('.citas_section').classList.remove('active-section');
    
    updateActiveButton('doctor');
}

function display_pacient() {
    document.querySelector('.doctors_section').classList.remove('active-section');
    document.querySelector('.pacientes_section').classList.add('active-section');
    document.querySelector('.citas_section').classList.remove('active-section');
    
    updateActiveButton('pacient');
}

function display_appointment() {
    document.querySelector('.doctors_section').classList.remove('active-section');
    document.querySelector('.pacientes_section').classList.remove('active-section');
    document.querySelector('.citas_section').classList.add('active-section');
    
    updateActiveButton('appointment');
}

function updateActiveButton(active) {
    const buttons = document.querySelectorAll('.border-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    if (active === 'doctor') {
        buttons[0].classList.add('active');
    } else if (active === 'pacient') {
        buttons[1].classList.add('active');
    } else if (active === 'appointment') {
        buttons[2].classList.add('active');
    }
}

// Set today's date as default for appointment date
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointment-date').value = today;
});