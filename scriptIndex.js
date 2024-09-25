// Función para navegar a las otras páginas 
function goToPage1() {
    window.location.href = "Pagina1.html";
}

function goToPage2() {
    window.location.href = "Pagina2.html";
}

function goToPage3() {
    window.location.href = "Pagina3.html";
}

// Función para calcular la nota basada en el puntaje
function calculateGrade(p) {
    const n_max = 7.0;
    const n_min = 2.6;
    const n_apr = 4.0;
    const e = 0.6;
    const p_max = 40.0;

    if (p < e * p_max) {
        return ((n_apr - n_min) * p / (e * p_max)) + n_min;
    } else {
        return ((n_max - n_apr) * (p - (e * p_max)) / (p_max * (1 - e))) + n_apr;
    }
}

// Función para calcular los resultados y actualizar los gráficos
function calculateResults() {
    const score = parseFloat(document.getElementById("score").value) || 0;
    const idealScore = 40;
    const passingScore = 23;

    const grade = calculateGrade(score);
    document.getElementById("calculatedGrade").innerText = grade.toFixed(2);

    // Actualizar gráfico con porcentajes
    const percentageIdeal = (idealScore / idealScore) * 100;
    const percentagePassing = (passingScore / idealScore) * 100;
    const percentageObtained = (score / idealScore) * 100;

    updateChart(percentageIdeal, percentagePassing, percentageObtained);
}

// Función para generar el gráfico
function updateChart(ideal, passing, obtained) {
    const ctx = document.getElementById('resultChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Puntaje Ideal', 'Puntaje Aprobación', 'Puntaje Obtenido'],
            datasets: [{
                label: 'Porcentaje',
                data: [ideal, passing, obtained],
                backgroundColor: ['#4CAF50', '#FFC107', '#2196F3']
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) { return value + '%' }
                    }
                }
            }
        }
    });

    return chart;
}

// Función para generar el PDF con los datos y gráficos
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let teamName = document.getElementById("teamName").value;
    let students = document.getElementById("students").value;
    let score = document.getElementById("score").value;
    let grade = calculateGrade(parseFloat(score)).toFixed(2);

    // Añadir el texto al PDF
    doc.setFontSize(16);
    doc.text(`Nombre del equipo: ${teamName}`, 10, 10);
    
    // Añadir los nombres de los estudiantes en vertical
    doc.text("Integrantes del equipo:", 10, 20);
    let studentsList = students.split("\n"); // Separar los nombres por salto de línea
    let yPosition = 30;
    studentsList.forEach(student => {
        doc.text(student, 10, yPosition);
        yPosition += 10; // Mover hacia abajo en el PDF
    });

    // Añadir puntaje y nota
    doc.text(`Puntaje Obtenido: ${score}`, 10, yPosition + 10);
    doc.text(`Nota del Equipo: ${grade}`, 10, yPosition + 20);

    // Convertir el gráfico a imagen y añadirlo al PDF
    const canvas = document.getElementById("resultChart");
    const imgData = canvas.toDataURL("image/png");
    doc.addImage(imgData, 'PNG', 10, yPosition + 30, 180, 100); // Posición y tamaño del gráfico en el PDF

    // Guardar el PDF
    doc.save('evaluacion_abp.pdf');
}
