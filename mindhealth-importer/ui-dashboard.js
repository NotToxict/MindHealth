// ui-dashboard.js

// Guardamos las instancias de los gráficos para poder actualizarlos o destruirlos.
let statesChart, condicionesChart, generoChart, trendChart, menMethodsChart, womenMethodsChart, genderDistributionChart;

/**
 * Función principal que inicializa todos los componentes del dashboard.
 * @param {object} stats - El objeto completo de estadísticas desde Firestore.
 */
export function initDashboard(stats) {
    console.log("initDashboard llamado con stats:", stats); // DEBUG: Verifica el objeto stats completo
    if (!stats) {
        console.error("ERROR: No se recibieron datos para inicializar el dashboard. (Desde ui-dashboard.js)"); // DEBUG: Error si stats es nulo
        return;
    }
    
    // Llamamos a una función para cada componente del dashboard.
    populateInfoCards(stats);
    
    if (stats.attended_services_ss_2024?.breakdown_by_condition) {
        createCondicionesChart(stats.attended_services_ss_2024.breakdown_by_condition);
        createGenderDistributionChart(stats.attended_services_ss_2024.breakdown_by_condition);
    } else {
        console.warn("ADVERTENCIA: Datos de 'attended_services_ss_2024.breakdown_by_condition' no encontrados.");
    }

    if (stats.mortality_data?.suicide_inegi_2023?.gender_rate_per_100k) {
        createGeneroChart(stats.mortality_data.suicide_inegi_2023.gender_rate_per_100k);
    } else {
        console.warn("ADVERTENCIA: Datos de 'mortality_data.suicide_inegi_2023.gender_rate_per_100k' no encontrados.");
    }

    // Punto clave para el gráfico de tendencia de suicidio
    if (stats.mortality_data?.suicide_trend_2013_2023?.data_by_year) {
        console.log("Datos para el gráfico de tendencia de suicidio encontrados:", stats.mortality_data.suicide_trend_2013_2023.data_by_year); // DEBUG: Confirma que los datos están presentes
        createTrendChart(stats.mortality_data.suicide_trend_2013_2023.data_by_year);
    } else {
        console.warn("ADVERTENCIA: Datos para el gráfico de tendencia de suicidio (mortality_data.suicide_trend_2013_2023.data_by_year) no encontrados o están vacíos."); // DEBUG: Alerta si los datos faltan
    }

    if (stats.mortality_data?.suicide_inegi_2023?.methods_by_gender) {
        createMethodsCharts(stats.mortality_data.suicide_inegi_2023.methods_by_gender);
    } else {
        console.warn("ADVERTENCIA: Datos de 'mortality_data.suicide_inegi_2023.methods_by_gender' no encontrados.");
    }
    if (stats.risk_factors_context_mexico) {
        populateRiskFactorsSection(stats.risk_factors_context_mexico);
    } else {
        console.warn("ADVERTENCIA: Datos de 'risk_factors_context_mexico' no encontrados.");
    }
}

// --- FUNCIONES PARA CADA COMPONENTE DEL DASHBOARD ---

/** 1. Rellena las 4 tarjetas de resumen (KPIs) con animación */
function populateInfoCards(stats) {
    const animateValue = (element, start, end, duration, suffix = '', decimals = 1) => {
        if (!element || isNaN(end)) { if(element) element.textContent = 'N/A'; return; }
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = progress * (end - start) + start;
            element.textContent = currentValue.toFixed(decimals) + suffix;
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    };
    
    // Verificaciones antes de animar, para asegurar que los elementos y datos existen
    const suicideRateElement = document.getElementById('suicide-rate-value');
    if (suicideRateElement && stats.mortality_data?.suicide_inegi_2023?.national_rate_per_100k !== undefined) {
        animateValue(suicideRateElement, 0, stats.mortality_data.suicide_inegi_2023.national_rate_per_100k, 1500, '', 1);
    } else if (suicideRateElement) {
        suicideRateElement.textContent = 'N/A';
    }

    const treatmentGapElement = document.getElementById('treatment-gap-value');
    const treatmentGapText = stats.healthcare_system?.treatment_gap;
    if (treatmentGapElement && treatmentGapText) {
        treatmentGapElement.textContent = treatmentGapText;
    } else if (treatmentGapElement) {
        treatmentGapElement.textContent = 'N/A';
    }

    const budgetElement = document.getElementById('budget-value');
    const budgetValue = parseFloat(stats.healthcare_system?.budget_as_percentage_of_health_spending);
    if (budgetElement && !isNaN(budgetValue)) {
        animateValue(budgetElement, 0, budgetValue, 1500, '%', 1);
    } else if (budgetElement) {
        budgetElement.textContent = 'N/A';
    }

    const specialistDensityElement = document.getElementById('specialist-density-value');
    const specialistDensityValue = stats.healthcare_system?.specialist_density_psychiatrists_per_10k;
    if (specialistDensityElement && specialistDensityValue !== undefined) {
        animateValue(specialistDensityElement, 0, specialistDensityValue, 1500, '', 2);
    } else if (specialistDensityElement) {
        specialistDensityElement.textContent = 'N/A';
    }
}


