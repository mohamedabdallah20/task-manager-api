const request = require('supertest')
const Task = require('../src/models/task')
const { setUpDataBase, userOne, userTwo, taskOne, } = require('./fixtures/db')
const app = require('../src/app')

beforeEach(setUpDataBase)
test('should add new task', async () => {
    const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({ 
            description: "test new task description"
         })
        .expect(201)
    const task = await Task.findById(res.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('should get all tasks related to user',async()=>{
    const res = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
    expect(res.body.length).toEqual(1)
})
test('should Not get delete task related to user 1',async()=>{
    const res = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404)
    expect(res.body).toEqual({})
})

// Task Test Ideas
//
// TODO Should not create task with invalid description/completed
// TODO Should not update task with invalid description/completed
// TODO Should delete user task
// TODO Should not delete task if unauthenticated
// TODO Should not update other users task
// TODO Should fetch user task by id
// TODO Should not fetch user task by id if unauthenticated
// TODO Should not fetch other users task by id
// TODO Should fetch only completed tasks
// TODO Should fetch only incomplete tasks
// TODO Should sort tasks by description/completed/createdAt/updatedAt
// TODO Should fetch page of tasks