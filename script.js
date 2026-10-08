// ================================
// DOCTOR DATA
// ================================

const doctors = [

    {
        name: "Dr. Sneha",
        specialty: "Cardiology"
    },

    {
        name: "Dr. Lasya",
        specialty: "Neurology"
    },

    {
        name: "Dr. Janu",
        specialty: "Dermatology"
    },

    {
        name: "Dr. Likhitha",
        specialty: "Pediatrics"
    },

    {
        name: "Dr. Ananya",
        specialty: "General Medicine"
    }

];


// ================================
// GET ELEMENTS
// ================================

const form =
    document.getElementById("appointmentForm");

const specialty =
    document.getElementById("specialty");

const doctor =
    document.getElementById("doctor");

const appointmentTable =
    document.getElementById("appointmentTable");

const noAppointments =
    document.getElementById("noAppointments");

const search =
    document.getElementById("search");

const filterStatus =
    document.getElementById("filterStatus");

const cancelEdit =
    document.getElementById("cancelEdit");


// ================================
// LOAD APPOINTMENTS
// ================================

let appointments =
    JSON.parse(
        localStorage.getItem("appointments")
    ) || [];


// ================================
// SPECIALTY CHANGE
// ================================

specialty.addEventListener(
    "change",
    function () {

        const selectedSpecialty =
            specialty.value;

        doctor.innerHTML =
            '<option value="">Select Doctor</option>';

        doctors
            .filter(
                d =>
                    d.specialty ===
                    selectedSpecialty
            )
            .forEach(d => {

                const option =
                    document.createElement("option");

                option.value = d.name;

                option.textContent =
                    d.name;

                doctor.appendChild(option);

            });

    }
);


// ================================
// FORM SUBMIT
// ================================

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const patientName =
            document
                .getElementById("patientName")
                .value
                .trim();

        const age =
            document
                .getElementById("age")
                .value;

        const gender =
            document
                .getElementById("gender")
                .value;

        const phone =
            document
                .getElementById("phone")
                .value
                .trim();

        const selectedSpecialty =
            specialty.value;

        const selectedDoctor =
            doctor.value;

        const date =
            document
                .getElementById("date")
                .value;

        const time =
            document
                .getElementById("time")
                .value;

        const reason =
            document
                .getElementById("reason")
                .value
                .trim();

        const editId =
            document
                .getElementById("editId")
                .value;


        // Basic validation

        if (
            !patientName ||
            !age ||
            !gender ||
            !phone ||
            !selectedSpecialty ||
            !selectedDoctor ||
            !date ||
            !time ||
            !reason
        ) {

            alert(
                "Please fill all the fields."
            );

            return;

        }


        // Edit existing appointment

        if (editId) {

            const index =
                appointments.findIndex(
                    appointment =>
                        appointment.id ==
                        editId
                );

            if (index !== -1) {

                appointments[index] = {

                    id: Number(editId),

                    patientName,

                    age,

                    gender,

                    phone,

                    specialty:
                        selectedSpecialty,

                    doctor:
                        selectedDoctor,

                    date,

                    time,

                    reason

                };

            }

            alert(
                "Appointment updated successfully!"
            );

        }


        // New appointment

        else {

            const appointment = {

                id: Date.now(),

                patientName,

                age,

                gender,

                phone,

                specialty:
                    selectedSpecialty,

                doctor:
                    selectedDoctor,

                date,

                time,

                reason

            };

            appointments.push(
                appointment
            );

            alert(
                "Appointment booked successfully!"
            );

        }


        saveAppointments();

        resetForm();

        displayAppointments();

    }
);


// ================================
// SAVE DATA
// ================================

function saveAppointments() {

    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );

}


// ================================
// DISPLAY APPOINTMENTS
// ================================

