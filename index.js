const express = require('express');
const mongoose = require('mongoose');
const {authValidation, loginValidation} = require('./validations/auth.js');
const {postValidation} = require('./validations/post.js');
const checkAuth = require('./utils/checkAuth.js');
const userController = require('./controllers/user.js');
const postController = require('./controllers/post.js');
const cors = require('cors');
const multer = require('multer');
const handleValidationErrors = require('./utils/handleValidationErrors.js')
const app = express();
mongoose.set('strictQuery', true)
app.use('/uploads', express.static('uploads'))
app.use(express.json());
app.use(cors());
//global mongodb
//'mongodb+srv://shahriyoradhamov000:Shahriyor2004@cluster0.s06zczi.mongodb.net/mern-blog?retryWrites=true&w=majority'

mongoose.connect('mongodb://127.0.0.1:27017/blog')
.then(() => {
    console.log('db ok')
}). catch((err) => {
    console.log(err)
})

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
});
const upload = multer({storage})



//auth
app.post('/auth/register',authValidation,  handleValidationErrors,userController.register );
app.post('/auth/login', loginValidation,  handleValidationErrors, userController.login );
app.get('/auth/me', checkAuth, userController.getMe);


//posts
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `uploads/${req.file.originalname}`
    })
})
app.get('/tags', postController.getLastTags);
app.post('/posts', checkAuth,  postValidation,  handleValidationErrors, postController.create);
app.get('/posts', postController.getAll);
app.get('/posts/:id', postController.getOne );
app.delete('/posts/:id', postController.remove);
app.patch(`posts/:id`, checkAuth,  postValidation,  handleValidationErrors, postController.update)




app.listen(3002, (err) => {
    if(err) {
        console.log(err);
    }
    console.log('server ok')
});