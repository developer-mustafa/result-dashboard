
document.addEventListener("DOMContentLoaded", () => {
    const dynamicContent = document.getElementById("dynamicContent");
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
            dashboard: `<h2 class='text-xl font-semibold'>📁 Dashboard</h2>`
                + `<p>Welcome to Student Management System</p>`,
            addStudentSection: `
                <h2 class="text-xl font-semibold">➕ Add Student</h2>
                <input type="text" id="studentId" placeholder="Student ID" class="w-full p-2 border rounded mt-2">
                <input type="text" id="studentName" placeholder="Name" class="w-full p-2 border rounded mt-2">
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
            viewStudentsSection: `<h2 class='text-xl font-semibold'>👨‍🎓 View Students</h2><table id='studentTable' class='w-full mt-2'></table>`
        };
        dynamicContent.innerHTML = sections[sectionId] || "";
        updateStudentTable();
    };

    window.addStudent = function () {
        const id = document.getElementById("studentId").value.trim();
        const name = document.getElementById("studentName").value.trim();

        if (!id || !name) {
            showToast("⚠️ Please fill all fields!");
            return;
        }

        students.push({ id, name });
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

        exams.push({ studentId, examName, obtained, total, percentage: ((obtained / total) * 100).toFixed(2) });
        saveData();
        showToast("✅ Exam Added Successfully!");
        showSection("viewStudentsSection");
    };

    window.updateStudentTable = function () {
        const studentTable = document.getElementById("studentTable");
        if (!studentTable) return;
        studentTable.innerHTML = students.map(student => `
            <tr>
                <td>${student.id}</td>
                <td onclick='viewStudentReport("${student.id}")' class='cursor-pointer text-blue-500'>${student.name}</td>
            </tr>`).join("");
    };

    window.viewStudentReport = function (studentId) {
        const studentExams = exams.filter(exam => exam.studentId === studentId);
        if (chartInstance) chartInstance.destroy();
        const chartCanvas = document.createElement("canvas");
        dynamicContent.innerHTML = `<h2 class='text-xl font-semibold'>📊 ${studentId} Report</h2>`;
        dynamicContent.appendChild(chartCanvas);
        chartInstance = new Chart(chartCanvas.getContext("2d"), {
            type: "bar",
            data: {
                labels: studentExams.map(exam => exam.examName),
                datasets: [{ label: "Percentage (%)", data: studentExams.map(exam => exam.percentage) }]
            }
        });
    };

    window.printStudentReport = function (studentId) {
        const studentExams = exams.filter(exam => exam.studentId === studentId);
        let reportContent = `<h1>Report Card - ${studentId}</h1>`;
        studentExams.forEach(exam => {
            reportContent += `<p>${exam.examName}: ${exam.percentage}%</p>`;
        });
        let newWindow = window.open("", "", "width=800, height=600");
        newWindow.document.write(reportContent);
        newWindow.print();
    };

    showSection("dashboard");
});
