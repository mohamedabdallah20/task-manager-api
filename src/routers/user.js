const express = require('express')
const User = require('../models/user')
const router = express.Router()
const auth = require('../middleware/auth')
const sharp = require('sharp')
const Task = require('../models/task')
const multer = require('multer')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')

//signup
router.post('/users', async (req, res) => {

    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (err) {
        res.status(400).send(err)
    }

})
//login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// logout
router.post('/users/logout', auth, async (req, res) => {
    try {
        const user = req.user
        const token = req.token

        user.tokens = user.tokens.filter((t) => {
            return t.token !== token
        })
        await user.save(user)
        res.send("done")

    } catch (e) {
        res.status(500).send()
    }
})
//logoutall
router.post('/users/logoutall', auth, async (req, res) => {
    try {
        const user = req.user
        user.tokens = []
        await user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
//read profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)

})
//edit profile
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'password', "email"]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {

        const user = req.user

        updates.map(v => {
            user[v] = req.body[v]
        })
        await user.save()

        // const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true, runValidators: true })
        res.send(user)

    } catch (err) {
        res.status(400).send(err)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {

        // await User.findByIdAndRemove(req.user._id)
        // const user = req.user
        // await req.user.remove()
        // await req.user.deleteOne()
        // console.log(req.user)
        const user = req.user;
        await Task.deleteMany({ owner: user._id });
        await user.deleteOne();
        sendCancelationEmail(user.email, user.name)

        res.send()
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})


const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 2 * 1024 * 1024, // 5MB in bytes
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|png|jpg)$/)) {
            return cb(new Error("please enter appropriate image format"))
        }

        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(400).send(e)
    }
})


module.exports = router
