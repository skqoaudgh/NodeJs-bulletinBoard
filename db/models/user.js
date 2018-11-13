var mongoose = require('mongoose');
    Schema   = mongoose.Schema;

var userSchema = new Schema({
    id: String,
    pw: String,
    nick: String,
    registed_date: { type: Date, default: Date.now  }
});

module.exports = mongoose.connection.model('user', userSchema,'User');