/** 2. Crea y maneja el gráfico de barras estatal interactivo (AHORA SERÁ EL MAPA ECHARTS) */
// La función createStateComparisonChart ya no será llamada por initDashboard
// y su lógica será reemplazada por initMexicoMap de ui-map.js.
function createStateComparisonChart(allStats) {
    const ctx = document.getElementById('statesChart')?.getContext('2d');
    if (!ctx) {
        console.warn("Elemento 'statesChart' no encontrado o no es un canvas. Asegúrate de que el ID del contenedor del mapa en index.html sea 'mexico-map-chart'.");
        return;
    }

    // Este código ya no se ejecutará si se comenta la llamada en initDashboard.
    // Se mantiene aquí como referencia de la antigua implementación de Chart.js si es necesario.
    const prepareChartData = (metric) => {
        let sourceData = [];
        let label = '';
        if (metric === 'suicide_rate') {
            sourceData = allStats.mortality_data.suicide_inegi_2023.by_state_highest_rates.concat(allStats.mortality_data.suicide_inegi_2023.by_state_lowest_rates);
            label = 'Tasa de Suicidio por 100,000 hab.';
        } else if (metric === 'avd_depression') {
            sourceData = allStats.disability_data_gbd_2021.by_state_avd_depression;
            label = 'AVD por Depresión';
        } else if (metric === 'avd_anxiety') {
            sourceData = allStats.disability_data_gbd_2021.by_state_avd_anxiety;
            label = 'AVD por Ansiedad';
        }
        sourceData.sort((a, b) => b.rate - a.rate);
        return {
            labels: sourceData.map(item => item.state),
            data: sourceData.map(item => item.rate),
            label: label
        };
    };
    
    drawStateChart('suicide_rate'); // Dibuja el gráfico inicial de barras si se llama
}

/** 3. Crea el gráfico de condiciones atendidas */
function createCondicionesChart(data) {
    const ctx = document.getElementById('condicionesAtendidasChart')?.getContext('2d');
    if (!ctx || !data) {
        console.warn("ADVERTENCIA: No se pudo dibujar condicionesAtendidasChart. Contexto o datos faltantes.");
        return;
    }
    if (condicionesChart) condicionesChart.destroy();
    condicionesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.condition),
            datasets: [{
                label: '% del Total de Atenciones',
                data: data.map(d => d.percentage),
                backgroundColor: 'rgba(37, 99, 235, 0.7)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 1, borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y', responsive: true, maintainAspectRatio: false,
            scales: { x: { beginAtZero: true }, y: { grid: { color: 'var(--border-color)' } } },
            plugins: { legend: { display: false } }
        }
    });
}

/** 4. Crea el gráfico de suicidio por género */
function createGeneroChart(data) {
    const ctx = document.getElementById('suicidioGeneroChart')?.getContext('2d');
    if (!ctx || !data) {
        console.warn("ADVERTENCIA: No se pudo dibujar suicidioGeneroChart. Contexto o datos faltantes.");
        return;
    }
    if (generoChart) generoChart.destroy();
    generoChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Hombres', 'Mujeres'],
            datasets: [{
                label: 'Tasa por 100,000 hab.',
                data: [data.men, data.women],
                backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(255, 99, 132, 0.7)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1, borderRadius: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 16 } },
            plugins: { legend: { display: false } }
        }
    });
}

