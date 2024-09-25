// Función para volver a la página principal
function goBack() {
    window.location.href = "index.htm";
}

// Función para calcular puntajes y mostrar las notas
function calculateScores() {
    const numIntegrantes = 6;
    for (let i = 1; i <= numIntegrantes; i++) {
        const A = parseInt(document.getElementsByName(`A${i}`)[0].value) || 0;
        const B = parseInt(document.getElementsByName(`B${i}`)[0].value) || 0;
        const C = parseInt(document.getElementsByName(`C${i}`)[0].value) || 0;
        const D = parseInt(document.getElementsByName(`D${i}`)[0].value) || 0;
        const E = parseInt(document.getElementsByName(`E${i}`)[0].value) || 0;
        const F = parseInt(document.getElementsByName(`F${i}`)[0].value) || 0;

        const total = A + B + C + D + E + F;
        document.getElementById(`total${i}`).innerText = total;

        const grade = calculateGrade(total);
        document.getElementById(`grade${i}`).innerText = grade.toFixed(2);

        // Calcular porcentajes para cada categoría (valor 4 = 100%)
        const percentA = (A / 4) * 100;
        const percentB = (B / 4) * 100;
        const percentC = (C / 4) * 100;
        const percentD = (D / 4) * 100;
        const percentE = (E / 4) * 100;
        const percentF = (F / 4) * 100;

        generateCharts(i, percentA, percentB, percentC, percentD, percentE, percentF);
    }
    generatePieChart();
}

// Fórmula para calcular la nota
function calculateGrade(p) {
    const n_max = 7.0;
    const n_min = 2.6;
    const n_apr = 4.0;
    const e = 0.6;
    const p_max = 24.0;

    if (p < e * p_max) {
        return ((n_apr - n_min) * p / (e * p_max)) + n_min;
    } else {
        return ((n_max - n_apr) * (p - (e * p_max)) / (p_max * (1 - e))) + n_apr;
    }
}

// Crear gráficos de barras en porcentajes para cada integrante
function generateCharts(i, A, B, C, D, E, F) {
    const container = document.getElementById('chartsContainer');
    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = `chart${i}`;
    container.appendChild(chartCanvas);

    new Chart(chartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['A', 'B', 'C', 'D', 'E', 'F'],
            datasets: [{
                label: `Evaluación del Integrante ${i} (Porcentaje)`,
                data: [A, B, C, D, E, F],
                backgroundColor: ['#4CAF50', '#FFC107', '#2196F3', '#FF5733', '#33FF57', '#8A33FF']
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%'; // Mostrar porcentaje en el eje Y
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.raw + '%'; // Mostrar porcentaje en el tooltip
                        }
                    }
                }
            }
        }
    });
}

// Crear gráfico de torta en porcentajes para totales
function generatePieChart() {
    const container = document.getElementById('chartsContainer');
    const pieCanvas = document.createElement('canvas');
    pieCanvas.id = 'pieChart';
    container.appendChild(pieCanvas);

    const totalA = sumScores('A');
    const totalB = sumScores('B');
    const totalC = sumScores('C');
    const totalD = sumScores('D');
    const totalE = sumScores('E');
    const totalF = sumScores('F');

    // Calcular porcentajes para cada categoría (24 = 100%)
    const percentTotalA = (totalA / 24) * 100;
    const percentTotalB = (totalB / 24) * 100;
    const percentTotalC = (totalC / 24) * 100;
    const percentTotalD = (totalD / 24) * 100;
    const percentTotalE = (totalE / 24) * 100;
    const percentTotalF = (totalF / 24) * 100;

    new Chart(pieCanvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: ['A', 'B', 'C', 'D', 'E', 'F'],
            datasets: [{
                label: 'Totales (Porcentaje)',
                data: [percentTotalA, percentTotalB, percentTotalC, percentTotalD, percentTotalE, percentTotalF],
                backgroundColor: ['#4CAF50', '#FFC107', '#2196F3', '#FF5733', '#33FF57', '#8A33FF']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.raw.toFixed(2) + '%'; // Mostrar porcentaje en el tooltip
                        }
                    }
                }
            }
        }
    });
}

// Sumar las puntuaciones de cada categoría
function sumScores(category) {
    let sum = 0;
    for (let i = 1; i <= 6; i++) {
        sum += parseInt(document.getElementsByName(`${category}${i}`)[0].value) || 0;
    }
    return sum;
}

// Función para generar el PDF en varias páginas A4 con porcentajes
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let teamName = document.getElementById("teamName").value;
    doc.setFontSize(16);
    doc.text(`Nombre del equipo: ${teamName}`, 10, 10);

    for (let i = 1; i <= 6; i++) {
        let memberName = document.getElementsByName(`teamMember${i}`)[0].value;
        let total = document.getElementById(`total${i}`).innerText;
        let grade = document.getElementById(`grade${i}`).innerText;

        // Nueva página para cada integrante
        if (i > 1) doc.addPage();

        doc.setFontSize(14);
        doc.text(`Integrante ${i}: ${memberName}`, 10, 20);
        doc.text(`Puntaje Total: ${total}`, 10, 30);
        doc.text(`Nota: ${grade}`, 10, 40);

        let chartCanvas = document.getElementById(`chart${i}`);
        let chartImage = chartCanvas.toDataURL('image/png');
        doc.addImage(chartImage, 'PNG', 10, 50, 180, 100);
        doc.setFontSize(16);
        doc.text('Gráfico de Totales por Categoría del Equipo (Porcentaje)', 10, 160);
        let pieChartCanvas = document.getElementById('pieChart');
        let pieChartImage = pieChartCanvas.toDataURL('image/png');
        doc.addImage(pieChartImage, 'PNG', 10, 170, 180, 100);
    }
    doc.save('evaluacion_abp.pdf');
}
