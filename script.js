document.addEventListener("DOMContentLoaded", () => {
    loadHistory();
    addRow(); // Start with one row
});

// Close the history panel with the Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleHistory(false);
});

// --- PRESETS ---

// Inside script.js

const presets = {
    // --- BSAI (Artificial Intelligence) - 2024-2028 batch scheme ---
    // Newer batches follow a different scheme (see imsciences.edu.pk BSAI page)
    "bsai_1": [
        { name: "Functional English", credit: 3 },
        { name: "Programming Fund. (Th)", credit: 3 },
        { name: "Programming Fund. (Lab)", credit: 1 },
        { name: "ICT (Theory)", credit: 3 },
        { name: "ICT (Lab)", credit: 1 },
        { name: "Islamiat", credit: 2 },
        { name: "Calculus", credit: 3 }
    ],
    "bsai_2": [
        { name: "OOP (Theory)", credit: 3 },
        { name: "OOP (Lab)", credit: 1 },
        { name: "Applied Physics", credit: 3 },
        { name: "Ideology & Const. of Pak", credit: 2 },
        { name: "Expository Writing", credit: 3 },
        { name: "Linear Algebra", credit: 3 },
        { name: "Intro to Business", credit: 2 }
    ],
    "bsai_3": [
        { name: "Civics & Comm. Engage", credit: 2 },
        { name: "Data Structures (Th)", credit: 3 },
        { name: "Data Structures (Lab)", credit: 1 },
        { name: "Digital Logic Design (Th)", credit: 2 },
        { name: "Digital Logic Design (Lab)", credit: 1 },
        { name: "Discrete Structures", credit: 3 },
        { name: "Multivariable Calculus", credit: 3 },
        { name: "Operating Systems (Th)", credit: 2 },
        { name: "Operating Systems (Lab)", credit: 1 }
    ],
    // --- NEW: BSAI Semester 4 ---
    "bsai_4": [
        { name: "Database Systems (Th)", credit: 3 },
        { name: "Database Systems (Lab)", credit: 1 },
        { name: "Software Engineering", credit: 3 },
        { name: "Design & Analysis of Alg. (Th)", credit: 3 },
        { name: "Artificial Intelligence (Th)", credit: 2 },
        { name: "Artificial Intelligence (Lab)", credit: 1 },
        { name: "Comp. Org. & Assembly (Th)", credit: 2 },
        { name: "Comp. Org. & Assembly (Lab)", credit: 1 },
        { name: "Probability & Statistics", credit: 3 }
    ],
    // --- NEW: BSAI Semester 5 (18 Cr, from Fall 2026 timetable) ---
    "bsai_5": [
        { name: "Machine Learning (Th)", credit: 2 },
        { name: "Machine Learning (Lab)", credit: 1 },
        { name: "Computer Networks (Th)", credit: 2 },
        { name: "Computer Networks (Lab)", credit: 1 },
        { name: "Parallel & Distributed Comp. (Th)", credit: 2 },
        { name: "Parallel & Distributed Comp. (Lab)", credit: 1 },
        { name: "Programming for AI (Th)", credit: 2 },
        { name: "Programming for AI (Lab)", credit: 1 },
        { name: "Technical & Business Writing", credit: 3 },
        { name: "Fundamentals of Accounting", credit: 3 }
    ],

    // --- BSCS (Computer Science) ---
    "cs_1": [
        { name: "Intro to ICT", credit: 3 },
        { name: "Prog. Fundamentals", credit: 4 },
        { name: "English Comp", credit: 3 },
        { name: "Calculus", credit: 3 }
    ],
    "cs_2": [
        { name: "OOP", credit: 4 },
        { name: "Discrete Struct", credit: 3 },
        { name: "Comm Skills", credit: 3 },
        { name: "Digital Logic", credit: 3 }
    ],

    // --- BBA ---
    "bba_1": [
        { name: "Microeconomics", credit: 3 },
        { name: "Business Math", credit: 3 },
        { name: "Intro to Business", credit: 3 }
    ]
};

// --- LOGIC: TABS ---
function openTab(evt, tabName) {
    document.querySelectorAll(".tab-content").forEach(tab => tab.style.display = "none");
    document.querySelectorAll(".tab-link").forEach(btn => btn.classList.remove("active"));
    document.getElementById(tabName).style.display = "block";
    if(evt) evt.currentTarget.classList.add("active");
}

function toggleCustomSettings() {
    let model = document.getElementById("gradingModel").value;
    let customBox = document.getElementById("customSettings");
    if (model === "custom") customBox.classList.remove("hidden");
    else customBox.classList.add("hidden");
    recalcAllRows(); // Grades depend on the model, so refresh them
}

