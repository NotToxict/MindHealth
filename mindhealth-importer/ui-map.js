// ui-map.js
// ESTE MÓDULO CONTROLA EL MAPA INTERACTIVO DE MÉXICO CON ECHARTS
// Utiliza mexico.json (que debe ser el contenido de mexicoHigh.json) para las geometrías de los estados
// y los datos completos de statistics.json para colorear el mapa.

let mexicoMapChart = null; // Instancia del gráfico de ECharts
let allStatsData = null; // Para guardar todos los datos de estadísticas cargados desde Firestore
let mexicoGeoJson = null; // Para cargar y almacenar el GeoJSON de los estados de México

// Objeto de mapeo de nombres de estados.
// La CLAVE es el nombre del estado TAL CUAL aparece en la propiedad "name" de tu mexico.json (GeoJSON).
// El VALOR es el nombre del estado TAL CUAL aparece en tu statistics.json (Firestore data).
// Solo se necesitan entradas aquí si los nombres difieren entre el GeoJSON y tus datos.
// Si los nombres son idénticos (ej. "Aguascalientes" en ambos), no necesitas una entrada explícita.
const stateNameMapping = {
    // Estas claves deben coincidir EXACTAMENTE con la propiedad "name" de las features en tu mexico.json
    "Aguascalientes": "Aguascalientes", 
    "Baja California": "Baja California",
    "Baja California Sur": "Baja California Sur",
    "Campeche": "Campeche",
    "Coahuila de Zaragoza": "Coahuila", // Si tu GeoJSON tiene "Coahuila de Zaragoza" pero tus datos "Coahuila"
    "Colima": "Colima",
    "Chiapas": "Chiapas",
    "Chihuahua": "Chihuahua",
    "Ciudad de México": "Ciudad de México",
    "Durango": "Durango",
    "Guanajuato": "Guanajuato",
    "Guerrero": "Guerrero",
    "Hidalgo": "Hidalgo",
    "Jalisco": "Jalisco",
    "México": "Estado de México", // Si tu GeoJSON tiene "México" para el Estado de México
    "Michoacán de Ocampo": "Michoacán", // Si tu GeoJSON tiene "Michoacán de Ocampo" pero tus datos "Michoacán"
    "Morelos": "Morelos",
    "Nayarit": "Nayarit",
    "Nuevo León": "Nuevo León",
    "Oaxaca": "Oaxaca",
    "Puebla": "Puebla",
    "Querétaro": "Querétaro",
    "Quintana Roo": "Quintana Roo",
    "San Luis Potosí": "San Luis Potosí",
    "Sinaloa": "Sinaloa",
    "Sonora": "Sonora",
    "Tabasco": "Tabasco",
    "Tamaulipas": "Tamaulipas",
    "Tlaxcala": "Tlaxcala",
    "Veracruz de Ignacio de la Llave": "Veracruz", // Si tu GeoJSON tiene el nombre completo
    "Yucatán": "Yucatán",
    "Zacatecas": "Zacatecas"
    // Asegúrate de que este mapeo sea preciso para tu GeoJSON y tus datos.
};

/**
 * Carga el archivo GeoJSON de los estados de México desde la ruta local.
 * Este GeoJSON es necesario para que ECharts pueda dibujar las fronteras de los estados.
 * @returns {Promise<Object>} Una promesa que se resuelve con el objeto GeoJSON o null si falla.
 */
async function loadMexicoGeoJson() {
    if (!mexicoGeoJson) {
        try {
            // Asegúrate de que esta ruta apunte a tu archivo mexico.json (que debe contener el GeoJSON de estados)
            const response = await fetch('./data/geojson/mexico.json'); 
            mexicoGeoJson = await response.json();
            console.log("GeoJSON de México cargado.");
        } catch (error) {
            console.error("Error cargando GeoJSON del mapa:", error);
            // Muestra un mensaje en la interfaz de usuario si el GeoJSON no se puede cargar
            const chartDom = document.getElementById('mexico-map-chart');
            if (chartDom) chartDom.innerHTML = '<p style="text-align: center; color: red;">Error al cargar el mapa. Verifica la ruta y el nombre del archivo GeoJSON.</p>';
            return null;
        }
    }
    return mexicoGeoJson;
}

/**
 * Prepara los datos para ser visualizados en el mapa de ECharts,
 * uniendo los datos estadísticos con los nombres de los estados del GeoJSON.
 * @param {string} metric - La métrica seleccionada (ej. 'suicide_rate', 'avd_depression').
 * @returns {object} Un objeto que contiene los datos del mapa, la etiqueta, la fuente y los valores min/max para el visualMap.
 */
