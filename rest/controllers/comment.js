import Comment from "../models/Comment.js";
import Article from "../models/Article.js";

// TODO::CREATE COMMENT CONTROLLER
export const createComment = async (req, res, next) => {
    const articleId = req.params.articleId;
    const usernameId = req.params.userId;
    const { content } = req.body;
    const comment = new Comment({
        content,
        date: Date.now(),
        username: usernameId
    });

    try {
        const savedComment = await comment.save();
        try {
            await Article.findByIdAndUpdate(articleId, { $push: { comments: savedComment._id } });
        } catch (error) { next(error); }
        res.status(201).json({ message: 'Comment saved successfully' });
    } catch (error) { next(error); }

}

// TODO::UPDATE COMMENT CONTROLLER
export const updateComment = async (req, res, next) => {
    
    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.id, 
            { $set: {content: req.body.content, date: Date.now()} }, 
            { new: true }
        )
        res.status(201).json(updatedComment)
    } catch (error) { next(error) }
}

// TODO::DELETE COMMENT CONTROLLER
export const deleteComment = async (req, res, next) => {
    const articleId = req.params.articleId;

    try {
        await Comment.findByIdAndDelete(req.params.id)
        try {
            await Article.findByIdAndUpdate(articleId, { $pull: { comments: req.params.id } });
        } catch (error) { next(error); }
        res.status(201).json("Comment has been deleted!")
    } catch (error) { next(error) }
}

// TODO::GET COMMENT CONTROLLER
export const getComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id)
        res.status(201).json(comment)
    } catch (error) { next(error) }
}

// TODO::GET ALL COMMENT CONTROLLER
export const getAllComments = async (req, res, next) => {
    const usernameId = req.params.userId;

    try {
        const comments = await Comment.find({username: usernameId})
        res.status(201).json(comments)
    } catch (error) { next(error) }
}