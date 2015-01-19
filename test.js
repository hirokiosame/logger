var Logger = require("./index.js");

var log = new Logger("./test.log");

log.info("Hello?", { "1": "2" });