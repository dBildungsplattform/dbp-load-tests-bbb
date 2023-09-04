const fs = require('fs');
//changes


/**
 * Only a function for calculating p90, p95, p99 values, if not using prom-client
 * @param {*} data 
 * @param {*} percentile 
 * @returns 
 */
function calculatePercentile(data, percentile) {
    const sortedData = data.sort((a, b) => a - b);
    console.log(sortedData);
    const index = Math.ceil((percentile / 100) * sortedData.length) - 1;
    return sortedData[index];
}

/**
 * The function is for reading and analyzing the jitter of all users in
 * this file. Could be expanded for other values also.
 * @param {*} metricsFilePath 
 * metricsFilePath is the JSON file. For testing purposes
 */

function analyzeMetrics(metricsFilePath) {
    fs.readFile('metrics.json', 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return;
        }
        const metricsData = JSON.parse(data);

        let totalJitter = 0;
        let jitterValues = [];

        for (const botName in metricsData) {
            const botMetrics = metricsData[botName];
            for (const entry of botMetrics) { 
                const jitter = parseFloat(entry.Jitter);
                totalJitter += jitter;
                jitterValues.push(jitter);
            }
        }
        const p90Jitter = calculatePercentile(jitterValues, 90);
        console.log("P90 Jitter:", p90Jitter, "ms");
    });

}

module.exports = analyzeMetrics;