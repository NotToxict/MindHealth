// ui-analysis.js

let conditionsChart;

export function initAnalysis(stats) {
    const data = stats.attended_services_ss_2024.breakdown_by_condition;
    const chartDom = document.getElementById('conditions-chart');
    if (!chartDom) return;

    conditionsChart = echarts.init(chartDom);

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: { type: 'value', boundaryGap: [0, 0.01] },
        yAxis: {
            type: 'category',
            data: data.map(d => d.condition).reverse() // Invertir para mostrar de mayor a menor
        },
        series: [{
            name: '% de Atenciones',
            type: 'bar',
            data: data.map(d => d.percentage).reverse(),
            itemStyle: { color: '#3b82f6' }
        }]
    };

    conditionsChart.setOption(option);
}