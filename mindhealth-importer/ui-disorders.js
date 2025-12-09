// ==========================================================================
// Módulo: UI - Trastornos (ui-disorders.js)
// ==========================================================================

let prevalenceChartInstance;

export function populateDisorderSelector(disorders) {
    const select = document.getElementById('disorder-select');
    if (!select) return;
    select.innerHTML = '';
    disorders.forEach(disorder => {
        const option = document.createElement('option');
        option.value = disorder.id;
        option.textContent = disorder.name;
        select.appendChild(option);
    });
}

export function updateDisorderInfo(disorder) {
    if (!disorder) return;

    const elements = {
        title: document.getElementById('disorder-title'),
        description: document.getElementById('disorder-description'),
        summary: document.getElementById('diagnostic-summary'),
        symptomsList: document.getElementById('diagnostic-symptoms'),
        facialSummary: document.getElementById('facial-summary'),
        ausContainer: document.getElementById('facial-aus'),
        riskCardsContainer: document.getElementById('risk-cards')
    };

    elements.title.textContent = disorder.name || 'N/A';
    elements.description.textContent = disorder.description_short || 'No hay descripción disponible.';
    elements.summary.textContent = disorder.diagnostic_criteria_dsm5?.summary || '';
    
    elements.symptomsList.innerHTML = '';
    if (disorder.diagnostic_criteria_dsm5?.symptoms) {
        disorder.diagnostic_criteria_dsm5.symptoms.forEach(symptom => {
            const li = document.createElement('li');
            li.textContent = symptom;
            elements.symptomsList.appendChild(li);
        });
    }

    elements.facialSummary.textContent = disorder.facial_correlates?.summary || 'No hay información disponible.';
    if (disorder.facial_correlates?.associated_aus) {
        elements.ausContainer.innerHTML = `
            <p><strong class="font-semibold text-sky-700 dark:text-sky-400">AUs con Actividad Aumentada:</strong> ${disorder.facial_correlates.associated_aus.increased_activity.join(', ') || 'Ninguna'}</p>
            <p><strong class="font-semibold text-amber-700 dark:text-amber-400">AUs con Actividad Disminuida:</strong> ${disorder.facial_correlates.associated_aus.decreased_activity.join(', ') || 'Ninguna'}</p>
        `;
    }
    
    elements.riskCardsContainer.innerHTML = '';
    const risks = disorder.associated_risks;
    if (risks) {
        const riskData = [
            { icon: 'fa-user-minus', label: 'Reducción de Esperanza de Vida', value: risks.life_expectancy_reduction_years_range || 'N/A', unit: 'años' },
            { icon: 'fa-heart-pulse', label: 'Riesgo de Suicidio', value: risks.suicide_risk_level || 'N/A' },
            { icon: 'fa-wheelchair', label: 'Ranking de Discapacidad', value: risks.disability_global_rank_2019 || 'N/A' }
        ];
        
        riskData.forEach(item => {
            const cardHtml = `
                <div class="flex items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                    <i class="fas ${item.icon} text-primary text-xl w-8 text-center"></i>
                    <div class="ml-3">
                        <p class="font-semibold text-slate-700 dark:text-slate-200">${item.label}</p>
                        <p class="text-slate-500 dark:text-slate-400">${item.value} ${item.unit || ''}</p>
                    </div>
                </div>
            `;
            elements.riskCardsContainer.innerHTML += cardHtml;
        });
    }

    updatePrevalenceChart(disorder.prevalence_data?.global);
}

function updatePrevalenceChart(data) {
    const ctx = document.getElementById('prevalenceChart')?.getContext('2d');
    if (!ctx || !data) return;
    if (prevalenceChartInstance) prevalenceChartInstance.destroy();

    const labels = [];
    const chartData = [];
    if (data.total_affected_2019_millions && data.children_adolescents_affected_2019_millions) {
        labels.push('Adultos Afectados (millones)');
        chartData.push(data.total_affected_2019_millions - data.children_adolescents_affected_2019_millions);
        labels.push('Niños/Adolescentes (millones)');
        chartData.push(data.children_adolescents_affected_2019_millions);
    } else if (data.total_affected_millions) {
        labels.push('Población Afectada (millones)');
        chartData.push(data.total_affected_millions);
    }

    prevalenceChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{ data: chartData, backgroundColor: ['#2563eb', '#f59e0b'], borderColor: 'var(--color-surface)', borderWidth: 4 }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: true, position: 'bottom', labels: { color: 'var(--color-text-secondary)' } } }
        }
    });
}