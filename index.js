const express = require('express');
const mongoose = require('mongoose');
const {authValidation} = require('./validations/auth.js');
const checkAuth = require('./utils/checkAuth.js');
const userController = require('./controllers/user.js')
const cors = require('cors')
const app = express();

app.use(express.json())
app.use(cors())
mongoose.connect('mongodb+srv://shahriyoradhamov000:Shahriyor2004@cluster0.fpreico.mongodb.net/mern-blog-app?retryWrites=true&w=majority')
.then(() => {
    console.log('db ok')
})



app.post('/auth/register', authValidation, userController.register )
app.post('/auth/login', authValidation, userController.login )

app.get('/auth/me', checkAuth, userController.getMe)





app.listen(3002, (err) => {
    if(err) {
        console.log(err);
    }
    console.log('server ok')
})