function prepareMapData(metric) {
    let sourceData = [];
    let label = '';
    let source = ''; // Para mostrar la fuente de los datos en el tooltip
    
    // Selecciona los datos correctos del objeto allStatsData basado en la métrica
    if (metric === 'suicide_rate' && allStatsData.mortality_data?.suicide_inegi_2023) {
        sourceData = allStatsData.mortality_data.suicide_inegi_2023.by_state_all_rates;
        label = 'Tasa de Suicidio por 100,000 hab.';
        source = 'INEGI (2023)';
    } else if (metric === 'avd_depression' && allStatsData.disability_data_gbd_2021) {
        sourceData = allStatsData.disability_data_gbd_2021.by_state_avd_depression;
        label = 'AVD por Depresión';
        source = 'GBD 2021 (Aproximado)';
    } else if (metric === 'avd_anxiety' && allStatsData.disability_data_gbd_2021) {
        sourceData = allStatsData.disability_data_gbd_2021.by_state_avd_anxiety;
        label = 'AVD por Ansiedad';
        source = 'GBD 2021 (Aproximado)';
    }

    const mapChartData = [];
    // Obtiene todos los nombres de los estados del GeoJSON cargado
    const allStatesInGeoJson = mexicoGeoJson?.features.map(f => f.properties.name) || [];
    
    // Itera sobre todos los estados del GeoJSON para asegurar que todos se incluyan en el mapa
    allStatesInGeoJson.forEach(geoJsonName => {
        // Busca el nombre del estado en statistics.json que corresponde a este nombre del GeoJSON.
        // Utiliza el stateNameMapping si el nombre del GeoJSON es diferente al de statistics.json.
        let stateInStatsName = geoJsonName; 
        // Si el nombre del GeoJSON está en las claves de nuestro mapeo, usa el valor mapeado
        if (stateNameMapping[geoJsonName]) {
            stateInStatsName = stateNameMapping[geoJsonName];
        }
        
        // Buscar el dato correspondiente en la fuente de datos (ej. by_state_all_rates)
        const dataItem = sourceData.find(item => item.state === stateInStatsName);
        
        if (dataItem && typeof dataItem.rate === 'number') { 
            // Si se encuentra un dato numérico, lo añade al mapa
            mapChartData.push({
                name: geoJsonName, // Nombre del estado tal cual en el GeoJSON
                value: dataItem.rate, // Valor numérico para colorear el mapa
                sourceNote: dataItem.note || '', // Nota adicional si existe (ej. "Dato aproximado de Figura 5")
                itemStyle: { areaColor: undefined } // Permite que visualMap determine el color
            });
        } else { 
            // Si no hay un dato numérico para este estado en la fuente seleccionada,
            // lo añade con un valor nulo y un mensaje de "Datos no emitidos".
            mapChartData.push({
                name: geoJsonName, 
                value: null, // Valor nulo para que no se coloree por el visualMap
                sourceNote: '', // No hay nota específica
                itemStyle: { areaColor: '#e0e0e0' } // Color gris claro para estados sin datos
            });
        }
    });

    // Calcula los valores mínimo y máximo para la leyenda de colores (visualMap).
    // Solo considera los valores numéricos para este cálculo.
    const valuesForVisualMap = mapChartData
        .filter(d => typeof d.value === 'number') 
        .map(d => d.value);

    const minVal = valuesForVisualMap.length > 0 ? Math.min(...valuesForVisualMap) : 0;
    const maxVal = valuesForVisualMap.length > 0 ? Math.max(...valuesForVisualMap) : 100;

    return {
        mapChartData,
        label,
        source, 
        minVal: minVal, 
        maxVal: maxVal 
    };
}

/**
 * Dibuja o actualiza el mapa de México utilizando ECharts.
 * @param {string} metric - La métrica actual a visualizar en el mapa.
 */
