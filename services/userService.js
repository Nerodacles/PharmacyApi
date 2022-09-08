const User = require('../models/userModel')
const bcrypt = require('bcryptjs');
const auth = require('../helpers/jwt.js')

async function login({ username, password }) {
    const user = await User.findOne({username});

    // synchronously compare user entered password with hashed password
    if(bcrypt.compareSync(password, user.password)){
        // Generate a token
        const token = auth.generateAccessToken(username);

        // call toJSON method applied during model instantiation
        return {...user.toJSON(), token}
    }
    return 'err'
}

async function register(params){
    // instantiate a user modal and save to mongoDB
    const user = new User(params);
    await user.save();
    // call toJSON method applied during model instantiation
    return user.toJSON();
}

async function getAll() {
    // find all users in mongoDB
    return await User.find({})
}

async function getById(id) {
    const user = await User.findById(id);
    // call toJSON method applied during model instantiation
    return user.toJSON()
}

async function addFav(authToken, fav) {
    const username = auth.getUserByToken(authToken).data
    const user = await User.findOne({username});
    user.favorites.push(fav)
    await user.save();
    return user.toJSON()
}

async function delFav(authToken, fav) {
    const username = auth.getUserByToken(authToken).data
    const user = await User.findOne({username});
    user.favorites = user.favorites.filter(f => f !== fav)
    await user.save();
    return user.toJSON()
}

async function getFavs(authToken) {
    const username = auth.getUserByToken(authToken).data
    const user = await User.findOne({username});
    return user.favorites
}

module.exports = {
    login,
    register,
    getAll,
    getById,
    addFav,
    delFav,
    getFavs,
};