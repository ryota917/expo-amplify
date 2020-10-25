/*
const request = require("request");
const slackEndpointUrl = "https://hooks.slack.com/services/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";

const headers = {
  'Content-Type':'application/json'
}

export default function send_message(content){
    const options = {
        url: slackEndpointUrl,
        method: 'POST',
        headers: headers,
        json:true,
        form: JSON.stringify({text: content})
    };
    request(options, function (error, response, body) {
        console.log(body);
    });
}
*/