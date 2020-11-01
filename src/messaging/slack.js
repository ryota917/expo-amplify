import axios from 'axios'
const slackEndpointUrl = "https://hooks.slack.com/services/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";

const headers = {
  'Content-Type':'application/json'
}

export default function send_message(content) {
  axios({
    method: "POST",
    url: slackEndpointUrl,
    transformRequest: [
      (data, headers) => {
        delete headers.post["Content-Type"];
        return data;
      }
    ],
    data: JSON.stringify({ text: content })
  });
}