// --- LOGIC: GRADING ---
function getGradeAndGPA(marks, model) {
    marks = parseFloat(marks);
    if (model === "custom") {
        let minA = parseFloat(document.getElementById("customA").value) || 85;
        let passing = parseFloat(document.getElementById("customPass").value) || 50;
        if (marks >= minA) return ["A", 4.0];
        if (marks < passing) return ["F", 0.0];
        // Split the Passing..A range into four equal steps: C, C+, B, B+
        let step = (minA - passing) / 4;
        if (marks >= passing + step * 3) return ["B+", 3.5];
        if (marks >= passing + step * 2) return ["B", 3.0];
        if (marks >= passing + step) return ["C+", 2.5];
        return ["C", 2.0];
    }
    if (model === "strict") {
        if (marks >= 95) return ["A+", 4.0];
        if (marks >= 90) return ["A", 4.0];
        if (marks >= 85) return ["B+", 3.5];
        if (marks >= 80) return ["B", 3.0];
        return ["F", 0.0];
    } 
    else {
        if (marks >= 91) return ["A+", 4.0];
        else if (marks >= 87) return ["A", 4.0];
        else if (marks >= 80) return ["B+", 3.5];
        else if (marks >= 72) return ["B", 3.0];
        else if (marks >= 66) return ["C+", 2.5];
        else if (marks >= 60) return ["C", 2.0];
        else return ["F", 0.0];
    }
}

// --- LOGIC: TABLE ---
function addRow(name = "", credit = "", marks = "") {
    let tbody = document.getElementById("courseTable").getElementsByTagName('tbody')[0];
    let row = tbody.insertRow();
    // data-label is shown above each value in the phone (card) layout
    row.innerHTML = `
        <td class="subject-cell"><input type="text" placeholder="Subject name" value="${name}" aria-label="Subject"></td>
        <td data-label="Cr. Hrs"><input type="number" placeholder="Cr" min="1" max="6" value="${credit}" inputmode="numeric" aria-label="Credit hours"></td>
        <td data-label="Marks"><input type="number" placeholder="%" min="0" max="100" value="${marks}" inputmode="decimal" oninput="autoCalc(this)" aria-label="Marks"></td>
        <td data-label="Grade" class="grd">-</td>
        <td data-label="GPA" class="gpa">-</td>
        <td class="action-cell"><button class="delete-btn" onclick="deleteRow(this)" title="Remove subject" aria-label="Remove subject"><i class="fas fa-trash"></i></button></td>
    `;
}

