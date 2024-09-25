const express = require('express')
const app = express()
app.use(express.json())
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const dbPath = path.join(__dirname, 'todo.db')
const addDays = require('date-fns/addDays')
const {format} = require('date-fns')
let db = null

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(5000, () => {
      console.log('Server Running at http://localhost:5000/')
    })
  } catch (error) {
    console.log('DB ERROR:${error.message}')
    process.exit(1)
  }
}
initializeDbAndServer()

const res = dbObject => {
  return {
    id: dbObject.id,
    todo: dbObject.todo,
    priority: dbObject.priority,
    status: dbObject.status,
    category: dbObject.category,
    dueDate: dbObject.due_date,
  }
}

const hasStatus = status => {
  return status !== undefined
}

const hasPriority = priority => {
  return priority !== undefined
}

const hasCategory = category => {
  return category !== undefined
}

const hasStatusPriority = (status, priority) => {
  return status !== undefined && priority !== undefined
}

const hasStatusCategory = (status, category) => {
  return status !== undefined && category !== undefined
}

const hasPriorityCategory = (priority, category) => {
  return priority !== undefined && category !== undefined
}

const statusArr = ['TO DO', 'IN PROGRESS', 'DONE']
const priorityArr = ['MEDIUM', 'HIGH', 'LOW']
const categoryArr = ['HOME', 'LEARNING', 'WORK']

app.get("/",(req,res) => {
    res.send("hello");
});

app.get('/todos/', async (request, response) => {
  let {status, priority, category, search_q = ' '} = request.query
  const re = `select * from todo where todo LIKE "%${search_q}%";`
  if (hasStatusPriority(status, priority) === true) {
    if (statusArr.includes(status) && priorityArr.includes(priority)) {
      const resu = `select * from todo where status="${status}" AND priority="${priority}" AND todo LIKE "%${search_q}%";`
      const r1 = await db.all(resu)
      response.send(r1.map(each => res(each)))
      console.log(r1)
    } else if (statusArr.includes(status) && !priorityArr.includes(priority)) {
      response.send(400)
      response.send('Invalid Todo Status')
    } else if (!statusArr.includes(status) && priorityArr.includes(priority)) {
      response.send(400)
      response.send('Invalid Todo Priority')
    } else {
      response.send('Invalid Todo Status and Priority')
    }
  } else if (hasStatusCategory(status, category) === true) {
    console.log('veena')
    if (statusArr.includes(status) && categoryArr.includes(category)) {
      const resu = `select * from todo where status="${status}" AND category="${category}" and todo LIKE "%${search_q}%";`
      const ress = await db.all(resu)
      response.send(ress.map(each => res(each)))
      console.log(ress)
    } else if (!statusArr.includes(status) && categoryArr.includes(category)) {
      response.send(400)
      response.send('Invalid Todo Category')
    } else if (statusArr.includes(status) && !categoryArr.includes(category)) {
      response.send(400)
      response.send('Invalid Todo Status')
    } else {
      response.send('Invalid Todo Status and Priority')
    }
  } else if (hasPriorityCategory(priority, category) === true) {
    if (priorityArr.includes(priority) && categoryArr.includes(category)) {
      const resu = `select * from todo where priority="${priority}" and category="${category}" and todo LIKE "%${search_q}%";`
      const ress = await db.all(resu)
      response.send(ress.map(each => res(each)))
      console.log(ress)
    } else if (
      priorityArr.includes(priority) &&
      !categoryArr.includes(category)
    ) {
      response.send(400)
      response.send('Invalid Todo Priority')
    } else if (
      !priorityArr.includes(priority) &&
      categoryArr.includes(category)
    ) {
      response.send(400)
      response.send('Invalid Todo Category')
    } else {
      response.send('Invalid Todo Category and Priority')
    }
  } else if (hasStatus(status) == true) {
    if (statusArr.includes(status)) {
      const resu = `select * from todo where status="${status}" and todo LIKE "%${search_q}%";`
      const ress = await db.all(resu)
      response.send(ress.map(each => res(each)))
      console.log(ress)
    } else if (!statusArr.includes(status)) {
      response.status(400)
      response.send('Invalid Todo Status')
    }
  } else if (hasPriority(priority) == true) {
    if (priorityArr.includes(priority)) {
      const resu = `select * from todo where priority="${priority}" and todo LIKE "%${search_q}%";`
      const ress = await db.all(resu)
      response.send(ress.map(each => res(each)))
      console.log(ress)
    } else {
      response.status(400)
      response.send('Invalid Todo Priority')
    }
  } else if (hasCategory(category) == true) {
    if (categoryArr.includes(category)) {
      const resu = `select * from todo where category="${category}" and todo LIKE "%${search_q}%";`
      const ress = await db.all(resu)
      response.send(ress.map(each => res(each)))
      console.log(ress)
    } else {
      response.status(400)
      response.send('Invalid Todo Category')
    }
  } else {
    const ress = await db.all(re)
    response.send(ress.map(each => res(each)))
    console.log(ress)
  }
})

