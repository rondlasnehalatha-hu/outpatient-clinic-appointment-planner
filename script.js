// ============================================
// Outpatient Clinic Appointment Planner
// ============================================

// Initial patient/appointment data
let appointments = [

    {
        id: 1,
        patient: "Anjali Reddy",
        age: 28,
        doctor: "Sneha",
        time: "09:00",
        reason: "General Check-up",
        status: "Waiting"
    },

    {
        id: 2,
        patient: "Rahul Kumar",
        age: 35,
        doctor: "Madhu",
        time: "09:30",
        reason: "Fever and Cold",
        status: "Confirmed"
    },

    {
        id: 3,
        patient: "Priya Sharma",
        age: 42,
        doctor: "Gopi",
        time: "10:00",
        reason: "Headache",
        status: "In Progress"
    },

    {
        id: 4,
        patient: "Arun Kumar",
        age: 51,
        doctor: "Janu",
        time: "10:30",
        reason: "Blood Pressure Check",
        status: "Complete"
    },

    {
        id: 5,
        patient: "Lakshmi Devi",
        age: 39,
        doctor: "Deekshi",
        time: "11:00",
        reason: "Diabetes Consultation",
        status: "Waiting"
    },

    {
        id: 6,
        patient: "Vijay Rao",
        age: 46,
        doctor: "Sneha",
        time: "11:30",
        reason: "Back Pain",
        status: "Confirmed"
    },

    {
        id: 7,
        patient: "Sowmya Reddy",
        age: 31,
        doctor: "Madhu",
        time: "12:00",
        reason: "Stomach Pain",
        status: "Waiting"
    },

    {
        id: 8,
        patient: "Kiran Kumar",
        age: 55,
        doctor: "Gopi",
        time: "12:30",
        reason: "Chest Pain Follow-up",
        status: "Complete"
    },

    {
        id: 9,
        patient: "Deepika Rao",
        age: 26,
        doctor: "Janu",
        time: "14:00",
        reason: "Skin Allergy",
        status: "In Progress"
    },

    {
        id: 10,
        patient: "Ramesh Babu",
        age: 63,
        doctor: "Deekshi",
        time: "14:30",
        reason: "Joint Pain",
        status: "Waiting"
    },

    {
        id: 11,
        patient: "Meena Kumari",
        age: 34,
        doctor: "Sneha",
        time: "15:00",
        reason: "Migraine",
        status: "Complete"
    },

    {
        id: 12,
        patient: "Gopi Krishna",
        age: 48,
        doctor: "Madhu",
        time: "15:30",
        reason: "Routine Consultation",
        status: "Confirmed"
    }

];


// ============================================
// Page Load
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    renderAppointments();
    updateStatistics();

});


// ============================================
// Render Appointments
// ============================================

function renderAppointments() {

    const list = document.getElementById("appointmentList");

    const searchText =
        document.getElementById("searchInput").value
            .toLowerCase()
            .trim();

    const doctorFilter =
        document.getElementById("doctorFilter").value;

    const statusFilter =
        document.getElementById("statusFilter").value;


    // Filter appointments
    const filteredAppointments = appointments.filter(function (appointment) {

        const matchesSearch =
            appointment.patient
                .toLowerCase()
                .includes(searchText);

        const matchesDoctor =
            doctorFilter === "All" ||
            appointment.doctor === doctorFilter;

        const matchesStatus =
            statusFilter === "All" ||
            appointment.status === statusFilter;

        return (
            matchesSearch &&
            matchesDoctor &&
            matchesStatus
        );

    });


    // Clear existing list
    list.innerHTML = "";


    // No appointments
    if (filteredAppointments.length === 0) {

        list.innerHTML = `
            <div class="empty">
                <div class="empty-icon">📋</div>
                <h3>No appointments found</h3>
                <p>Try changing your search or filters.</p>
            </div>
        `;

        updateAppointmentNumber(0);

        return;
    }


    // Create appointment cards
    filteredAppointments.forEach(function (appointment) {

        const card =
            createAppointmentCard(appointment);

        list.appendChild(card);

    });


    updateAppointmentNumber(
        filteredAppointments.length
    );

}


// ============================================
// Create Appointment Card
// ============================================

