// Include the cluster module
var cluster = require('cluster'),
// Include Express
    express = require('express');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs. Used to spawn processes based on processors length
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers. Used to recreate workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker, we're not sentimental
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });

// Code to run if we're in a worker process
} else {

    
    // Create a new Express application
    var app = express();

    // Add a basic route – index page
    app.get('/', function (req, res) {
        console.log("worker responding for this request is : "+cluster.worker.id);
        res.send('Worker ' + cluster.worker.id+ " says hello world ;\)");
    });

    // Bind to a port
    app.listen(3000);
    console.log('Worker ' + cluster.worker.id + ' running!');

}