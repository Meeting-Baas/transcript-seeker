"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinMeeting = joinMeeting;
exports.fetchBotDetails = fetchBotDetails;
// shared/src/api.ts
var axios_1 = require("axios");
var constants = require("./constants");
function joinMeeting(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var url, response, error_1;
        var _c, _d;
        var meetingBotName = _b.meetingBotName, meetingURL = _b.meetingURL, meetingBotImage = _b.meetingBotImage, meetingBotEntryMessage = _b.meetingBotEntryMessage, apiKey = _b.apiKey, proxyUrl = _b.proxyUrl;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 2, , 3]);
                    url = proxyUrl
                        ? "".concat(proxyUrl, "/bots")
                        : ((_c = process.env.MEETINGBASS_API_URL) !== null && _c !== void 0 ? _c : "https://api.meetingbaas.com") + "/bots";
                    return [4 /*yield*/, axios_1.default.post(url, {
                            meeting_url: meetingURL,
                            bot_name: meetingBotName || constants.DEFAULT_BOT_NAME,
                            entry_message: meetingBotEntryMessage || constants.DEFAULT_ENTRY_MESSAGE,
                            bot_image: meetingBotImage || constants.DEFAULT_BOT_IMAGE,
                            speech_to_text: "Gladia",
                            reserved: false,
                        }, {
                            headers: {
                                "x-spoke-api-key": apiKey,
                            },
                        })];
                case 1:
                    response = _e.sent();
                    console.log("New bot created, with id: ".concat((_d = response.data) === null || _d === void 0 ? void 0 : _d.bot_id));
                    return [2 /*return*/, { data: response.data }];
                case 2:
                    error_1 = _e.sent();
                    console.error("Error joining meeting:", error_1);
                    return [2 /*return*/, { error: error_1.message || "Unknown error" }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function fetchBotDetails(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var url, response, error_2;
        var _c;
        var botId = _b.botId, apiKey = _b.apiKey, proxyUrl = _b.proxyUrl;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 2, , 3]);
                    url = proxyUrl
                        ? proxyUrl
                        : "https://api.meetingbaas.com/bots/meeting_data";
                    return [4 /*yield*/, axios_1.default.get(url, {
                            params: {
                                bot_id: botId,
                            },
                            headers: {
                                "x-spoke-api-key": apiKey,
                            },
                        })];
                case 1:
                    response = _d.sent();
                    console.log("bot details fetched, with id: ".concat((_c = response.data) === null || _c === void 0 ? void 0 : _c.id));
                    return [2 /*return*/, { data: response.data }];
                case 2:
                    error_2 = _d.sent();
                    console.error("Error fetching meeting:", error_2);
                    return [2 /*return*/, { error: error_2.message || "Unknown error" }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
