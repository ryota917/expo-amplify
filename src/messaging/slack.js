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