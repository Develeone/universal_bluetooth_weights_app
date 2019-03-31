var express = require("express");
var app = express();

var path = require('path');
var appDir = path.dirname(require.main.filename);

app.get("/", (req, res, next) => {
    res.sendfile(appDir + '/index.html');
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});