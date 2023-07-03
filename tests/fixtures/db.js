const mongoose = require('mongoose')
const User = require('../../src/models/user')
const jwt = require('jsonwebtoken')
const Task = require('../../src/models/task')


const userOneId = new mongoose.Types.ObjectId
const userOne = {
    _id: userOneId,
    name: "Hammo",
    email: "xxxxx@gmail.com",
    password: "123456",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId
const userTwo = {
    _id: userTwoId,
    name: "Hammo",
    email: "yyyyy@gmail.com",
    password: "123456",
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}


const taskOne = {
    _id : new mongoose.Types.ObjectId,
    description : "task one description",
    completed : false,
    owner : userOne._id
}


const taskTwo = {
    _id : new mongoose.Types.ObjectId,
    description : "task Two description",
    completed : true,
    owner : userTwo._id
}

const setUpDataBase = async () => {
    await User.deleteMany()
    await Task.deleteMany()

    await new User(userOne).save()
    await new User(userTwo).save()

    await new Task(taskOne).save()
    await new Task(taskTwo).save()



}

module.exports = {
    userOne,
    userTwo,
    userTwoId,
    userOneId,
    taskOne,
    taskTwo,
    setUpDataBase
}