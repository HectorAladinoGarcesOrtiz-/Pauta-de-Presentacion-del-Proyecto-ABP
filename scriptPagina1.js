// Navegar de vuelta a la página index.html
function goBack() {
    window.location.href = "index.htm";
}

// Función para calcular los puntos totales basados en los inputs y actualizar los gráficos en porcentajes
function calculateTotal() {
    let total = 0;
    let indicators = [];

    for (let i = 1; i <= 10; i++) {
        const radios = document.getElementsByName(`indicator${i}`);
        for (const radio of radios) {
            if (radio.checked) {
                total += parseInt(radio.value);
                // Calcular el porcentaje para cada indicador (4 = 100%)
                let percentage = (parseInt(radio.value) / 4) * 100;
                indicators.push(percentage); // Guardar el porcentaje por indicador
                break;
            }
        }
    }

    document.getElementById('totalPoints').textContent = total;

    // Actualizar gráficos
    updateIndicatorChart(indicators);
    updateTotalChart(total);
}

// Crear gráfico de indicadores en porcentajes con Chart.js
const ctxIndicators = document.getElementById('indicatorsChart').getContext('2d');
let indicatorsChart = new Chart(ctxIndicators, {
    type: 'bar',
    data: {
        labels: ['Indicador 1', 'Indicador 2', 'Indicador 3', 'Indicador 4', 'Indicador 5', 'Indicador 6', 'Indicador 7', 'Indicador 8', 'Indicador 9', 'Indicador 10'],
        datasets: [{
            label: 'Porcentaje por Indicador',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Inicialmente 0%
            backgroundColor: '#4CAF50'
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 100, // Máximo 100% (4 puntos = 100%)
                ticks: {
                    callback: function(value) {
                        return value + '%'; // Mostrar en porcentaje
                    }
                }
            }
        }
    }
});

// Actualizar gráfico de indicadores
function updateIndicatorChart(indicators) {
    indicatorsChart.data.datasets[0].data = indicators;
    indicatorsChart.update();
}

// Crear gráfico total en porcentaje con Chart.js
const ctxTotal = document.getElementById('totalChart').getContext('2d');
let totalChart = new Chart(ctxTotal, {
    type: 'doughnut',
    data: {
        labels: ['Puntos Obtenidos', 'Puntos Faltantes'],
        datasets: [{
            label: 'Porcentaje Total',
            data: [0, 100], // Inicialmente 0% obtenido, 100% faltante
            backgroundColor: ['#2196F3', '#EEEEEE']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.label + ': ' + context.raw + '%';
                    }
                }
            }
        }
    }
});

// Actualizar gráfico de puntos totales en porcentaje
function updateTotalChart(total) {
    let percentageObtained = (total / 40) * 100; // 40 puntos es el máximo
    totalChart.data.datasets[0].data = [percentageObtained, 100 - percentageObtained];
    totalChart.update();
}

// Función para generar el PDF con gráficos
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Añadir contenido al PDF
    doc.setFontSize(16);
    doc.text("Pauta de Evaluación Exposición Grupal ABP", 10, 10);
    doc.setFontSize(12);

    let teamName = document.getElementById("teamName").value;
    let students = document.getElementById("students").value;
    doc.text(`Nombre del equipo: ${teamName}`, 10, 30);
    doc.text("Estudiantes:", 10, 40);
    doc.text(students, 10, 50);
    
    let points = document.getElementById('totalPoints').textContent;
    doc.text(`Puntos Totales del equipo: ${points}`, 10, 85);
    
    // Añadir observaciones
    let observations = document.getElementById('observations').value;
    doc.text(`Observaciones: ${observations}`, 10, 95);

    // Añadir gráficos al PDF
    let indicatorsImage = document.getElementById('indicatorsChart').toDataURL('image/png');
    doc.addImage(indicatorsImage, 'PNG', 10, 100, 180, 80);

    let totalImage = document.getElementById('totalChart').toDataURL('image/png');
    doc.addImage(totalImage, 'PNG', 10, 200, 180, 80);

    // Guardar el PDF
    doc.save('evaluacion_grupal_ABP.pdf');
}
