import prisma from "./prisma.js"

async function getPost(postId){
    return prisma.post.findFirst({
        where:{
            id:postId
        },
        include:{
            author:{
                select:{
                    Name:true
                }
            }
        }
    })
}

async function getAllPosts(){
    return prisma.post.findMany({
        include:{
            author:{
                select:{
                    Name:true,
                }
            }
        }
    });
}

async function createPost(post) {
    return prisma.post.create({
        data:{
            title: post.title,
            content: post.content,
            image: post.content,
            authorId: post.authorId
        }
    })    
}

async function updatePost(postId, newPost) {
    return prisma.post.update({
        where:{
            id:postId
        },
        data:{
            title: newPost.title,
            content: newPost.content,
            image: newPost.image
        }
    })
}

async function deletePost(postId) {
    return prisma.post.delete({
        where:{
            id: postId
        }
    })    
}

export default {
    getPost,
    getAllPosts,
    createPost,
    updatePost,
    deletePost
}