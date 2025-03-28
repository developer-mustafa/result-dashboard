
document.addEventListener("DOMContentLoaded", () => {
    const dynamicContent = document.getElementById("dynamicContent");
    const darkModeToggle = document.getElementById("darkModeToggle");
    
    // Initialize data from localStorage or empty arrays
    let students = JSON.parse(localStorage.getItem("students")) || [];
    let exams = JSON.parse(localStorage.getItem("exams")) || [];
    let chartInstance = null;

    // Check for dark mode preference
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark");
        darkModeToggle.innerHTML = `
            <svg  xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 bg-white" fill="gray" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Light Mode
        `;
    }

    // Toggle dark mode
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        if (document.body.classList.contains("dark")) {
            localStorage.setItem("darkMode", "enabled");
            darkModeToggle.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Light Mode
            `;
        } else {
            localStorage.setItem("darkMode", "disabled");
            darkModeToggle.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Dark Mode
            `;
        }
    });

    // Save data to localStorage
    function saveData() {
        localStorage.setItem("students", JSON.stringify(students));
        localStorage.setItem("exams", JSON.stringify(exams));
    }

    // Show toast notification
    function showToast(message, type = "info") {
        const colors = {
            success: "bg-green-500",
            error: "bg-red-500",
            warning: "bg-yellow-500",
            info: "bg-blue-500"
        };
        
        const toast = document.createElement("div");
        toast.className = `fixed top-5 right-5 ${colors[type]} text-white p-3 rounded-lg shadow-lg flex items-center toast`;
        toast.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ${message}
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // Update dashboard with statistics
    function updateDashboard() {
        const totalStudents = students.length;
        const maleCount = students.filter(s => s.gender === "Male").length;
        const femaleCount = students.filter(s => s.gender === "Female").length;
        const totalExams = exams.length;
        const avgPercentage = exams.length > 0 
            ? (exams.reduce((sum, exam) => sum + parseFloat(exam.percentage), 0) / exams.length).toFixed(2)
            : 0;

        dynamicContent.innerHTML = `
            <h2 class="text-2xl font-semibold mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Dashboard Overview
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold">Total Students</h3>
                    <p class="text-3xl font-bold">${totalStudents}</p>
                </div>
                <div class="bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold">Male Students</h3>
                    <p class="text-3xl font-bold">${maleCount}</p>
                </div>
                <div class="bg-pink-100 dark:bg-pink-900 p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold">Female Students</h3>
                    <p class="text-3xl font-bold">${femaleCount}</p>
                </div>
                <div class="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold">Total Exams</h3>
                    <p class="text-3xl font-bold">${totalExams}</p>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-2">Recent Students</h3>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead class="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th class="px-4 py-2 text-left">ID</th>
                                    <th class="px-4 py-2 text-left">Name</th>
                                    <th class="px-4 py-2 text-left">Gender</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                ${students.slice(-5).reverse().map(student => `
                                    <tr>
                                        <td class="px-4 py-2">${student.id}</td>
                                        <td class="px-4 py-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 cursor-pointer" onclick="viewStudentReport('${student.id}')">
                                            ${student.name}
                                        </td>
                                        <td class="px-4 py-2">${student.gender}</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h3 class="text-lg font-semibold mb-2">Performance Summary</h3>
                    <div class="flex items-center justify-center h-full">
                        <div class="text-center">
                            <p class="text-4xl font-bold mb-2">${avgPercentage}%</p>
                            <p class="text-gray-600 dark:text-gray-400">Average Performance</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 class="text-lg font-semibold mb-4">Quick Actions</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onclick="showSection('addStudentSection')" class="p-4 bg-blue-500 dark:bg-blue-900 rounded-lg flex items-center justify-center  transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Add New Student
                    </button>
                    <button onclick="showSection('addExamSection')" class="p-4 bg-green-500 dark:bg-green-900 rounded-lg flex items-center justify-center  transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Record Exam
                    </button>
                    <button onclick="showSection('viewStudentsSection')" class="p-4 bg-purple-500 dark:bg-purple-900 rounded-lg flex items-center justify-center  transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        View All Students
                    </button>
                </div>
            </div>
        `;
    }

    // Show different sections of the application
    window.showSection = function (sectionId) {
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }

        const sections = {
            dashboard: () => updateDashboard(),
            
            addStudentSection: () => {
                dynamicContent.innerHTML = `
                    <h2 class="text-2xl font-semibold mb-6 flex items-center  hover:bg-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Add New Student
                    </h2>
                    
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <form id="studentForm" class="space-y-4">
                            <div>
                                <label for="studentId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Student ID</label>
                                <input type="text" id="studentId" placeholder="Enter student ID" 
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                            </div>
                            
                            <div>
                                <label for="studentName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                <input type="text" id="studentName" placeholder="Enter student name" 
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                            </div>
                            
                            <div>
                                <label for="studentGender" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                                <select id="studentGender" 
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            
                            <div>
                                <label for="studentEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email (Optional)</label>
                                <input type="email" id="studentEmail" placeholder="Enter email address" 
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                            </div>
                            
                            <div class="flex justify-end space-x-3">
                                <button type="button" onclick="showSection('dashboard')" 
                                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                                    Cancel
                                </button>
                                <button type="button" onclick="addStudent()" 
                                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Save Student
                                </button>
                            </div>
                        </form>
                    </div>
                `;
            },
            
            addExamSection: () => {
                if (students.length === 0) {
                    dynamicContent.innerHTML = `
                        <div class="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mb-6">
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <svg class="h-5 w-5 text-yellow-400 dark:text-yellow-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div class="ml-3">
                                    <p class="text-sm text-yellow-700 dark:text-yellow-300">
                                        No students found. Please add students before recording exams.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button onclick="showSection('addStudentSection')" 
                            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Add New Student
                        </button>
                    `;
                    return;
                }

                dynamicContent.innerHTML = `
                    <h2 class="text-2xl font-semibold mb-6 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Record Exam Results
                    </h2>
                    
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                        <form id="examForm" class="space-y-4">
                            <div>
                                <label for="examStudentId" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Student</label>
                                <select id="examStudentId" 
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                                    ${students.map(student => `
                                        <option value="${student.id}">${student.name} (${student.id})</option>
                                    `).join("")}
                                </select>
                            </div>
                            
                            <div>
                                <label for="examName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Exam Name</label>
                                <input type="text" id="examName" placeholder="e.g., Midterm, Final, Quiz 1" 
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                            </div>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="obtainedMarks" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Obtained Marks</label>
                                    <input type="number" id="obtainedMarks" placeholder="Marks obtained" step="0.01" min="0" 
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                                </div>
                                <div>
                                    <label for="totalMarks" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Marks</label>
                                    <input type="number" id="totalMarks" placeholder="Total possible marks" step="0.01" min="1" 
                                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                                </div>
                            </div>
                            
                            <div>
                                <label for="examDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Exam Date</label>
                                <input type="date" id="examDate" 
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                            </div>
                            
                            <div>
                                <label for="examNotes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (Optional)</label>
                                <textarea id="examNotes" rows="3" placeholder="Any additional notes about this exam" 
                                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"></textarea>
                            </div>
                            
                            <div class="flex justify-end space-x-3">
                                <button type="button" onclick="showSection('dashboard')" 
                                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                                    Cancel
                                </button>
                                <button type="button" onclick="addExam()" 
                                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Save Exam
                                </button>
                            </div>
                        </form>
                    </div>
                `;
                
                // Set default date to today
                document.getElementById("examDate").valueAsDate = new Date();
            },
            
            viewStudentsSection: () => {
                dynamicContent.innerHTML = `
                    <h2 class="text-2xl font-semibold mb-6 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Student Records
                    </h2>
                    
                    <div class="flex justify-between items-center mb-4">
                        <div class="relative w-64">
                            <input type="text" id="searchStudent" placeholder="Search students..." 
                                class="block w-full rounded-md border-gray-300 shadow-sm pl-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600" 
                                onkeyup="searchStudents()">
                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        
                        <button onclick="exportStudentData()" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export Data
                        </button>
                    </div>
                    
                    <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead class="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gender</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Exams</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Avg. Score</th>
                                        <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="studentTableBody" class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    ${students.map(student => {
                                        const studentExams = exams.filter(exam => exam.studentId === student.id);
                                        const examCount = studentExams.length;
                                        const avgScore = examCount > 0 
                                            ? (studentExams.reduce((sum, exam) => sum + parseFloat(exam.percentage), 0) / examCount).toFixed(2)
                                            : "N/A";
                                        
                                        return `
                                            <tr>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">${student.id}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer" onclick="viewStudentReport('${student.id}')">
                                                    ${student.name}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${student.gender}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${examCount}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${avgScore}%</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button onclick="event.stopPropagation(); editStudent('${student.id}')" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                                                        Edit
                                                    </button>
                                                    <button onclick="event.stopPropagation(); deleteStudent('${student.id}')" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        `;
                                    }).join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    ${students.length === 0 ? `
                        <div class="mt-8 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-300">No students found</h3>
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding a new student.</p>
                            <div class="mt-6">
                                <button onclick="showSection('addStudentSection')" 
                                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Student
                                </button>
                            </div>
                        </div>
                    ` : ""}
                `;
            }
        };

        if (sections[sectionId]) {
            sections[sectionId]();
        } else {
            updateDashboard();
        }
    };

    // Add a new student
    window.addStudent = function () {
        const id = document.getElementById("studentId").value.trim();
        const name = document.getElementById("studentName").value.trim();
        const gender = document.getElementById("studentGender").value;
        const email = document.getElementById("studentEmail").value.trim();

        if (!id || !name) {
            showToast("Please fill in all required fields", "error");
            return;
        }

        if (students.some(student => student.id === id)) {
            showToast("Student ID already exists", "error");
            return;
        }

        const newStudent = { id, name, gender };
        if (email) newStudent.email = email;

        students.push(newStudent);
        saveData();
        showToast("Student added successfully", "success");
        showSection("viewStudentsSection");
    };

    // Edit an existing student
    window.editStudent = function (studentId) {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        dynamicContent.innerHTML = `
            <h2 class="text-2xl font-semibold mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Student
            </h2>
            
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <form id="editStudentForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Student ID</label>
                        <div class="mt-1 block w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-md">${student.id}</div>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Student ID cannot be changed.</p>
                    </div>
                    
                    <div>
                        <label for="editStudentName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                        <input type="text" id="editStudentName" value="${student.name}" 
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                    </div>
                    
                    <div>
                        <label for="editStudentGender" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                        <select id="editStudentGender" 
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                            <option value="Male" ${student.gender === "Male" ? "selected" : ""}>Male</option>
                            <option value="Female" ${student.gender === "Female" ? "selected" : ""}>Female</option>
                            <option value="Other" ${student.gender === "Other" ? "selected" : ""}>Other</option>
                        </select>
                    </div>
                    
                    <div>
                        <label for="editStudentEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input type="email" id="editStudentEmail" value="${student.email || ""}" placeholder="Enter email address" 
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                    </div>
                    
                    <div class="flex justify-end space-x-3">
                        <button type="button" onclick="showSection('viewStudentsSection')" 
                            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                            Cancel
                        </button>
                        <button type="button" onclick="updateStudent('${student.id}')" 
                            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        `;
    };

    // Update student information
    window.updateStudent = function (studentId) {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        const name = document.getElementById("editStudentName").value.trim();
        const gender = document.getElementById("editStudentGender").value;
        const email = document.getElementById("editStudentEmail").value.trim();

        if (!name) {
            showToast("Name is required", "error");
            return;
        }

        student.name = name;
        student.gender = gender;
        if (email) {
            student.email = email;
        } else {
            delete student.email;
        }

        saveData();
        showToast("Student updated successfully", "success");
        showSection("viewStudentsSection");
    };

    // Add a new exam
    window.addExam = function () {
        const studentId = document.getElementById("examStudentId").value;
        const examName = document.getElementById("examName").value.trim();
        const obtained = parseFloat(document.getElementById("obtainedMarks").value);
        const total = parseFloat(document.getElementById("totalMarks").value);
        const examDate = document.getElementById("examDate").value;
        const notes = document.getElementById("examNotes").value.trim();

        if (!examName || isNaN(obtained) || isNaN(total) || obtained < 0 || total <= 0 || obtained > total) {
            showToast("Please enter valid exam details", "error");
            return;
        }

        const percentage = ((obtained / total) * 100).toFixed(2);
        const newExam = {
            studentId,
            examName,
            obtained,
            total,
            percentage,
            date: examDate
        };
        
        if (notes) newExam.notes = notes;

        exams.push(newExam);
        saveData();
        showToast("Exam recorded successfully", "success");
        showSection("viewStudentsSection");
    };

    // Search students by name or ID
    window.searchStudents = function () {
        const query = document.getElementById("searchStudent").value.toLowerCase();
        const studentTableBody = document.getElementById("studentTableBody");
        
        if (!studentTableBody) return;
        
        const filteredStudents = students.filter(student => 
            student.name.toLowerCase().includes(query) || 
            student.id.toLowerCase().includes(query)
        );
        
        studentTableBody.innerHTML = filteredStudents.map(student => {
            const studentExams = exams.filter(exam => exam.studentId === student.id);
            const examCount = studentExams.length;
            const avgScore = examCount > 0 
                ? (studentExams.reduce((sum, exam) => sum + parseFloat(exam.percentage), 0) / examCount).toFixed(2)
                : "N/A";
            
            return `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">${student.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer" onclick="viewStudentReport('${student.id}')">
                        ${student.name}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${student.gender}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${examCount}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${avgScore}%</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onclick="event.stopPropagation(); editStudent('${student.id}')" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                            Edit
                        </button>
                        <button onclick="event.stopPropagation(); deleteStudent('${student.id}')" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        }).join("");
    };

    // View student report with exams
    window.viewStudentReport = function (studentId) {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        const studentExams = exams.filter(exam => exam.studentId === studentId);
        
        // Destroy previous chart if exists
        if (chartInstance) {
            chartInstance.destroy();
        }

        dynamicContent.innerHTML = `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-semibold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Student Performance Report
                </h2>
                <div class="flex space-x-2">
                    <button onclick="exportStudentReport('${studentId}')" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export
                    </button>
                    <button onclick="showSection('viewStudentsSection')" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back
                    </button>
                </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Student ID</h3>
                        <p class="mt-1 text-sm text-gray-900 dark:text-gray-300">${student.id}</p>
                    </div>
                    <div>
                        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                        <p class="mt-1 text-sm text-gray-900 dark:text-gray-300">${student.name}</p>
                    </div>
                    <div>
                        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</h3>
                        <p class="mt-1 text-sm text-gray-900 dark:text-gray-300">${student.gender}</p>
                    </div>
                    ${student.email ? `
                        <div class="md:col-span-3">
                            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h3>
                            <p class="mt-1 text-sm text-gray-900 dark:text-gray-300">${student.email}</p>
                        </div>
                    ` : ""}
                </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
                <h3 class="text-lg font-semibold mb-4">Performance Summary</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div class="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
                        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Total Exams</h4>
                        <p class="text-2xl font-bold">${studentExams.length}</p>
                    </div>
                    <div class="bg-green-100 dark:bg-green-900 p-4 rounded-lg">
                        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Average Score</h4>
                        <p class="text-2xl font-bold">
                            ${studentExams.length > 0 
                                ? (studentExams.reduce((sum, exam) => sum + parseFloat(exam.percentage), 0) / studentExams.length).toFixed(2) + "%"
                                : "N/A"}
                        </p>
                    </div>
                    <div class="bg-purple-100 dark:bg-purple-900 p-4 rounded-lg">
                        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">Highest Score</h4>
                        <p class="text-2xl font-bold">
                            ${studentExams.length > 0 
                                ? Math.max(...studentExams.map(exam => parseFloat(exam.percentage))) + "%"
                                : "N/A"}
                        </p>
                    </div>
                </div>
                
                <div class="h-64">
                    <canvas id="chartCanvas"></canvas>
                </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 class="text-lg font-semibold mb-4">Exam History</h3>
                ${studentExams.length > 0 ? `
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead class="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Exam</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Obtained</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Percentage</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Notes</th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                ${studentExams.map((exam, index) => `
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">${exam.examName}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${exam.date || "N/A"}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${exam.obtained}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${exam.total}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${exam.percentage}%</td>
                                        <td class="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">${exam.notes || "—"}</td>
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onclick="editExam('${studentId}', ${index})" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                                                Edit
                                            </button>
                                            <button onclick="deleteExam('${studentId}', ${index})" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                ` : `
                    <div class="text-center py-8">
                        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-300">No exams recorded</h3>
                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Add exam results to track performance.</p>
                        <div class="mt-6">
                            <button onclick="showSection('addExamSection')" 
                                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Exam
                            </button>
                        </div>
                    </div>
                `}
            </div>
        `;

        // Create chart if there are exams
        if (studentExams.length > 0) {
            const ctx = document.getElementById("chartCanvas").getContext("2d");
            chartInstance = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: studentExams.map(exam => exam.examName),
                    datasets: [{
                        label: "Percentage (%)",
                        data: studentExams.map(exam => exam.percentage),
                        backgroundColor: "rgba(59, 130, 246, 0.7)",
                        borderColor: "rgba(59, 130, 246, 1)",
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            title: {
                                display: true,
                                text: "Percentage (%)"
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const exam = studentExams[context.dataIndex];
                                    return [
                                        `Obtained: ${exam.obtained}/${exam.total}`,
                                        `Percentage: ${exam.percentage}%`
                                    ];
                                }
                            }
                        }
                    }
                }
            });
        }
    };

    // Edit an exam
    window.editExam = function (studentId, examIndex) {
        const studentExams = exams.filter(exam => exam.studentId === studentId);
        const exam = studentExams[examIndex];
        if (!exam) return;

        const student = students.find(s => s.id === studentId);
        if (!student) return;

        dynamicContent.innerHTML = `
            <h2 class="text-2xl font-semibold mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Exam
            </h2>
            
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <div class="mb-6">
                    <h3 class="text-lg font-medium mb-2">Student Information</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Student ID</p>
                            <p class="font-medium">${student.id}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">Name</p>
                            <p class="font-medium">${student.name}</p>
                        </div>
                    </div>
                </div>
                
                <form id="editExamForm" class="space-y-4">
                    <div>
                        <label for="editExamName" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Exam Name</label>
                        <input type="text" id="editExamName" value="${exam.examName}" 
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="editObtainedMarks" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Obtained Marks</label>
                            <input type="number" id="editObtainedMarks" value="${exam.obtained}" step="0.01" min="0" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                        </div>
                        <div>
                            <label for="editTotalMarks" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Marks</label>
                            <input type="number" id="editTotalMarks" value="${exam.total}" step="0.01" min="1" 
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                        </div>
                    </div>
                    
                    <div>
                        <label for="editExamDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Exam Date</label>
                        <input type="date" id="editExamDate" value="${exam.date || ""}" 
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">
                    </div>
                    
                    <div>
                        <label for="editExamNotes" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                        <textarea id="editExamNotes" rows="3" 
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600">${exam.notes || ""}</textarea>
                    </div>
                    
                    <div class="flex justify-end space-x-3">
                        <button type="button" onclick="viewStudentReport('${studentId}')" 
                            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
                            Cancel
                        </button>
                        <button type="button" onclick="updateExam('${studentId}', ${examIndex})" 
                            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        // Set date if not already set
        if (!exam.date) {
            document.getElementById("editExamDate").valueAsDate = new Date();
        }
    };

    // Update exam information
    window.updateExam = function (studentId, examIndex) {
        const examName = document.getElementById("editExamName").value.trim();
        const obtained = parseFloat(document.getElementById("editObtainedMarks").value);
        const total = parseFloat(document.getElementById("editTotalMarks").value);
        const examDate = document.getElementById("editExamDate").value;
        const notes = document.getElementById("editExamNotes").value.trim();

        if (!examName || isNaN(obtained) || isNaN(total) || obtained < 0 || total <= 0 || obtained > total) {
            showToast("Please enter valid exam details", "error");
            return;
        }

        // Find the exam in the exams array
        const studentExams = exams.filter(exam => exam.studentId === studentId);
        const exam = studentExams[examIndex];
        if (!exam) return;

        // Calculate new percentage
        const percentage = ((obtained / total) * 100).toFixed(2);

        // Update exam details
        exam.examName = examName;
        exam.obtained = obtained;
        exam.total = total;
        exam.percentage = percentage;
        exam.date = examDate;
        exam.notes = notes || undefined;

        saveData();
        showToast("Exam updated successfully", "success");
        viewStudentReport(studentId);
    };

    // Delete an exam
    window.deleteExam = function (studentId, examIndex) {
        if (!confirm("Are you sure you want to delete this exam record?")) return;

        // Find the exam in the exams array
        const studentExams = exams.filter(exam => exam.studentId === studentId);
        const exam = studentExams[examIndex];
        if (!exam) return;

        // Remove the exam from the exams array
        exams = exams.filter(e => !(e.studentId === studentId && e.examName === exam.examName && e.obtained === exam.obtained && e.total === exam.total));

        saveData();
        showToast("Exam deleted successfully", "success");
        viewStudentReport(studentId);
    };

    // Delete a student
    window.deleteStudent = function (studentId) {
        if (!confirm("Are you sure you want to delete this student and all their exam records?")) return;

        students = students.filter(student => student.id !== studentId);
        exams = exams.filter(exam => exam.studentId !== studentId);
        saveData();
        showToast("Student deleted successfully", "success");
        showSection("viewStudentsSection");
    };

    // Export student data as CSV
    window.exportStudentData = function () {
        if (students.length === 0) {
            showToast("No student data to export", "warning");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Student headers
        csvContent += "Student ID,Name,Gender,Email\n";
        
        // Student data
        students.forEach(student => {
            csvContent += `${student.id},"${student.name}",${student.gender},${student.email || ""}\n`;
        });
        
        // Exam headers
        csvContent += "\nExam Data\n";
        csvContent += "Student ID,Student Name,Exam Name,Date,Obtained Marks,Total Marks,Percentage,Notes\n";
        
        // Exam data
        exams.forEach(exam => {
            const student = students.find(s => s.id === exam.studentId);
            const studentName = student ? student.name : "Unknown";
            csvContent += `${exam.studentId},"${studentName}","${exam.examName}",${exam.date || ""},${exam.obtained},${exam.total},${exam.percentage},"${exam.notes || ""}"\n`;
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "student_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Export student report as PDF
    window.exportStudentReport = function (studentId) {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        const element = document.createElement("div");
        element.className = "p-6";
        element.innerHTML = `
            <h1 class="text-2xl font-bold mb-4">Student Performance Report</h1>
            <div class="mb-6">
                <h2 class="text-xl font-semibold mb-2">Student Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p class="text-sm text-gray-600">Student ID</p>
                        <p class="font-medium">${student.id}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Name</p>
                        <p class="font-medium">${student.name}</p>
                    </div>
                    <div>
                        <p class="text-sm text-gray-600">Gender</p>
                        <p class="font-medium">${student.gender}</p>
                    </div>
                    ${student.email ? `
                        <div class="md:col-span-3">
                            <p class="text-sm text-gray-600">Email</p>
                            <p class="font-medium">${student.email}</p>
                        </div>
                    ` : ""}
                </div>
            </div>
            
            <div class="mb-6">
                <h2 class="text-xl font-semibold mb-2">Performance Summary</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="border p-4 rounded">
                        <p class="text-sm text-gray-600">Total Exams</p>
                        <p class="text-2xl font-bold">${exams.filter(e => e.studentId === studentId).length}</p>
                    </div>
                    <div class="border p-4 rounded">
                        <p class="text-sm text-gray-600">Average Score</p>
                        <p class="text-2xl font-bold">
                            ${exams.filter(e => e.studentId === studentId).length > 0 
                                ? (exams.filter(e => e.studentId === studentId)
                                    .reduce((sum, exam) => sum + parseFloat(exam.percentage), 0) / 
                                    exams.filter(e => e.studentId === studentId).length).toFixed(2) + "%"
                                : "N/A"}
                        </p>
                    </div>
                    <div class="border p-4 rounded">
                        <p class="text-sm text-gray-600">Highest Score</p>
                        <p class="text-2xl font-bold">
                            ${exams.filter(e => e.studentId === studentId).length > 0 
                                ? Math.max(...exams.filter(e => e.studentId === studentId)
                                    .map(exam => parseFloat(exam.percentage))) + "%"
                                : "N/A"}
                        </p>
                    </div>
                </div>
            </div>
            
            <div>
                <h2 class="text-xl font-semibold mb-2">Exam History</h2>
                <table class="min-w-full border">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border px-4 py-2 text-left">Exam</th>
                            <th class="border px-4 py-2 text-left">Date</th>
                            <th class="border px-4 py-2 text-left">Obtained</th>
                            <th class="border px-4 py-2 text-left">Total</th>
                            <th class="border px-4 py-2 text-left">Percentage</th>
                            <th class="border px-4 py-2 text-left">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${exams.filter(e => e.studentId === studentId).map(exam => `
                            <tr>
                                <td class="border px-4 py-2">${exam.examName}</td>
                                <td class="border px-4 py-2">${exam.date || "N/A"}</td>
                                <td class="border px-4 py-2">${exam.obtained}</td>
                                <td class="border px-4 py-2">${exam.total}</td>
                                <td class="border px-4 py-2">${exam.percentage}%</td>
                                <td class="border px-4 py-2">${exam.notes || "—"}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
            
            <div class="mt-6 text-sm text-gray-500">
                <p>Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            </div>
        `;

        const opt = {
            margin: 10,
            filename: `student_report_${studentId}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Generate PDF
        html2pdf().set(opt).from(element).save();
    };

    // Initialize the dashboard
    showSection("dashboard");
});
