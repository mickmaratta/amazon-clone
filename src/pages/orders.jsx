import moment from "moment/moment";
import { getSession, useSession } from "next-auth/react";
import React from "react";
import db from "../../firebase";
import Header from "../components/Header";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "firebase-admin";

const orders = ({ orders }) => {
  const { data: session } = useSession();

  return (
    <div>
      <Header />
      <main className="max-w-s-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          Your Orders
        </h1>

        {session ? (
          <h2>x Orders</h2>
        ) : (
          <h2>Please sign in to see your orders</h2>
        )}

        <div className="mt-5 space-y-4"></div>
      </main>
    </div>
  );
};

export default orders;

export async function getServerSideProps(context) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  //Get the users logged in credentials
  const session = await getSession(context);

  if (!session) {
    return {
      props: {},
    };
  }

  // Firebase db
  const snapshot = await db
    .collection("users")
    .doc(session.user.email)
    .collection("orders")
    .orderBy("timestamp", "desc")
    .get();

  const stripeOrders = snapshot.docs.map(doc=>doc.data)

  //Stripe orders
 /*  const orders = await Promise.all(
    stripeOrders.docs.map(async (order) => ({
      id: order.id,
      amount: order.data().images,
      amountShipping: order.data().amount_shipping,
      images: order.data().images,
      timestamp: moment(order.data().timestamp.toDate()).unix(),
      items: (
        await stripe.chekout.sessions.listLineItems(order.id, {
          limit: 100,
        })
      ).data,
    }))
  ); */

  return {
    props: {
      stripeOrders,
    },
  };
}
