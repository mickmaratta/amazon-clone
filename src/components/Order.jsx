import React from 'react';
import moment from "moment/moment";
import Currency from "react-currency-formatter";


const Order = ({order}) => {
    const timestamp = moment(order.timestamp.toDate()).unix()
  return (
    <div className='relative border rounded-md'>
        <div className='flex items-center space-x-10 p-5 bg-gray-100 text-sm text-gray-600'>
            <div>
                <p className='font-bold text-xs'>ORDER PLACED</p>
                <p>{moment.unix(timestamp).format("DD MMM YYYY")}</p>
            </div>
            <div>
                <p className='text-xs font-bold'>TOTAL</p>
                <p>
                    <Currency quantity={order.amount} currency="CAD" /> - Delivery{" "}
                    <Currency quantity={order.amount_shipping} currency="CAD" />
                </p>
            </div>
            <p className='text-sm whitespace-nowrap sm:text-xl self-end flex-1 text-right text-blue-500'>{order.images.length} Items</p>
            <p className='absolute top-2 right-2 w-40 lg:w-72 truncate text-xs whitespace-nowrap'>{order.id}</p>
        </div>
        <div className='p-5 sm:p-10'>
            <div className='flex space-x-6 overflow-x-auto'>
                {order.images.map((image, i) => (
                    <img key={i} className='h-20 object-contain sm:h-32' src={image} alt="" />
                ))}
            </div>
        </div>
    </div>
  )
}

export default Order