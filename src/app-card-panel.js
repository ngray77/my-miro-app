import { aiprompt } from './app-shared.js';

var thisCard = null;
export async function init() {
    const modalData = await miro.board.getAppData("app-card-modal-data");
    thisCard = modalData.card
    //console.log(thisCard)
    document.getElementById('fTitle').value = thisCard.title
    document.getElementById('fDesc').value = thisCard.description
    document.getElementById('fAI').innerText = thisCard.fields[0].tooltip
}

init();

async function pushValues() {
    var card = await miro.board.getById(thisCard.id)
    thisCard.title = card.title = document.getElementById('fTitle').value
    thisCard.description = card.description = document.getElementById('fDesc').value
    thisCard.fields[0].tooltip = card.fields[0].tooltip = document.getElementById('fAI').innerText
    card.sync();
}

document.getElementById('updateBtn').addEventListener(
    "click", async function () {
        await pushValues();

        aiprompt(
            "Evaluate the feature idea below and determine if it contains a " +
            "clearly-stated value to a business or user of a system, including ROI, a " +
            "specific use case it affects, the roles that will benefit from it, and clear " +
            "criteria that describe success.\n" + thisCard.title + ". " + thisCard.description, true,
            (x) => {
                var aiActions = thisCard.fields.filter(function (f) { return f.value === 'AI Actions'; });

                var msgObj = JSON.parse(x.choices[0].message.content);

                var el = document.getElementById('fAI')
                el.style.backgroundColor = msgObj.YesOrNo == "Yes" ? "#CFC" : "#ffa49d";
                el.innerText =
                    aiActions[0].tooltip =
                    msgObj.ReasonExplanation;
                el.tooltip = msgObj.PercentConfidence;

            }
        );

    });

document.getElementById('doneBtn').addEventListener(
    "click", async function () {
        await pushValues();

        miro.board.ui.openPanel({
            url: 'app.html',
            height: 400
        });
    });