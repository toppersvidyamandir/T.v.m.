const ADMIN_USER = "admin";
const ADMIN_PASS = "toppers@2026";

window.onload = function() {
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString();
    loadStudents();
};

// Login System
function checkLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
        showToast("Access Granted!");
    } else {
        showToast("Incorrect Admin ID or Password!", "error");
    }
}

// Navigation & Theme
function showSection(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active-section'));
    document.getElementById(id).classList.add('active-section');
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function toggleTheme() {
    const body = document.body;
    if (body.getAttribute("data-theme") === "dark") {
        body.removeAttribute("data-theme");
        showToast("Light Mode Activated");
    } else {
        body.setAttribute("data-theme", "dark");
        showToast("Dark Mode Activated");
    }
}

// Save Data
document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const student = {
        id: Date.now(),
        name: document.getElementById('name').value,
        dob: document.getElementById('dob').value,
        phone: document.getElementById('phone').value,
        totalFee: (Number(document.getElementById('libFee').value) || 0) + 
                  (Number(document.getElementById('maintFee').value) || 0) + 
                  (Number(document.getElementById('courseFee').value) || 0)
    };

    let students = JSON.parse(localStorage.getItem('tvm_ultra_data')) || [];
    students.push(student);
    localStorage.setItem('tvm_ultra_data', JSON.stringify(students));

    showToast("Student Registered!");
    this.reset();
    loadStudents();
});

// Load Data into Tables
function loadStudents() {
    const students = JSON.parse(localStorage.getItem('tvm_ultra_data')) || [];
    let totalRev = 0;
    
    document.getElementById('feeTableBody').innerHTML = '';
    document.getElementById('attendanceList').innerHTML = '';

    students.forEach(s => {
        totalRev += s.totalFee;
        
        // Fee & Record Table
        document.getElementById('feeTableBody').innerHTML += `
            <tr>
                <td><strong>${s.name}</strong><br><small><i class="fas fa-phone"></i> ${s.phone}</small></td>
                <td><strong style="color:var(--success);">₹${s.totalFee}</strong></td>
                <td>
                    <button class="btn-primary" style="padding:6px 12px; font-size:12px; width:auto;" onclick="generateID('${s.id}')"><i class="fas fa-id-badge"></i> ID Card</button>
                    <button class="btn-danger" style="width:auto;" onclick="deleteStudent(${s.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;

        // Attendance
        document.getElementById('attendanceList').innerHTML += `
            <tr>
                <td><strong>${s.name}</strong></td>
                <td><input type="checkbox" class="attendance-check" onchange="updateCounts()" style="transform: scale(1.5); accent-color: var(--success);"></td>
            </tr>`;
    });

    document.getElementById('stat-total-students').innerText = students.length;
    document.getElementById('stat-total-revenue').innerText = "₹" + totalRev;
}

// Delete Student
function deleteStudent(id) {
    if(confirm("Are you sure you want to delete this student's record?")) {
        let students = JSON.parse(localStorage.getItem('tvm_ultra_data')) || [];
        students = students.filter(s => s.id !== id);
        localStorage.setItem('tvm_ultra_data', JSON.stringify(students));
        showToast("Student Record Deleted!", "error");
        loadStudents();
    }
}

// ID Card Generator
function generateID(id) {
    const students = JSON.parse(localStorage.getItem('tvm_ultra_data')) || [];
    const student = students.find(s => s.id == id);
    
    if(student) {
        document.getElementById('idName').innerText = student.name;
        document.getElementById('idDob').innerText = student.dob;
        document.getElementById('idPhone').innerText = student.phone;
        document.getElementById('idNo').innerText = "TVM" + student.id.toString().slice(-4);
        document.getElementById('idModal').style.display = 'block';
    }
}

// Export Backup (Excel/CSV)
function exportToCSV() {
    const students = JSON.parse(localStorage.getItem('tvm_ultra_data')) || [];
    if(students.length === 0) {
        showToast("No data to export!", "error");
        return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,ID,Name,DOB,Phone,Total Fee\n";
    students.forEach(s => {
        csvContent += `${s.id},${s.name},${s.dob},${s.phone},${s.totalFee}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "TVM_Students_Backup.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Backup Downloaded!");
}

// Utilities
function updateCounts() {
    document.getElementById('presentCount').innerText = document.querySelectorAll('.attendance-check:checked').length;
}

function searchStudent() {
    let filter = document.getElementById('searchInput').value.toUpperCase();
    let trs = document.getElementById('feeTableBody').getElementsByTagName('tr');
    for (let i = 0; i < trs.length; i++) {
        let td = trs[i].getElementsByTagName("td")[0];
        if (td) {
            trs[i].style.display = (td.textContent || td.innerText).toUpperCase().indexOf(filter) > -1 ? "" : "none";
        }
    }
}

function showToast(msg, type="success") {
    const toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.style.backgroundColor = type === "error" ? "var(--danger)" : "var(--success)";
    toast.className = "toast show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
}
