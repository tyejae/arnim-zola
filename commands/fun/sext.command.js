// const Commando = require('discord.js-commando');
// let FlickrImages = [];
// var Flickr = require("flickrapi"),
//     flickrOptions = {
//       api_key: "4bc73800e8f660659cc86097d14fa1c9",
//       secret: "ab530b246b24fc7d",
//       requestOptions: {
//         timeout: 20000,
//         /* other default options accepted by request.defaults */
//       }
//     };

// Flickr.tokenOnly(flickrOptions, function(error, flickr) {
//     // we can now use "flickr" as our API object,
//     // but we can only call public methods and access public data
//     flickr.photos.search({
//         tags: "nuts+bolts",
//         page: 1,
//         per_page: 500
//     }, function(err, result) {
//         if(err) { throw new Error(err); }
//         // do something with result
//         FlickrImages = result.photos.photo;
//         // console.log(result.photos)
//         // let photo = result.photos.photo[34];
//         // let url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
//         // console.log(result.photos.photo[4])
//         // console.log(url)
//     });
// });

// class SextCmd extends Commando.Command {
//     constructor(client) {
//         super(client, {
//             name: 'sext',
//             memberName: 'sext',
//             description: `You asked for it, I've delivered!`,
//             group: 'fun',
//             aliases: []
//         });
//     }
//     async run(message, args) {
//         try {
//             let photo = FlickrImages[Math.floor(Math.random() * FlickrImages.length)];
//             let url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
//             message.author.send(url).then(message.delete(2000))
//         } catch (e) {
//             message.author.send('Some error occurred :(');
//         }
//     }
// }
// module.exports = SextCmd