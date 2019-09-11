"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const fs_1 = require("fs");
const request_1 = __importDefault(require("request"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const title = core_1.getInput("title");
            const body = core_1.getInput("body");
            const message = { body: "> " + title + "\n\n" + body };
            const url = yield getAddress();
            const options = {
                url: url,
                method: "POST",
                headers: {
                    Authorization: "token $GITHUB_TOKEN",
                    "Content-Type": "application/json"
                },
                postData: message
            };
            request_1.default(options, (err, im, res) => {
                console.log("respost sent, status: ", err);
            });
        }
        catch (error) {
            core_1.setFailed(error.message);
        }
    });
}
function getAddress() {
    const path = process.env.GITHUB_EVENT_PATH;
    if (!path)
        throw "GITHUB_EVENT_PATH not found";
    const data = fs_1.readFileSync(path);
    const event = JSON.parse(data.toString());
    let url = (event.issue && event.issue.comments_url) || null;
    if (!url)
        url = (event.pull_request && event.pull_request.comments_url) || null;
    if (!url)
        throw "API endpoint for adding a comment not found";
    return url;
}
run();
