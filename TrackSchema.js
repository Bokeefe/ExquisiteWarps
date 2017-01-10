/* jshint esversion: 6 */

module.exports = (mongoose) => {
   var TrackModel = new mongoose.Schema({ // creates a new mongoose schema called TrackModel
      start: Number,
      end: Number,
      fades: Number,
      src: String,
      cuein: Number,
      cueout: Number
   });

   var Track = mongoose.model('User', TrackModel); // create a new model called 'User' based on 'UserSchema'

   return Track;
};