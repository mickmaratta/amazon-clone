const withImages = require('next-images');

module.exports = {
    images: {
        domains: ['links.papareact.com', "fakestoreapi.com"]
    },
    ...withImages(),
    future: {
        webpack5: true
    }
}