//api 2

app.get('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const re = `select * from todo where id = ${todoId};`
  const r1 = await db.get(re)
  response.send(res(r1))
  console.log(r1)
})

//api 3

app.get('/agenda/', async (request, response) => {
  const {date} = request.query
  try {
    if (date !== undefined) {
      const newDate = new Date(date)
      const formattedDate = format(newDate, 'yyyy-MM-dd')
      const re = `select * from todo where due_date = "${formattedDate}";`
      const r1 = await db.all(re)
      response.send(r1.map(each => res(each)))
      console.log(r1)
    }
  } catch {
    response.status(400)
    response.send('Invalid Due Date')
    return
  }
})

//api 4

app.post('/todos/', async (request, response) => {
  const {id, todo, priority, status, category, dueDate} = request.body
  if (!statusArr.includes(status)) {
    response.status(400)
    response.send('Invalid Todo Status')
  } else if (!categoryArr.includes(category)) {
    response.status(400)
    response.send('Invalid Todo Category')
  } else if (!priorityArr.includes(priority)) {
    response.status(400)
    response.send('Invalid Todo Priority')
  } else if (dueDate === undefined) {
    response.status(400)
    response.send('Invalid Due Date')
  } else if (dueDate !== undefined) {
    const newDate = new Date(dueDate)
    try {
      const formattedDate = format(newDate, 'yyyy-MM-dd')
      const re = `insert into todo (id, todo, priority, status, category, due_date) values 
      (${id}, "${todo}", "${priority}", "${status}", "${category}", "${formattedDate}")`
      const r1 = await db.get(re)
      response.send('Todo Successfully Added')
      console.log('Todo Successfully Added')
    } catch {
      response.status(400)
      response.send('Invalid Due Date')
    }
  }
})

//api 5

app.put('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  let updateColumn
  const requestBody = request.body
  let existingrow = `select * from todo where id="${todoId}";`

  switch (true) {
    case requestBody.todo !== undefined:
      updateColumn = 'Todo'
      const q1 = `UPDATE todo SET todo="${requestBody.todo}" where id=${todoId};`
      await db.run(q1)
      response.send(`${updateColumn} Updated`)
      console.log(`${updateColumn} Updated`)
      break
    case requestBody.status !== undefined:
      if (!statusArr.includes(requestBody.status)) {
        response.status(400)
        response.send('Invalid Todo Status')
      } else {
        updateColumn = 'Status'
        const q1 = `UPDATE todo SET status="${requestBody.status}" where id=${todoId};`
        await db.run(q1)
        response.send(`${updateColumn} Updated`)
        console.log(`${updateColumn} Updated`)
      }
      break
    case requestBody.priority !== undefined:
      if (!priorityArr.includes(requestBody.priority)) {
        response.status(400)
        response.send('Invalid Todo Priority')
      } else {
        updateColumn = 'Priority'
        const q1 = `UPDATE todo SET priority="${requestBody.priority}" where id=${todoId};`
        await db.run(q1)
        response.send(`${updateColumn} Updated`)
        console.log(`${updateColumn} Updated`)
      }
      break
    case requestBody.category !== undefined:
      if (!categoryArr.includes(requestBody.category)) {
        response.status(400)
        response.send('Invalid Todo Category')
      } else {
        updateColumn = 'Category'
        const q1 = `UPDATE todo SET category="${requestBody.category}" where id=${todoId};`
        await db.run(q1)
        response.send(`${updateColumn} Updated`)
        console.log(`${updateColumn} Updated`)
      }
      break
    case requestBody.dueDate !== undefined:
      const newDate = new Date(requestBody.dueDate)
      try {
        const formattedDate = format(newDate, 'yyyy-MM-dd')
        updateColumn = 'Due Date'
        const q1 = `UPDATE todo SET due_date=${requestBody.dueDate} where id=${todoId};`
        await db.run(q1)
        response.send(`${updateColumn} Updated`)
        console.log(`${updateColumn} Updated`)
      } catch {
        response.status(400)
        response.send('Invalid Due Date')
      }
      break
  }
})

//API6
app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const deleteTodoQuery = `
    DELETE FROM
      todo
    WHERE
      id = ${todoId};
    `
  await db.run(deleteTodoQuery)
  response.send('Todo Deleted')
  console.log('Todo Deleted')
})

module.exports = app