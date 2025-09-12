class MalformedPostError extends Error{
    constructor(title, content, image){
        super(`The recigin post has the values\ntitle:${title}\ncontent:${content}\nimageUrl:${image}`)
        this.statusCode = 403;
        this.Name = "MalformedPostError"
    }
}