function deleteRow(btn) {
    let row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function resetTable() {
    document.querySelector("#courseTable tbody").innerHTML = "";
    document.getElementById("sgpa-result").innerHTML = "";
    addRow();
}

function loadPreset() {
    let key = document.getElementById("presetSelect").value;
    if (key && presets[key]) {
        document.querySelector("#courseTable tbody").innerHTML = "";
        document.getElementById("sgpa-result").innerHTML = "";
        presets[key].forEach(sub => addRow(sub.name, sub.credit, ""));
    }
}

function autoCalc(input) {
    let row = input.parentNode.parentNode;
    let marks = input.value;
    let model = document.getElementById("gradingModel").value;
    if(marks !== "") {
        let [g, p] = getGradeAndGPA(marks, model);
        row.querySelector(".grd").innerText = g;
        row.querySelector(".gpa").innerText = p;
    } else {
        row.querySelector(".grd").innerText = "-";
        row.querySelector(".gpa").innerText = "-";
    }
}

function recalcAllRows() {
    document.querySelectorAll("#courseTable tbody tr").forEach(row => {
        autoCalc(row.getElementsByTagName("input")[2]);
    });
}

// --- CALCULATION: SGPA ---
function calculateSGPA() {
    let rows = document.querySelectorAll("#courseTable tbody tr");
    let totalPts = 0, totalCr = 0;
    let model = document.getElementById("gradingModel").value;
    let error = false;

    rows.forEach((row) => {
        let inputs = row.getElementsByTagName("input");
        let cr = parseFloat(inputs[1].value);
        let mk = parseFloat(inputs[2].value);

        if(isNaN(cr) || cr < 1) { inputs[1].classList.add("invalid"); error=true; }
        else inputs[1].classList.remove("invalid");
        if(isNaN(mk) || mk < 0 || mk > 100) { inputs[2].classList.add("invalid"); error=true; }
        else inputs[2].classList.remove("invalid");

        if(!error && !isNaN(cr) && !isNaN(mk)) {
            let [gr, gp] = getGradeAndGPA(mk, model);
            row.querySelector(".grd").innerText = gr;
            row.querySelector(".gpa").innerText = gp;
            totalPts += (gp * cr);
            totalCr += cr;
        }
    });

    if(error) return;
    let final = totalCr > 0 ? (totalPts / totalCr).toFixed(2) : 0.00;
    document.getElementById("sgpa-result").innerHTML = `<h3>Semester GPA: ${final}</h3><p>Total Credit Hours: ${totalCr}</p>`;
    saveToHistory(`SGPA: ${final}`, `${totalCr} Credits`);
}

// --- CALCULATION: CGPA (Old + New) ---
function calculateCGPA() {
    let oldCGPA = parseFloat(document.getElementById("currentCGPA").value);
    let oldCr = parseFloat(document.getElementById("completedCredits").value);
    let newSGPA = parseFloat(document.getElementById("newSGPA").value);
    let newCr = parseFloat(document.getElementById("newCredits").value);

    if(isNaN(oldCGPA) || isNaN(oldCr) || isNaN(newSGPA) || isNaN(newCr)) {
        document.getElementById("cgpa-result").innerHTML = "<p style='color:red'>Please fill all fields.</p>";
        return;
    }

    let totalPts = (oldCGPA * oldCr) + (newSGPA * newCr);
    let totalCredits = oldCr + newCr;
    let finalCGPA = (totalPts / totalCredits).toFixed(2);

    document.getElementById("cgpa-result").innerHTML = `<h3>New CGPA: ${finalCGPA}</h3><p>Total Credits: ${totalCredits}</p>`;
    saveToHistory(`CGPA: ${finalCGPA}`, `Total: ${totalCredits} Credits`);
}

// --- CALCULATION: CGPA FROM ALL SEMESTERS (credit-weighted) ---
// Fills Sem 1-5 credit hours from the BSAI presets, so both stay in sync
function fillBatchCredits() {
    let creditInputs = document.querySelectorAll(".sem-credit");
    ["bsai_1", "bsai_2", "bsai_3", "bsai_4", "bsai_5"].forEach((key, i) => {
        creditInputs[i].value = presets[key].reduce((sum, sub) => sum + sub.credit, 0);
        creditInputs[i].classList.remove("invalid");
    });
}

function calculateAverage() {
    let sgpaInputs = document.querySelectorAll(".sem-input");
    let creditInputs = document.querySelectorAll(".sem-credit");
    let totalPts = 0, totalCr = 0, count = 0;
    let error = false;

    sgpaInputs.forEach((sgpaInput, i) => {
        let crInput = creditInputs[i];
        sgpaInput.classList.remove("invalid");
        crInput.classList.remove("invalid");

        // A semester without an SGPA is skipped (even if credits were filled in)
        if (sgpaInput.value === "") return;

        let sgpa = parseFloat(sgpaInput.value);
        let cr = parseFloat(crInput.value);
        if (isNaN(sgpa) || sgpa < 0 || sgpa > 4) { sgpaInput.classList.add("invalid"); error = true; }
        if (isNaN(cr) || cr < 1) { crInput.classList.add("invalid"); error = true; }

        if (!error) {
            totalPts += sgpa * cr;
            totalCr += cr;
            count++;
        }
    });

    if (error) {
        document.getElementById("avg-result").innerHTML = "<p style='color:red'>Enter an SGPA (0-4) and credit hours for every semester you filled in.</p>";
        return;
    }
    if (count === 0) {
        document.getElementById("avg-result").innerHTML = "<p style='color:red'>Please enter at least one semester's SGPA and credit hours.</p>";
        return;
    }

    let cgpa = (totalPts / totalCr).toFixed(2);
    document.getElementById("avg-result").innerHTML = `<h3>CGPA: ${cgpa}</h3><p>From ${count} semester(s), ${totalCr} credit hours</p>`;
    saveToHistory(`CGPA: ${cgpa}`, `${count} Sems, ${totalCr} Credits`);
}

// --- HISTORY ---
// No argument toggles; true/false forces open/closed
function toggleHistory(open) {
    let panel = document.getElementById("historyPanel");
    let show = typeof open === "boolean" ? open : panel.classList.contains("hidden");
    panel.classList.toggle("hidden", !show);
    document.getElementById("historyBackdrop").classList.toggle("hidden", !show);
}
function saveToHistory(title, detail) {
    let hist = JSON.parse(localStorage.getItem("imsHistory")) || [];
    hist.unshift({ title, detail, time: new Date().toLocaleTimeString() });
    if(hist.length > 10) hist.pop();
    localStorage.setItem("imsHistory", JSON.stringify(hist));
    loadHistory();
}
function loadHistory() {
    let hist = JSON.parse(localStorage.getItem("imsHistory")) || [];
    let list = document.getElementById("historyList");
    list.innerHTML = "";
    if (hist.length === 0) {
        let empty = document.createElement("li");
        empty.className = "history-empty";
        empty.textContent = "No saved calculations yet.";
        list.appendChild(empty);
        return;
    }
    hist.forEach(h => {
        // Built with textContent so saved text is never run as HTML
        let li = document.createElement("li");
        li.className = "history-item";
        let title = document.createElement("strong");
        title.textContent = h.title;
        let detail = document.createElement("small");
        detail.textContent = `${h.detail} @ ${h.time}`;
        li.append(title, document.createElement("br"), detail);
        list.appendChild(li);
    });
}
function clearHistory() { localStorage.removeItem("imsHistory"); loadHistory(); }