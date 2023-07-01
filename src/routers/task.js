const express = require('express')
const Task = require('../models/task')
const router = express.Router()
const auth = require('../middleware/auth')


router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id,
    })


    try {
        await task.save()
        res.status(201).send(task)
    } catch (err) {
        res.status(400).send(err)
    }

})


router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const options = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.limit) {
        options.limit = req.query.limit
    }
    if (req.query.skip) {
        options.skip = req.query.skip
    }
    if (req.query.sortBy) {
        const sortby = req.query.sortBy.split(':')
        sort[sortby[0]] = sortby[1] === 'asc' ? 1 : -1
        console.log(sort)
        options.sort = sort
    }

    try {
        // const tasks = await Task.find({ owner: req.user._id })
        await req.user.populate({
            path: 'tasks',
            match,
            options,
        })
        // console.log(test)
        res.send(req.user.tasks)
    } catch (err) {
        res.status(500).send()
    }

})

router.get('/tasks/:taskId', auth, async (req, res) => {
    try {
        // const task = await Task.findById(req.params.taskId)
        const task = await Task.findOne({ _id: req.params.taskId, owner: req.user._id })

        if (!task) return res.status(404).send()
        res.send(task)
    } catch (err) {
        res.status(500).send()
    }

})



router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }

        updates.map(v => {
            task[v] = req.body[v]
        })

        await task.save()
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router