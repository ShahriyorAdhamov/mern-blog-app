const PostModel = require('../models/post');

const create =async (req, res) => {
    try{
        const doc = new PostModel({
            user: req.userId,
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags 
        })
    
        const post = await doc.save();
        res.json(post);
    } catch(err) {
        res.status(500).json({
            message: 'Не удалось создать статью'
        })
    }

}

const getAll = (req, res) => {
    try{
        const posts = PostModel.find().populate('user').exec();
        res.json(posts)
    } catch(err) {
        res.status(500).json({
            message: 'Не удалось получить статьи'
        })
    }
}
const getOne = (req, res) => {
    try{
        const postId = req.params.id
        const post = PostModel.findById({
            _id: postId
        })
        if(!post) {
            return res.status(404).json({
                message: 'Статья не найдена'
            })
        }
        res.json(post)
    } catch(err) {
        res.status(500).json({
            message: 'Не удалось получить статью'
        })
    }
}
const remove = (req, res) => {
    try{
        const postId = req.params.id
        PostModel.findByIdAndRemove({
            _id: postId
        }, (err, doc) => {
            if(err) {
                return res.status(500).json({
                    message: 'Не удалось удалить статью'
                })
            }
            if(!doc) {
                return res.status(404).json({
                    message: 'Статья не найдена'
                })
            }
            res.json({
                success: true
            })
        })
    } catch(err) {
        res.status(500).json({
            message: 'Не удалось получить статью'
        })
    }
}
const update = (req, res) => {
    try{
        const postId = req.params.id
        PostModel.findByIdAndUpdate({
            _id: postId
        },
        {
            user: req.userId,
            title: req.body.title,
            description: req.body.description,
            tags: req.body.tags 
        });
        res.json({
            success: true
        })
    } catch(err) {
        res.status(500).json({
            message: 'Не удалось обновить статью'
        })
    }
}

module.exports = {create, getAll, getOne, remove, update}