/** 5. Crea el gráfico de tendencia de suicidio */
function createTrendChart(data) {
    console.log("createTrendChart función llamada."); // DEBUG: Se ha llamado a la función
    const ctx = document.getElementById('suicideTrendChart')?.getContext('2d');
    console.log("Contexto del Canvas (ctx):", ctx); // DEBUG: Verifica si ctx es válido (no null)
    console.log("Datos recibidos por createTrendChart:", data); // DEBUG: Verifica los datos que llegan aquí
    if (!ctx || !data) {
        console.error("ERROR: No se pudo obtener el contexto del canvas o los datos para el gráfico de tendencia de suicidio son nulos/vacíos. (Dentro de createTrendChart)"); // DEBUG: Mensaje de error más específico
        return;
    }
    if (trendChart) trendChart.destroy();
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.year),
            datasets: [{
                label: 'Tasa de Suicidio',
                data: data.map(d => d.rate),
                fill: true,
                backgroundColor: 'rgba(225, 29, 72, 0.1)',
                borderColor: 'rgba(225, 29, 72, 1)',
                tension: 0.3, pointBackgroundColor: 'rgba(225, 29, 72, 1)', pointRadius: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: false, suggestedMin: 4.5, grid: { color: 'var(--border-color)' } }, x: { grid: { display: false } } },
            plugins: { legend: { display: false } }
        }
    });
    console.log("Instancia de Chart.js creada para suicideTrendChart."); // DEBUG: Gráfico debería haberse inicializado
}

/** 6. Crea los gráficos de dona de métodos de suicidio */
function createMethodsCharts(data) {
    const menCtx = document.getElementById('menMethodsChart')?.getContext('2d');
    const womenCtx = document.getElementById('womenMethodsChart')?.getContext('2d');
    if (!menCtx || !womenCtx || !data) {
        console.warn("ADVERTENCIA: No se pudieron dibujar los gráficos de métodos. Contextos o datos faltantes.");
        return;
    }

    if (menMethodsChart) menMethodsChart.destroy();
    if (womenMethodsChart) womenMethodsChart.destroy();

    const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };

    menMethodsChart = new Chart(menCtx, {
        type: 'doughnut',
        data: {
            labels: data.men.map(d => d.method),
            datasets: [{ data: data.men.map(d => d.percentage), backgroundColor: ['#1e40af', '#3b82f6', '#93c5fd'] }]
        },
        options: options
    });

    womenMethodsChart = new Chart(womenCtx, {
        type: 'doughnut',
        data: {
            labels: data.women.map(d => d.method),
            datasets: [{ data: data.women.map(d => d.percentage), backgroundColor: ['#be123c', '#f43f5e', '#fda4af'] }]
        },
        options: options
    });
}

/** 7. Crea el gráfico de distribución de género por trastorno */
function createGenderDistributionChart(data) {
    const ctx = document.getElementById('genderDistributionChart')?.getContext('2d');
    if (!ctx || !data) {
        console.warn("ADVERTENCIA: No se pudo dibujar genderDistributionChart. Contexto o datos faltantes.");
        return;
    }
    if (genderDistributionChart) genderDistributionChart.destroy();
    const filteredData = data.filter(d => d.gender_dist);
    genderDistributionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: filteredData.map(d => d.condition),
            datasets: [
                { label: 'Hombres', data: filteredData.map(d => d.gender_dist.men), backgroundColor: 'rgba(54, 162, 235, 0.7)' },
                { label: 'Mujeres', data: filteredData.map(d => d.gender_dist.women), backgroundColor: 'rgba(255, 99, 132, 0.7)' }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, max: 100, stacked: true }, x: { stacked: true } },
            plugins: { legend: { position: 'top' } }
        }
    });
}

/** 8. Rellena las tarjetas de factores de riesgo */
function populateRiskFactorsSection(data) {
    const lists = {
        'socioeconomic-factors': data.socioeconomic,
        'contextual-factors': data.contextual,
        'cultural-factors': data.cultural
    };
    for (const id in lists) {
        const element = document.getElementById(id);
        if (element && lists[id]) {
            element.innerHTML = '';
            lists[id].forEach(factor => {
                const li = document.createElement('li');
                // Asegurarse de que el formato de la cadena es 'Título: Descripción'
                const parts = factor.split(':');
                if (parts.length > 1) {
                    li.innerHTML = `<strong>${parts[0]}:</strong>${parts.slice(1).join(':')}`;
                } else {
                    li.textContent = factor; // Si no hay ':' usar la cadena completa
                }
                element.appendChild(li);
            });
        } else if (element) {
            element.innerHTML = '<li>No hay datos disponibles.</li>';
        }
    }
}