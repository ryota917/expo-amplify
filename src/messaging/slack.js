const request = require("request");
const slackEndpointUrl = "https://hooks.slack.com/services/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";

const headers = {
  'Content-Type':'application/json'
}

function send_message(content){
    const options = {
        url: slackEndpointUrl,
        method: 'POST',
        headers: headers,
        json:true,
        form: JSON.stringify({'text':content})
    };
    request(options, function (error, response, body) {
        console.log(body);
    });
}
