import prisma from "./prisma.js"

async function getUserById(userId){
    return prisma.user.findFirst({
        where:{
            id: userId
        }
    }) 
};

async function createUser(email, password){
    return await prisma.user.create({
        data:{
            email:email,
            password:password,
            Name:"",
        }
    });
}

export default {
    getUserById,
    createUser
};