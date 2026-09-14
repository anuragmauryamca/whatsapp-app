
const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;


// =====================================================
// CONFIGURATION
// =====================================================

const VERIFY_TOKEN = "EAAPPqQKCdogBSe2Khqfr7gZCMZColKk1pZCCYydG1xTF3utTFFaFzlJsM2elvOx0ItZAs3ZAwnqBEDiudemJYlxgZCiMu19liA6ZAJ2RdyFWhltA6egP9NMGr4exo0lkASJ53vIhr3VheZBHUaZAw5kAqvzluXIWjyLiuylYtjuBHtLflgc2m9S8vUCOBZB9rcFwZDZD";

const ACCESS_TOKEN = "EAAPPqQKCdogBSe2Khqfr7gZCMZColKk1pZCCYydG1xTF3utTFFaFzlJsM2elvOx0ItZAs3ZAwnqBEDiudemJYlxgZCiMu19liA6ZAJ2RdyFWhltA6egP9NMGr4exo0lkASJ53vIhr3VheZBHUaZAw5kAqvzluXIWjyLiuylYtjuBHtLflgc2m9S8vUCOBZB9rcFwZDZD";


// =====================================================
// GET - WEBHOOK VERIFICATION
// =====================================================

app.get("/", (req, res) => {

    const mode = req.query["hub.mode"];
    const challenge = req.query["hub.challenge"];
    const token = req.query["hub.verify_token"];

    console.log("Webhook verification request received");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {

        console.log("WEBHOOK VERIFIED");

        return res.status(200).send(challenge);
    }

    console.log("WEBHOOK VERIFICATION FAILED");

    return res.sendStatus(403);
});


// =====================================================
// POST - RECEIVE WHATSAPP MESSAGE
// =====================================================

app.post("/", async (req, res) => {

    console.log("\n=================================");
    console.log("WHATSAPP WEBHOOK RECEIVED");
    console.log("=================================");

    console.log(
        JSON.stringify(req.body, null, 2)
    );


    // Meta ko immediately 200 response
    res.sendStatus(200);


    try {

        const message =
            req.body?.entry?.[0]
                ?.changes?.[0]
                ?.value
                ?.messages?.[0];


        // Agar message nahi hai
        if (!message) {

            console.log("No WhatsApp message found.");

            return;
        }


        // Customer WhatsApp number
        const from = message.from;


        console.log(
            "Customer Number:",
            from
        );


        console.log(
            "Message Type:",
            message.type
        );


        // =================================================
        // SEND HELLO_WORLD TEMPLATE
        // =================================================

        await sendHelloWorld(from);


    } catch (error) {

        console.error(
            "Webhook Error:",
            error
        );
    }
});


// =====================================================
// SEND HELLO_WORLD TEMPLATE
// =====================================================

async function sendHelloWorld(to) {

    // HARD-CODED GRAPH API URL
    const url =
        "https://graph.facebook.com/v23.0/1184064238133452/messages";


    // WhatsApp template request
    const body = {

        messaging_product: "whatsapp",

        to: "919454060447",

        type: "template",

        template: {

            name: "hello_world",

            language: {

                code: "en_US"

            }

        }

    };


    console.log("\nSending hello_world template...");

    console.log(
        "To:",
        to
    );


    const response = await fetch(url, {

        method: "POST",

        headers: {

            "Authorization":
                "Bearer " + ACCESS_TOKEN,

            "Content-Type":
                "application/json"

        },

        body: JSON.stringify(body)

    });


    const result = await response.json();


    console.log(
        "\nWhatsApp API Response:"
    );

    console.log(
        JSON.stringify(result, null, 2)
    );


    if (!response.ok) {

        console.error(
            "FAILED TO SEND TEMPLATE"
        );

        return;
    }


   console.log(
    "HELLO_WORLD TEMPLATE SENT SUCCESSFULLY"
);
}


// =====================================================
// START SERVER
// =====================================================

app.listen(port, () => {

    console.log("\n=================================");
    console.log("WhatsApp Webhook Server Started");
    console.log("Port:", port);
    console.log("=================================");

});