function displayAppointments() {

    const searchText =
        search.value
            .toLowerCase()
            .trim();

    const filter =
        filterStatus.value;


    appointmentTable.innerHTML = "";


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const filtered =
        appointments.filter(
            appointment => {

                const matchesSearch =

                    appointment.patientName
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    appointment.doctor
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    appointment.specialty
                        .toLowerCase()
                        .includes(searchText);


                const matchesFilter =

                    filter === "all"

                    ||

                    (
                        filter === "Today"
                        &&
                        appointment.date === today
                    );


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );


    if (filtered.length === 0) {

        noAppointments.style.display =
            "block";

    }

    else {

        noAppointments.style.display =
            "none";

    }


    filtered
        .sort(
            (a, b) => {

                const first =
                    `${a.date} ${a.time}`;

                const second =
                    `${b.date} ${b.time}`;

                return first.localeCompare(
                    second
                );

            }
        )
        .forEach(appointment => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <div class="patient-name">

                        ${escapeHTML(
                            appointment.patientName
                        )}

                    </div>

                    <small>

                        ${appointment.age} years,
                        ${appointment.gender}

                    </small>

                </td>


                <td class="doctor">

                    ${escapeHTML(
                        appointment.doctor
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        appointment.specialty
                    )}

                </td>


                <td>

                    ${formatDate(
                        appointment.date
                    )}

                </td>


                <td>

                    ${formatTime(
                        appointment.time
                    )}

                </td>


                <td>

                    ${escapeHTML(
                        appointment.reason
                    )}

                </td>


                <td>

                    <button
                        class="edit-btn"
                        onclick="editAppointment(
                            ${appointment.id}
                        )">

                        Edit

                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteAppointment(
                            ${appointment.id}
                        )">

                        Delete

                    </button>

                </td>

            `;


            appointmentTable.appendChild(
                row
            );

        });


    updateDashboard();

}


// ================================
// EDIT APPOINTMENT
// ================================

function editAppointment(id) {

    const appointment =
        appointments.find(
            a => a.id === id
        );


    if (!appointment) return;


    document.getElementById(
        "editId"
    ).value = appointment.id;


    document.getElementById(
        "patientName"
    ).value =
        appointment.patientName;


    document.getElementById(
        "age"
    ).value =
        appointment.age;


    document.getElementById(
        "gender"
    ).value =
        appointment.gender;


    document.getElementById(
        "phone"
    ).value =
        appointment.phone;


    specialty.value =
        appointment.specialty;


    specialty.dispatchEvent(
        new Event("change")
    );


    doctor.value =
        appointment.doctor;


    document.getElementById(
        "date"
    ).value =
        appointment.date;


    document.getElementById(
        "time"
    ).value =
        appointment.time;


    document.getElementById(
        "reason"
    ).value =
        appointment.reason;


    document.querySelector(
        ".primary-btn"
    ).textContent =
        "💾 Update Appointment";


    cancelEdit.style.display =
        "inline-block";


    document
        .getElementById("appointment")
        .scrollIntoView({
            behavior: "smooth"
        });

}


// ================================
// DELETE APPOINTMENT
// ================================

function deleteAppointment(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this appointment?"
        );


    if (!confirmDelete) return;


    appointments =
        appointments.filter(
            appointment =>
                appointment.id !== id
        );


    saveAppointments();

    displayAppointments();

}


// ================================
// CANCEL EDIT
// ================================

cancelEdit.addEventListener(
    "click",
    function () {

        resetForm();

    }
);


// ================================
// RESET FORM
// ================================

function resetForm() {

    form.reset();

    document.getElementById(
        "editId"
    ).value = "";


    doctor.innerHTML =
        '<option value="">Select Doctor</option>';


    document.querySelector(
        ".primary-btn"
    ).textContent =
        "📅 Book Appointment";


    cancelEdit.style.display =
        "none";

}


// ================================
// SEARCH
// ================================

search.addEventListener(
    "input",
    displayAppointments
);


// ================================
// FILTER
// ================================

filterStatus.addEventListener(
    "change",
    displayAppointments
);


// ================================
// DASHBOARD
// ================================

function updateDashboard() {

    document.getElementById(
        "totalAppointments"
    ).textContent =
        appointments.length;


    const uniquePatients =
        new Set(
            appointments.map(
                appointment =>
                    appointment.phone
            )
        );


    document.getElementById(
        "totalPatients"
    ).textContent =
        uniquePatients.size;


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayCount =
        appointments.filter(
            appointment =>
                appointment.date === today
        ).length;


    document.getElementById(
        "todayAppointments"
    ).textContent =
        todayCount;

}


// ================================
// FORMAT DATE
// ================================

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


// ================================
// FORMAT TIME
// ================================

function formatTime(time) {

    const [hours, minutes] =
        time.split(":");


    const date =
        new Date();

    date.setHours(
        hours,
        minutes
    );


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


// ================================
// SECURITY
// ================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;

}


// ================================
// INITIAL DISPLAY
// ================================

displayAppointments();