function createAppointmentCard(appointment) {

    const card =
        document.createElement("div");

    card.className = "appointment-card";


    const initials =
        getInitials(appointment.patient);


    const statusClass =
        getStatusClass(appointment.status);


    card.innerHTML = `

        <div class="patient-avatar">
            ${initials}
        </div>

        <div class="patient-info">

            <h3>
                ${escapeHTML(appointment.patient)}
            </h3>

            <p>
                Age: ${appointment.age}
            </p>

        </div>

        <div class="doctor-info">

            <strong>
                Dr. ${escapeHTML(appointment.doctor)}
            </strong>

            <span>
                Outpatient Doctor
            </span>

        </div>

        <div class="reason">

            <strong>
                ${escapeHTML(appointment.reason)}
            </strong>

        </div>

        <div>

            <div class="time">
                🕐 ${formatTime(appointment.time)}
            </div>

            <span class="status ${statusClass}">
                ${appointment.status}
            </span>

        </div>

        <button
            class="delete-btn"
            onclick="deleteAppointment(${appointment.id})"
            title="Delete appointment"
        >
            🗑
        </button>

    `;

    return card;
}


// ============================================
// Get Initials
// ============================================

function getInitials(name) {

    const words = name.trim().split(" ");

    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }

    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();

}


// ============================================
// Status CSS Class
// ============================================

function getStatusClass(status) {

    switch (status) {

        case "Waiting":
            return "status-waiting";

        case "Confirmed":
            return "status-confirmed";

        case "In Progress":
            return "status-progress";

        case "Complete":
            return "status-complete";

        default:
            return "";

    }

}


// ============================================
// Format Time
// ============================================

function formatTime(time) {

    const [hours, minutes] =
        time.split(":");

    let hour =
        parseInt(hours);

    const ampm =
        hour >= 12 ? "PM" : "AM";

    hour =
        hour % 12 || 12;

    return `${hour}:${minutes} ${ampm}`;

}


// ============================================
// Update Statistics
// ============================================

function updateStatistics() {

    const total =
        appointments.length;

    const waiting =
        appointments.filter(
            item => item.status === "Waiting"
        ).length;

    const progress =
        appointments.filter(
            item => item.status === "In Progress"
        ).length;

    const complete =
        appointments.filter(
            item => item.status === "Complete"
        ).length;


    document.getElementById("totalCount")
        .textContent = total;

    document.getElementById("waitingCount")
        .textContent = waiting;

    document.getElementById("progressCount")
        .textContent = progress;

    document.getElementById("completeCount")
        .textContent = complete;

}


// ============================================
// Update Appointment Number
// ============================================

function updateAppointmentNumber(number) {

    const element =
        document.getElementById(
            "appointmentNumber"
        );

    element.textContent =
        `${number} appointment${number !== 1 ? "s" : ""}`;

}


// ============================================
// Open Modal
// ============================================

function openModal() {

    document
        .getElementById("appointmentModal")
        .classList.add("show");

}


// ============================================
// Close Modal
// ============================================

function closeModal() {

    document
        .getElementById("appointmentModal")
        .classList.remove("show");

    document
        .getElementById("appointmentForm")
        .reset();

}


// ============================================
// Add Appointment
// ============================================

document
    .getElementById("appointmentForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const newAppointment = {

                id: Date.now(),

                patient:
                    document
                        .getElementById("patientName")
                        .value
                        .trim(),

                age:
                    document
                        .getElementById("patientAge")
                        .value,

                doctor:
                    document
                        .getElementById("doctorName")
                        .value,

                time:
                    document
                        .getElementById("appointmentTime")
                        .value,

                reason:
                    document
                        .getElementById("reason")
                        .value
                        .trim(),

                status:
                    document
                        .getElementById("appointmentStatus")
                        .value

            };


            appointments.push(newAppointment);


            renderAppointments();

            updateStatistics();

            closeModal();

        }
    );


// ============================================
// Delete Appointment
// ============================================

function deleteAppointment(id) {

    const appointment =
        appointments.find(
            item => item.id === id
        );


    if (!appointment) {
        return;
    }


    const confirmed =
        confirm(
            `Delete appointment for ${appointment.patient}?`
        );


    if (!confirmed) {
        return;
    }


    appointments =
        appointments.filter(
            item => item.id !== id
        );


    renderAppointments();

    updateStatistics();

}


// ============================================
// Clear Filters
// ============================================

function clearFilters() {

    document.getElementById("searchInput")
        .value = "";

    document.getElementById("doctorFilter")
        .value = "All";

    document.getElementById("statusFilter")
        .value = "All";


    renderAppointments();

}


// ============================================
// Close Modal when clicking outside
// ============================================

document
    .getElementById("appointmentModal")
    .addEventListener(
        "click",
        function (event) {

            if (
                event.target === this
            ) {
                closeModal();
            }

        }
    );


// ============================================
// HTML Security Helper
// ============================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
