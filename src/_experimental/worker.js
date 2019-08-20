
setTimeout((params) => {
    postMessage("Worker's work done.");    
    close();
}, 1000);
