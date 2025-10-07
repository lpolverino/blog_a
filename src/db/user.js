import prisma from "./prisma.js"

async function getUserById(userId){
    return prisma.user.findFirst({
        where:{
            id: userId
        },
        omit:{
            password:true,
        }
    }) 
};

async function getAllUsers() {
    return prisma.user.findMany({
        omit:{
            password:true,
        }
    });
}

async function createUser(email, password, name){
    return await prisma.user.create({
        data:{
            email:email,
            password:password,
            Name:name,
        }
    });
}

async function modifyUser(userId, name){
    return await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            Name:name
        }
    })
}

export default {
    getUserById,
    createUser,
    getAllUsers,
    modifyUser
};