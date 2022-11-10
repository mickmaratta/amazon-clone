const withImages = require('next-images');

module.exports = {
    images: {
        domains: ['links.papareact.com', "fakestoreapi.com"]
    },
    ...withImages(),
    future: {
        webpack5: true
    },
    env: {
        stripe_public_key: process.env.STRIPE_PUBLIC_KEY
    }
}