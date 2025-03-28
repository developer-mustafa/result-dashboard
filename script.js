document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const dynamicContent = document.getElementById("dynamicContent");
    const searchStudent = document.getElementById("searchStudent");
    const searchExam = document.getElementById("searchExam");
    let students = JSON.parse(localStorage.getItem("students")) || [];
    let exams = JSON.parse(localStorage.getItem("exams")) || [];
    let chartInstance;

    function saveData() {
        localStorage.setItem("students", JSON.stringify(students));
        localStorage.setItem("exams", JSON.stringify(exams));
    }

    function showToast(message) {
        const toast = document.createElement("div");
        toast.className = "fixed top-5 right-5 bg-blue-500 text-white p-3 rounded shadow-lg";
        toast.innerText = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    window.showSection = function (sectionId) {
        const sections = {
            addStudentSection: `
                <h2 class="text-xl font-semibold">➕ Add Student</h2>
                <input type="text" id="studentId" placeholder="Student ID" class="w-full p-2 border rounded mt-2">
                <input type="text" id="studentName" placeholder="Name" class="w-full p-2 border rounded mt-2">
                <input type="text" id="studentYear" placeholder="Year" class="w-full p-2 border rounded mt-2">
                <input type="text" id="studentGender" placeholder="Gender" class="w-full p-2 border rounded mt-2">
                <button onclick="addStudent()" class="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Save</button>
            `,
            addExamSection: `
                <h2 class="text-xl font-semibold">📝 Add Exam</h2>
                <input type="text" id="examStudentId" placeholder="Student ID" class="w-full p-2 border rounded mt-2">
                <input type="text" id="examName" placeholder="Exam Name" class="w-full p-2 border rounded mt-2">
                <input type="number" id="obtainedMarks" placeholder="Obtained Marks" class="w-full p-2 border rounded mt-2">
                <input type="number" id="totalMarks" placeholder="Total Marks" class="w-full p-2 border rounded mt-2">
                <button onclick="addExam()" class="bg-blue-500 text-white px-4 py-2 mt-2 rounded">Save</button>
            `,
            viewStudentsSection: `<h2 class="text-xl font-semibold">👨‍🎓 View Students</h2><input type="text" id="searchStudent" placeholder="Search by name..." oninput="filterStudents()" class="w-full p-2 border rounded mt-2"><table id="studentTable" class="w-full mt-2"></table>`,
            viewResultsSection: `<h2 class="text-xl font-semibold">📄 View Results</h2><input type="text" id="searchExam" placeholder="Search by student ID..." oninput="filterExams()" class="w-full p-2 border rounded mt-2"><table id="examTable" class="w-full mt-2"></table><canvas id="performanceChart"></canvas>`
        };
        dynamicContent.innerHTML = sections[sectionId] || "";
        updateStudentTable();
        updateExamTable();
        updateChart();
    };

    window.addStudent = function () {
        const id = document.getElementById("studentId").value.trim();
        const name = document.getElementById("studentName").value.trim();
        const year = document.getElementById("studentYear").value.trim();
        const gender = document.getElementById("studentGender").value.trim();

        if (!id || !name || !year || !gender) {
            showToast("⚠️ Please fill all fields!");
            return;
        }

        students.push({ id, name, year, gender });
        saveData();
        showToast("✅ Student Added Successfully!");
        showSection("viewStudentsSection");
    };

    window.addExam = function () {
        const studentId = document.getElementById("examStudentId").value.trim();
        const examName = document.getElementById("examName").value.trim();
        const obtained = parseFloat(document.getElementById("obtainedMarks").value);
        const total = parseFloat(document.getElementById("totalMarks").value);

        if (!studentId || !examName || isNaN(obtained) || isNaN(total)) {
            showToast("⚠️ Please fill all fields correctly!");
            return;
        }

        const percentage = ((obtained / total) * 100).toFixed(2);
        exams.push({ studentId, examName, obtained, total, percentage });
        saveData();
        showToast("✅ Exam Added Successfully!");
        showSection("viewResultsSection");
    };

    window.updateStudentTable = function () {
        const studentTable = document.getElementById("studentTable");
        if (!studentTable) return;

        studentTable.innerHTML = students.map((student, index) => `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.year}</td>
                <td>${student.gender}</td>
                <td>
                    <button onclick="deleteStudent(${index})" class="bg-red-500 text-white px-2 py-1">❌ Delete</button>
                </td>
            </tr>`).join("");
    };

    window.updateExamTable = function () {
        const examTable = document.getElementById("examTable");
        if (!examTable) return;

        examTable.innerHTML = exams.map((exam, index) => `
            <tr>
                <td>${exam.studentId}</td>
                <td>${exam.examName}</td>
                <td>${exam.obtained}</td>
                <td>${exam.total}</td>
                <td>${exam.percentage}%</td>
                <td><button onclick="deleteExam(${index})" class="bg-red-500 text-white px-2 py-1">❌ Delete</button></td>
            </tr>`).join("");
    };

    window.deleteStudent = function (index) {
        students.splice(index, 1);
        saveData();
        showToast("🗑 Student Deleted!");
        updateStudentTable();
    };

    window.deleteExam = function (index) {
        exams.splice(index, 1);
        saveData();
        showToast("🗑 Exam Deleted!");
        updateExamTable();
        updateChart();
    };

    window.filterStudents = function () {
        const searchText = document.getElementById("searchStudent").value.toLowerCase();
        students = JSON.parse(localStorage.getItem("students")) || [];
        students = students.filter(student => student.name.toLowerCase().includes(searchText));
        updateStudentTable();
    };

    window.filterExams = function () {
        const searchText = document.getElementById("searchExam").value.toLowerCase();
        exams = JSON.parse(localStorage.getItem("exams")) || [];
        exams = exams.filter(exam => exam.studentId.toLowerCase().includes(searchText));
        updateExamTable();
    };

    window.updateChart = function () {
        const chartCanvas = document.getElementById("performanceChart");
        if (!chartCanvas) return;

        if (chartInstance) chartInstance.destroy();
        chartInstance = new Chart(chartCanvas.getContext("2d"), {
            type: "bar",
            data: {
                labels: exams.map(exam => `${exam.studentId} (${exam.examName})`),
                datasets: [{ label: "Percentage (%)", data: exams.map(exam => exam.percentage), backgroundColor: ["#4285F4", "#FBBC05", "#34A853", "#EA4335"] }]
            }
        });
    };

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        localStorage.setItem("darkMode", document.body.classList.contains("dark") ? "enabled" : "disabled");
    });

    showSection("viewStudentsSection");
});
