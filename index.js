const express = require('express');
const app = express();

const PORT = 5000

app.use(express.json())


let inMemoryData = {
    contacts: [],
    blogs: []    
}

const loggerMiddeware = (req, res, next) => {
    let d = new Date,
        dformat = [d.getDate(),
        d.getMonth() + 1,
        d.getFullYear()].join('/') + ' ' +
            [d.getHours(),
            d.getMinutes(),
            d.getSeconds()].join(':');
    next()
    let diff = new Date() - d
    console.log(`--------> ${dformat} | ${req.method}: ${req.url} | ${diff} ms`)
}
app.use('/',loggerMiddeware) 

const auth = (req,res,next) => {
    const secretKey = 'brat'
    let key = req.headers['authorization']
    console.log(key)
    if (key == secretKey) {
        next()
        return
    }
    res.status(401).send("Unauthorized");
}
app.use('/api/contacts', auth)



// create a contact
app.post('/api/contacts', (req, res) => {
    let body = req.body

    if (!body.firstname) {
        res.status(400).send(`firstname.da tutildin`);
        return
    }

    if (!body.lastname) {
        res.status(400).send(`lastname.da tutildin`);
        return
    }

    if (!body.phone) {
        res.status(400).send(`phone.da tutildin`);
        return
    }

    for (let i = 0; i < inMemoryData.contacts.length; i++) {
        const element = inMemoryData.contacts[i];
        if (element.id == body.id) {
            res.status(400).send(`id:${body.id} have a contact!`);
            return
        }
    }

    body.createAt = new Date()
    inMemoryData.contacts.push(body)

    res.status(201).send("successfully created")
})

// read contact(s)
app.get('/api/contacts', (req, res) => {
    if (inMemoryData.contacts.length == 0) {
        res.status(404).send("not found!")
        return
    }
    res.json(inMemoryData.contacts)
})

// get a contact
app.get('/api/contacts/:id', (req, res) => {
    let id = req.params.id

    let contact = inMemoryData.contacts.find(e => e.id == id)
    if (!contact) {
        res.status(400).send(`id:${id} read a contact!`);
        return
    }

    res.status(200).json(contact)
})


// update a contact
app.put('/api/contact/', (req, res) => {
    let body = req.body

    console.log(body)
    let contact = inMemoryData.contacts.find(e => e.id == body.id)

    if (!contact) {
        res.status(400).send(`id:${body.id} update a contact!`);
        return
    }

    for (let i = 0; i < inMemoryData.contacts.length; i++) {
        const element = inMemoryData.contacts[i];
        if (element.id == body.id) {
            body.createAt = inMemoryData.contacts[i].createAt
            body.updateAt = new Date()
            inMemoryData.contacts[i] = body
            break;
        }
    }

    res.status(200).send("successfully updated")
})

// delete a contact
app.delete('/api/contacts/:id', (req, res) => {
    let id = req.params.id

    let contact = inMemoryData.contacts.find(e => e.id == id)
    if (!contact) {
        res.status(400).send(`id:${id} delete a contact!`);
        return
    }

    inMemoryData.contacts = inMemoryData.contacts.filter(e => e.id != id)

    res.status(200).send("successfully deleted")
})

//Blogs

app.post('/api/blogs', (req, res) => {
    let body = req.body

    if (!body.title) {
        res.status(400).send(`No title`);
        return
    }

    if (!body.description) {
        res.status(400).send(`no description`);
        return
    }

    for (let i = 0; i < inMemoryData.blogs.length; i++) {
        const element = inMemoryData.blogs[i];
        if (element.id == body.id) {
            res.status(400).send(`id:${body.id} have a post!`);
            return
        }
    }

    body.createAt = new Date()
    inMemoryData.blogs.push(body)

    res.status(201).send("successfully created")
})

app.get('/api/blogs/:id', (req, res) => {
    let id = req.params.id

    let blogs = inMemoryData.blogs.find(e => e.id == id)
    if (!blogs) {
        res.status(400).send(`id:${id} read a post!`);
        return
    }

    res.status(200).json(blogs)
})

app.get('/api/blogs', (req, res) => {
    if (inMemoryData.blogs.length == 0) {
        res.status(404).send("not found!")
        return
    }
    res.json(inMemoryData.blogs)
})

app.put('/api/blogs/', (req, res) => {
    let body = req.body

    console.log(body)
    let blogs = inMemoryData.blogs.find(e => e.id == body.id)

    if (!blogs) {
        res.status(400).send(`id:${body.id} update a post!`);
        return
    }

    for (let i = 0; i < inMemoryData.blogs.length; i++) {
        const element = inMemoryData.blogs[i];
        if (element.id == body.id) {
            body.createAt = inMemoryData.blogs[i].createAt
            body.updateAt = new Date()
            inMemoryData.blogs[i] = body
            break;
        }
    }

    res.status(200).send("successfully updated")
})

// delete a contact
app.delete('/api/blogs/:id', (req, res) => {
    let id = req.params.id

    let blogs = inMemoryData.blogs.find(e => e.id == id)
    if (!blogs) {
        res.status(400).send(`id:${id} delete a post!`);
        return
    }

    inMemoryData.blogs = inMemoryData.blogs.filter(e => e.id != id)

    res.status(200).send("successfully deleted")
})
app.listen(PORT, () => {
    console.log(`Serverdan privet on PORT ${PORT}`)
})