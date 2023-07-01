const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(v) {
            if (!validator.isEmail(v)) {
                throw new Error('Invalid Email!')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(v) {
            if (v < 0) throw new Error("the age cannot be less than 0")
        }
    },
    password: {
        required: true,
        type: String,
        trim: true,
        minLength: 6,
        validate(v) {
            if (v.toLowerCase().match("password")) {
                throw new Error('the password cannot contain "password"');
            }
        },
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        },
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true,
})
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = await jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {

    const user = await User.findOne({ email: email })
    if (!user) throw new Error("unable to login")
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error("unable to login")
    // console.log("there in credentials",user)
    return user

}

// userSchema.pre('deleteOne',async function (next){
//     const user = this
//     console.log(user)
//    await Task.deleteMany({owner:user._id})
//    console.log("delete one pre hook")

//     next()
// })

userSchema.pre('save', async function (next) {
    const user = this
    // console.log(user)
    if (user.isModified('password')) {
        // console.log("this is hashed password")
        try {
            user.password = await bcrypt.hash(user.password, 10);

        } catch (error) {
            return next(error);
        }
    }
    next();
});

const User = mongoose.model('User', userSchema)

module.exports = User
