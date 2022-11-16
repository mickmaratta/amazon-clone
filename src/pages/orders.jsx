import moment from "moment/moment";
import { getSession, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import db from "../../firebase";
import Header from "../components/Header";
import { collection, getDocs } from "firebase/firestore";
import Order from "../components/Order";

const orders = ({ user }) => {
  const { data: session } = useSession();
  const [firebaseOrders, setFirebaseOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const getOrders = async () => {
      const querySnapshot = await getDocs(
        collection(db, `users/${user}/orders`)
      );
      const orders = querySnapshot.docs.map((doc) => doc.data());
      orders.sort((a, b) => b.timestamp - a.timestamp)
      setFirebaseOrders(orders);
      setIsLoading(false)
    };
    user && getOrders();
  }, []);

  return (
    <div>
      <Header />
      <main className="max-w-s-lg mx-auto p-10">
        <h1 className="text-3xl border-b mb-2 pb-1 border-yellow-400">
          Your Orders
        </h1>
        {isLoading && user && <span className="text-lg text-gray-500 animate-pulse mb-10">Loading orders...</span>}
        {session ? (
          <h2>{firebaseOrders.length} Order(s)</h2>
        ) : (
          <h2>Please sign in to see your orders</h2>
        )}

        <div className="mt-5 space-y-4">
          {firebaseOrders?.map((order) => (
            <Order key={order.id} order={order} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default orders;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if(!session) {
    return {
      props: {}
    }
  }
  const user = session.user.email;

  return {
    props: {
      user,
    },
  };
}
