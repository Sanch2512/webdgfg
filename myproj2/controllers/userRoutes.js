const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname , '../UserDataBase.json');

function readDataFromFile() {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
}
function writeDataToFile(data) {
   fs.writeFileSync(dataFilePath , JSON.stringify(data , null , 2));
}
router.get('/users' , (req , res) => {
    const users = readDataFromFile();
    res.send(users);
});
router.get('/users/:id' , (req , res) => {
    const users = readDataFromFile();
    const userId = req.params.id;

    const user = users.find(user => user.id === parseInt(userId));
    if(user)
    {
        res.send(user);
    }
    else{
        res.status(404).send({
            error:'User Not Found!'
        })
    }
});
router.get('/users/name/:name', (req, res) => {
    const users = readDataFromFile();
    const username = decodeURIComponent(req.params.name).toLowerCase().trim();

    const user = users.find(u => u.name.toLowerCase().trim() === username);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User Not Found!' });
    }
});
router.post('/users' , (req , res) => {
    const user = req.body;
    const users = readDataFromFile();
    user.id = new Date().getTime();
   // console.log('user' , user);
   users.push(user);
   writeDataToFile(users);
    res.send(users);
})
router.put('/users/:id' , (req , res) => {
    const users = readDataFromFile();
    const userId = req.params.id;
    const updateUser = req.body;
    const userIndex = users.findIndex(user => user.id === parseInt(userId));
    console.log('userIndex' , userIndex);
    if(userIndex === -1)
    {
        return res.status(404).send({
            error : 'User Not Found'
        });
    }
    users[userIndex] = {
        ...users[userIndex] , 
        ...updateUser 
    };
    writeDataToFile(users);
    res.send(users[userIndex]);
});
router.delete('/users/:id' , (req , res) => {
    const users = readDataFromFile();
    const userId = req.params.id;
    const userIndex = users.findIndex(user => user.id === parseInt(userId));
    if(userIndex === -1)
        {
            return res.status(404).send({
                error : 'User Not Found'
            });
        }
    users.splice(userIndex , 1);
    writeDataToFile(users);
    res.send({
        message: `User with id ${userId} has been deleted`
    });
});
router.get('/test' , (req , res) => res.send({
    message : 'Test is working',
    path : dataFilePath
}));

module.exports = router;