```javascript
const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;


// =====================================================
// CONFIGURATION - HARD CODED FOR TESTING
// =====================================================

const VERIFY_TOKEN =
    "EAAPPqQKCdogBSe2Khqfr7gZCMZColKk1pZCCYydG1xTF3utTFFaFzlJsM2elvOx0ItZAs3ZAwnqBEDiudemJYlxgZCiMu19liA6ZAJ2RdyFWhltA6egP9NMGr4exo0lkASJ53vIhr3VheZBHUaZAw5kAqvzluXIWjyLiuylYtjuBHtLflgc2m9S8vUCOBZB9rcFwZDZD";

const ACCESS_TOKEN =
    "EAAPPqQKCdogBSe2Khqfr7gZCMZColKk1pZCCYydG1xTF3utTFFaFzlJsM2elvOx0ItZAs3ZAwnqBEDiudemJYlxgZCiMu19liA6ZAJ2RdyFWhltA6egP9NMGr4exo0lkASJ53vIhr3VheZBHUaZAw5kAqvzluXIWjyLiuylYtjuBHtLflgc2m9S8vUCOBZB9rcFwZDZD";

const PHONE_NUMBER_ID =
    "1184064238133452";

const GRAPH_API_VERSION =
    "v23.0";


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
    console.log("WhatsApp Webhook Received");
    console.log("=================================");


    console.log(
        JSON.stringify(req.body, null, 2)
    );


    // Meta ko immediately response
    res.sendStatus(200);


    try {

        const entry = req.body?.entry?.[0];

        const change = entry?.changes?.[0];

        const value = change?.value;

        const message = value?.messages?.[0];


        // Message nahi hai
        // Example: status update
        if (!message) {

            console.log("No WhatsApp message found.");

            return;
        }


        // Customer ka WhatsApp number
        const from = message.from;


        console.log(
            "Message received from:",
            from
        );


        console.log(
            "Message type:",
            message.type
        );


        // =================================================
        // SEND HELLO_WORLD TEMPLATE
        // =================================================

        await sendHelloWorldTemplate(from);


    } catch (error) {

        console.error(
            "Webhook processing error:",
            error
        );
    }
});


// =====================================================
// SEND HELLO_WORLD TEMPLATE
// =====================================================

async function sendHelloWorldTemplate(to) {

    // IMPORTANT:
    // Yahan sirf normal URL hai.
    // Markdown link nahi hai.

    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PHONE_NUMBER_ID}/messages`;


    const requestBody = {

        messaging_product: "whatsapp",

        to: to,

        type: "template",

        template: {

            name: "hello_world",

            language: {

                code: "en_US"

            }

        }

    };


    console.log(
        "\nSending hello_world template to:",
        to
    );


    console.log(
        JSON.stringify(requestBody, null, 2)
    );


    const response = await fetch(url, {

        method: "POST",

        headers: {

            "Authorization":
                `Bearer ${ACCESS_TOKEN}`,

            "Content-Type":
                "application/json"

        },

        body: JSON.stringify(requestBody)

    });


    const result = await response.json();


    if (!response.ok) {

        console.error(
            "WhatsApp API Error:"
        );

        console.error(
            JSON.stringify(result, null, 2)
        );

        return;
    }


    console.log(
        "================================="
    );

    console.log(
        "Template sent successfully!"
    );

    console.log(
        JSON.stringify(result, null, 2)
    );

    console.log(
        "================================="
    );
}


// =====================================================
// START SERVER
// =====================================================

app.listen(port, () => {

    console.log("\n=================================");

    console.log(
        `Server running on port ${port}`
    );

    console.log("=================================");

    console.log(
        `Webhook URL: /`
    );
});
```
