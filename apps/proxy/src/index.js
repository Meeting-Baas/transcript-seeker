"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var path_1 = require("path");
// handle env variable parsing
var root;
var client;
var root = path_1.default.resolve(__dirname, "..", "..");
dotenv_1.default.config({
    path: path_1.default.resolve(root, ".env"),
});
var express_1 = require("express");
var utils_1 = require("./lib/utils");
var cors_1 = require("cors");
var app = (0, express_1.default)();
(0, utils_1.checkEnvironmentVariables)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.set("trust proxy", 1); // trust first proxy
app.use((0, cors_1.default)());
app.get("/health", function (_req, res) {
    return res.status(200).send("OK");
});
app.use(function (req, res) {
    res.sendFile(path_1.default.join(client, "index.html"));
});
// webhook setup
var PORT = process.env.PORT || 3080;
app.listen(PORT, function () {
    var url = "http://localhost:".concat(PORT);
    console.log("\n\n[server]: \uD83D\uDFE2\uD83D\uDFE2 Proxy is running at \u001B]8;;".concat(url, "\u001B\\").concat(url, "\u001B]8;;\u001B\\ \uD83D\uDFE2\uD83D\uDFE2"));
});
