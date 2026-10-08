// Get existing appointments
let appointments =
    JSON.parse(localStorage.getItem("appointments")) || [];


// BOOK APPOINTMENT PAGE
const form = document.getElementById("appointmentForm");

if (form) {

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        let patient =
            document.getElementById("patientName").value;

        let doctor =
            document.getElementById("doctor").value;

        let date =
            document.getElementById("date").value;

        let time =
            document.getElementById("time").value;


        let appointment = {
            patient: patient,
            doctor: doctor,
            date: date,
            time: time
        };


        appointments.push(appointment);

        localStorage.setItem(
            "appointments",
            JSON.stringify(appointments)
        );


        alert("Appointment booked successfully!");

        form.reset();

        window.location.href = "schedule.html";
    });
}


// SCHEDULE PAGE
const appointmentList =
    document.getElementById("appointmentList");

if (appointmentList) {

    displayAppointments();
}


function displayAppointments() {

    appointmentList.innerHTML = "";

    const emptyMessage =
        document.getElementById("emptyMessage");

    if (appointments.length === 0) {

        emptyMessage.style.display = "block";

        return;
    }

    emptyMessage.style.display = "none";


    appointments.forEach(function(appointment, index) {

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${appointment.patient}</td>
            <td>${appointment.doctor}</td>
            <td>${appointment.date}</td>
            <td>${appointment.time}</td>
            <td>
                <button
                    class="delete-btn"
                    onclick="cancelAppointment(${index})">
                    Cancel
                </button>
            </td>
        `;

        appointmentList.appendChild(row);
    });
}


// CANCEL APPOINTMENT
function cancelAppointment(index) {

    if (confirm("Cancel this appointment?")) {

        appointments.splice(index, 1);

        localStorage.setItem(
            "appointments",
            JSON.stringify(appointments)
        );

        displayAppointments();
    }
}
