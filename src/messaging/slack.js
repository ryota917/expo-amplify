import axios from 'axios'
const slackEndpointUrl = "https://hooks.slack.com/services/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";

const headers = {
  'Content-Type':'application/json'
}

export default function send_message(content){
    axios({
        method: "POST",
        url: slackEndpointUrl,
        headers: headers,
        json: true,
        form: JSON.stringify({text: content})
    });
}
