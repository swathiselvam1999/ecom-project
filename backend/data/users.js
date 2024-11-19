import bcrypt from "bcrypt";

const users = [
    {
        name:"Admin user",
        email:"admin@gmail.com",
        password:bcrypt.hashSync("123456", 10),
        isAdmin:true
    },
    {
        name:"swathi",
        email:"swathi@gmail.com",
        password:bcrypt.hashSync("123456", 10),
        isAdmin:false
    },
    {
        name:"swa",
        email:"swa@gmail.com",
        password:bcrypt.hashSync("123456", 10),
        isAdmin:false
    }
]


export default users;