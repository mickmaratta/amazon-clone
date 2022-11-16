import { buffer } from "micro";
import * as admin from "firebase-admin";
import serviceAccountJS from "../../../permissions"

//Secure a connection to FIREBASE from the backend
const serviceAccount = JSON.parse(JSON.stringify(serviceAccountJS))
const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

//Establish connection to Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

const fulfillOrder = async (session) => {
  //console.log("fulfilling order", session);

  return app
    .firestore()
    .collection("users")
    .doc(session.metadata.email)
    .collection("orders")
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      titles: JSON.parse(session.metadata.titles),
      prices: JSON.parse(session.metadata.prices),
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      id: session.id
    })
    .then(() => {
      console.log(
        `SUCCESS: Order ${session.id} has been added to the database`
      );
    });
};

export default async (req, res) => {
  if (req.method === "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];

    let event;

    //Verify that the EVENT posteed came from stripes
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (error) {
      console.log("ERROR", error.message);
      return res.status(400).send(`Webhook error: ${error.message}`);
    }

    //Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      //Fulfill the order
      return fulfillOrder(session)
        .then(() => res.status(200))
        .catch((err) => res.status(400).send(`Webhook Error: ${err.message}`));
    }
  }
};

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true
    }
}