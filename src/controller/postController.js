import postdb from "../db/post.js"
import userdb from "../db/user.js"

import { body, param, validationResult } from "express-validator";
import NotFoundError from "../errors/NotFoundError.js";

const validatePostId = [
    param("postId")
        .isNumeric()
        .withMessage("Invalid postId")
]

const validatePost = [
    body("title")
        .trim()    
        .optional()
        .isAlphanumeric()
        .isLength({min:1, max:255})
        .withMessage("invalid Title"),
    body("content")
        .trim()
        .optional()
        .isAlphanumeric()
        .isLength({min:1})
        .withMessage("invalid content"),
    body("image")
        .trim()
        .optional()
        .isURL()
        .withMessage("invalid image url"),
    body("authorId")
        .trim()
        .isNumeric()
        .optional()
        .withMessage("Invalid user Id")
]

const getPost = [
    validatePostId,
    async (req,res) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                title: "Get Post", errors: errors.array()
            })
        }
        const postId = parseInt(req.params.postId,10);

        try{
            const post = await postdb.getPost(postId)
            
            if(!post){
                throw new NotFoundError("Post not found");
            }
            
            return res.json(post)
        }catch(err){
            console.error(err);
            return res.status(500).send("Internal server error");
        }
    }    
]

const getAllPosts = [
    async (req,res) =>{
        try{
            const posts = await postdb.getAllPosts();
            return res.json(posts);
        }catch(err){
            console.error(err);
            return res.status(500).send("Internal server error");
        }
    }
]

//There is no admin/user distinction
const createPost = [
    validatePost,
    async (req,res) =>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                title: "Create Post", errors: errors.array()
            })
        }
        try{
            const userId = parseInt(req.body.userId,10);
            if(isNaN(userId)) {
                throw new NotFoundError("User not found");
            }
            const user = await userdb.getUserById(userId);
            if(!user){
                throw new NotFoundError("User not found");
            }
            const {title,content, image} = req.body;
            
            if (typeof title === 'undefined' 
                ||  typeof content === 'undefined'
                ||  typeof image === 'undefined'
            ) {
                throw new MalformedPostError(title, content, image)
            }
            
            const newPost = {
                title, content,image,
                authorId: userId
            }
            const post = await postdb.createPost(newPost);
            return res.json({post});

        }catch(err){
            console.error(err);
            return res.status(500).send("Internal server error")
        }
    }
]

const updatePost = [
    validatePostId,
    validatePost,
    async (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                title: "Get Post", errors: errors.array()
            })
        }
        try{
            const postId = parseInt(req.params.postId,10);
            const post = await postdb.getPost(postId);
            if(!post) {
                throw new NotFoundError("Post not found");
            }

            const newPost = {
                title: req.body.title || post.title,
                content: req.body.content || post.content,
                image: req.body.image || post.image,
            }

            await postdb.updatePost(postId, newPost)

            return res.json({post})

        }catch(err){
            console.error(err);
            return res.status(500).send("Internal server error");
        }
    }
]

const deletePost = [
    validatePostId,
    async (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                title: "Get Post", errors: errors.array()
            })
        }
        try{

            const postId = parseInt(req.params.postId,10);
            const post = await postdb.getPost(postId)
            if(!post){
                throw new NotFoundError("Post not found")
            }
            await postdb.deletePost(postId)
            return res.status(201).send("Post deleted sucefully");
        }catch(err){
            console.error(err);
            return res.status(500).send("Internal server error");
        }
    }
]

export default {
    getPost,
    getAllPosts,
    createPost,
    updatePost,
    deletePost
}