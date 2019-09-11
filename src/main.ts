import { getInput, setOutput, setFailed } from "@actions/core";
import { readFileSync } from "fs";
import request from "request";

async function run() {
  try {
    const title = getInput("title");
    const body = getInput("body");

    const message = { body: "> " + title + "\n\n" + body };

    const url = await getAddress();

    const options = {
      url: url,
      method: "POST",
      headers: {
        Authorization: "token $GITHUB_TOKEN",
        "Content-Type": "application/json"
      },
      postData: message
    };

    request(options, (err, im, res) => {
      console.log("respost sent, status: ", err);
    });
  } catch (error) {
    setFailed(error.message);
  }
}

function getAddress(): string {
  const path = process.env.GITHUB_EVENT_PATH;
  if (!path) throw "GITHUB_EVENT_PATH not found";

  const data = readFileSync(path);
  const event = JSON.parse(data.toString());

  let url = (event.issue && event.issue.comments_url) || null;
  if (!url)
    url = (event.pull_request && event.pull_request.comments_url) || null;
  if (!url) throw "API endpoint for adding a comment not found";

  return url;
}

run();
