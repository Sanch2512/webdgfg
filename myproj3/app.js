const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 8000;
require('dotenv').config();
const app = express();
require('./db');
const Todo = require('./MODELS/Todo');

app.use(bodyParser.json());
app.use(cors());


app.get('/' , (req , res) => {
    res.send('API works')
});
app.get('/gettodos' , async(req, res) => {
    console.log("GET /gettodos hit");
    try {
        const alltodos = await Todo.find();
        res.json(alltodos);
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ message: "Server error" });
    }
} );
app.post('/addtodo' , async(req , res) => {
    const {task , completed} = req.body;
    const todo = new Todo({
        task , 
        completed
    })
    const savedTodo = await todo.save();
    res.json({
        message:'Todo saved successfully' , 
        savedTodo : savedTodo
    });
});
app.listen(PORT , () =>{
    console.log(`Server is listening on the port ${PORT}`);
});