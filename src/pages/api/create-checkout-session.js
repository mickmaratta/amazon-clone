const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { items, email } = req.body;
  const transformedItems = items.map((item) => ({
    price_data: {
      currency: "cad",
      product_data: {
        name: item.title,
        images: [item.image],
      },
      unit_amount: item.price * 100,
    },
    quantity: 1,
  }));

  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: {
        allowed_countries: ['CA', 'US', 'GB']
    },
    shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {amount: 0, currency: 'cad'},
            display_name: 'Free shipping',
            delivery_estimate: {
              minimum: {unit: 'business_day', value: 5},
              maximum: {unit: 'business_day', value: 7},
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {amount: 699, currency: 'cad'},
            display_name: 'Guaranteed 2-day shipping',
            delivery_estimate: {
              minimum: {unit: 'business_day', value: 1},
              maximum: {unit: 'business_day', value: 2},
            },
          },
        },
      ],
    line_items: transformedItems,
    mode: 'payment',
    success_url: process.env.HOST + 'success',
    cancel_url: process.env.HOST + 'checkout',
    metadata: {
        email,
        images: JSON.stringify(items.map(item => item.image)),
        titles: JSON.stringify(items.map(item => item.title)),
        titles: JSON.stringify(items.map(item => item.title)),
        prices: JSON.stringify(items.map(item => item.price)),
    }
  });

  res.status(200).json( { id: session.id })
};
