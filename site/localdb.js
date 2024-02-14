const fs = require('fs');
const path = require('path');
const loggerpath = path.join(__dirname, '../loggers.json');


const badObject = new Error("Bad Object passed to the db");

function addLogger(logger) {
    validateLogger(logger);
    const pastObjects = getLogger();
    const loggerIndex = pastObjects.findIndex(user => user.id === logger.id);
    if(loggerIndex ==-1){
        console.log(logger);
        pastObjects.push(logger);
        saveLogger(pastObjects)
    }else{
        return
    }
}

function deserialize(data) {
    return JSON.parse(data);
}

function serialize(data) {
    return JSON.stringify(data)
}

function getLogger() {
    const data = fs.readFileSync(loggerpath, 'utf8');
    return deserialize(data);
}

function saveLogger(loggers) {
    console.log(loggers);
    fs.writeFileSync(loggerpath, serialize(loggers));
}

function removeLogger(loggerId) {
    const pastObjects = getLogger();
    const newObjects = pastObjects.filter(obj => obj.id !== loggerId);

    saveLogger(newObjects);
}

function editLogger(logger){
    validateLogger(logger);
    const pastObjects = getLogger();
    const loggerIndex = pastObjects.findIndex(user => user.id === logger.id);
    if (loggerIndex !== -1) {
        pastObjects[loggerIndex] = logger;
        saveLogger(pastObjects);
        return true; // Return true indicating successful edit
    }
}

function validateLogger(obj) {
    if (obj && typeof obj === 'object' && 'id' in obj && 'cookie' in obj && 'mail' in obj && 'days' in obj) {
            return;
    }
    throw badObject;
}
function setupDb() {
    fs.writeFileSync(loggerpath, '[]');
}


module.exports = {
    addLogger,
    getLogger,
    removeLogger,
    editLogger,
    setupDb,
};