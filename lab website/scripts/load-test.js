/**
 * ⚡ Nexus Genomics Institute - Performance & Load Audit
 * ----------------------------------------------------
 * Measures response times for key API endpoints and estimates 
 * the capacity based on current architecture.
 */

const http = require('http');

const ENDPOINTS = [
    '/',
    '/api/admin-data?type=sessions',
    '/api/admin-data?type=research',
    '/api/search?q=genomics'
];

const BASE_URL = 'http://localhost:3000';

async function measureEndpoint(path) {
    const start = Date.now();
    return new Promise((resolve) => {
        http.get(BASE_URL + path, (res) => {
            res.on('data', () => {});
            res.on('end', () => {
                resolve({
                    path,
                    status: res.statusCode,
                    time: Date.now() - start
                });
            });
        }).on('error', (err) => {
            resolve({ path, status: 'ERROR', time: 0, error: err.message });
        });
    });
}

async function runAudit() {
    console.log("📊 Starting Performance Audit...");
    console.log("---------------------------------");

    const results = [];
    for (const path of ENDPOINTS) {
        // Run 5 trials for each to get average
        let totalTime = 0;
        let success = true;
        for (let i = 0; i < 5; i++) {
            const res = await measureEndpoint(path);
            if (res.status !== 200) success = false;
            totalTime += res.time;
        }
        results.push({ path, avgTime: (totalTime / 5).toFixed(2), success });
    }

    console.table(results);

    const avgLatency = results.reduce((acc, r) => acc + parseFloat(r.avgTime), 0) / results.length;
    
    console.log("---------------------------------");
    console.log(`🚀 Overall Performance Stats:`);
    console.log(`- Average Latency: ${avgLatency.toFixed(2)}ms`);
    
    // Simple throughput estimate (Vertical scaling baseline)
    // Assuming Node.js single-threaded event loop can handle ~1000 requests/sec if latency is low
    const estRps = (1000 / avgLatency).toFixed(0);
    console.log(`- Estimated Single-Core Throughput: ~${estRps} req/sec`);
    console.log(`- Estimated Concurrent User Capacity: ~${(estRps * 10).toFixed(0)} (based on 1req/10sec behavior)`);
    console.log("---------------------------------");
}

runAudit();