async function drawMexicoMap(metric) {
    const chartDom = document.getElementById('mexico-map-chart');
    if (!chartDom) {
        console.error("Contenedor del mapa (mexico-map-chart) no encontrado.");
        return;
    }

    const geoJson = await loadMexicoGeoJson();
    if (!geoJson) return;

    // Limpiar la instancia anterior del gráfico si existe para evitar duplicados
    if (mexicoMapChart) {
        echarts.dispose(mexicoMapChart); 
    }
    mexicoMapChart = echarts.init(chartDom); // Inicializa una nueva instancia del gráfico

    // Registra el GeoJSON con ECharts.
    // 'Mexico' es el nombre que le damos a este mapa para referenciarlo en las series.
    // 'nameProperty: "name"' le dice a ECharts que la propiedad 'name' de cada 'feature'
    // en tu GeoJSON contiene el nombre del estado que debe usar para el mapeo de datos.
    echarts.registerMap('Mexico', geoJson, {
        nameProperty: 'name' 
    });

    // Prepara los datos específicos para la métrica seleccionada
    const { mapChartData, label, source, minVal, maxVal } = prepareMapData(metric);

    // Configuración de las opciones del gráfico de ECharts
    const option = {
        title: {
            text: 'Mapa de México - ' + label,
            left: 'center',
            textStyle: { color: 'var(--text-dark)' }
        },
        tooltip: {
            trigger: 'item', // El tooltip se activa al pasar el ratón sobre un elemento del mapa
            formatter: function (params) {
                // params.name es el nombre del estado (del GeoJSON)
                const dataItem = params.data; // Accede al objeto de datos completo para el estado
                if (typeof dataItem.value === 'number') { // Si hay un valor numérico para este estado
                    let tooltipText = `${params.name}<br/>${label}: <b>${dataItem.value.toFixed(1)}</b>`;
                    if (dataItem.sourceNote) {
                        tooltipText += `<br/>${dataItem.sourceNote}`; // Añade la nota si existe
                    }
                    tooltipText += `<br/>(Fuente: ${source})`; // Añade la fuente de los datos
                    return tooltipText;
                } else { 
                    // Si no hay valor numérico, muestra el mensaje de "Datos no emitidos"
                    return `${params.name}<br/><b>Datos no emitidos por ${source.split(' ')[0]}</b>`; 
                }
            }
        },
        // Configuración de la leyenda visual (visualMap) para colorear el mapa.
        // Se muestra solo si la métrica actual es 'suicide_rate', 'avd_depression' o 'avd_anxiety'.
        visualMap: (metric === 'suicide_rate' || metric === 'avd_depression' || metric === 'avd_anxiety' ? { 
            min: minVal,
            max: maxVal,
            left: 'left',
            top: 'bottom',
            text: ['Alto', 'Bajo'], // Etiquetas para los extremos de la leyenda
            calculable: true, // Permite al usuario ajustar el rango de la leyenda
            inRange: {
                // Rango de colores para el mapa, del más bajo (claro) al más alto (oscuro)
                color: ['#e0f2f7', '#a7d9ed', '#4bbde2', '#1a9bdc', '#0d679f'] 
            },
            textStyle: { color: 'var(--text-medium)' }
        } : { 
            show: false // Oculta la leyenda visualMap si la métrica no es de las anteriores
        }),
        series: [
            {
                name: label, // Nombre de la serie (ej. "Tasa de Suicidio por 100,000 hab.")
                type: 'map', // Tipo de gráfico: mapa
                map: 'Mexico', // El nombre del mapa registrado con echarts.registerMap
                roam: true, // Permite al usuario hacer zoom y arrastrar el mapa
                zoom: 1.2, // Nivel de zoom inicial del mapa
                label: {
                    show: true, // Muestra los nombres de los estados en el mapa
                    color: '#333', // Color del texto de la etiqueta
                    fontSize: 9 // Tamaño de la fuente del texto de la etiqueta
                },
                itemStyle: {
                    // Estilo por defecto de las áreas de los estados
                    areaColor: '#f3f4f6', // Color de fondo por defecto si no hay datos específicos
                    borderColor: '#aaa', // Color del borde de los estados
                    borderWidth: 0.8 // Ancho del borde
                },
                emphasis: { // Estilo al pasar el ratón (hover) sobre un estado
                    itemStyle: {
                        areaColor: '#ffd700' // Color amarillo al hacer hover
                    },
                    label: {
                        show: true,
                        color: '#000' // Color del texto al hacer hover
                    }
                },
                data: mapChartData // Los datos preparados para el mapa
            }
        ]
    };

    mexicoMapChart.setOption(option); // Aplica las opciones al gráfico de ECharts
}

/**
 * Función principal exportada para inicializar el mapa en el dashboard.
 * @param {object} stats - El objeto completo de estadísticas cargado desde Firestore.
 */
export async function initMexicoMap(stats) {
    allStatsData = stats; // Guarda los datos de estadísticas globalmente

    // Carga el GeoJSON una sola vez al inicio si aún no se ha cargado
    if (!mexicoGeoJson) {
        mexicoGeoJson = await loadMexicoGeoJson();
    }
    
    // Dibuja el mapa inicial con la métrica de tasa de suicidio
    await drawMexicoMap('suicide_rate'); 

    // Configura los event listeners para los botones de selección de métrica
    document.querySelectorAll('#metric-selector .metric-button').forEach(button => {
        button.addEventListener('click', () => {
            // Elimina la clase 'active' del botón actualmente activo (mantiene ?. como pediste)
            document.querySelector('#metric-selector .metric-button.active')?.classList.remove('active');
            button.classList.add('active'); // Añade la clase 'active' al botón clickeado
            const metric = button.dataset.metric; // Obtiene la métrica del atributo data-metric
            drawMexicoMap(metric); // Redibuja el mapa con la nueva métrica
        });
    });
}

/**
 * Asegura que el mapa se redimensione correctamente cuando la ventana del navegador cambia de tamaño.
 */
window.addEventListener('resize', () => {
    if (mexicoMapChart) {
        mexicoMapChart.resize();
    }
});
