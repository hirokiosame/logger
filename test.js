var Logger = require("./index.js");

var log = new Logger("./test.log");


log.createType("stdout", "stderr");


log.info("Hello?", { "1": "2" });

log.stdout("stdout");
log.stderr("stderr");