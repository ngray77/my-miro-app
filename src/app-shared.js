const apiKey = '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';

function buildCompletionsBody(promptTxt) {
    return {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            "model": "text-davinci-003",
            "prompt": promptTxt,
            "temperature": 0,
            "top_p": 1,
            "frequency_penalty": 0.0,
            "presence_penalty": 0.0,
            "stop": ["\n"]
        })
    };
}
function buildChatBody(promptTxt, jsonResults) {
    var formatStr = jsonResults ? "You can only return results in a JSON format having the following attributes: YesOrNo, PercentConfidence, ReasonExplanation" : "";

    return {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a a business technology leader. You have knowledge of the software development lifecycle and the most effective and efficient ways of delivering innovative results. Always answer with the goal of giving advice on how to best use the situation but also stay within the parameters of Agile principles, Secure Software Development, and Usability. " + formatStr
                },
                {
                    "role": "user",
                    "content": promptTxt
                }
            ],
            "temperature": 0
        })
    };
}

async function aiprompt(promptTxt, jsonResults, cb) {
    fetch(
        "https://api.openai.com/v1/chat/completions",
        buildChatBody(promptTxt, jsonResults)
    ).then((response) => response.json()
    ).then(r => {
        // console.log(r); 
        cb(r);
    })
}

export { aiprompt }; 