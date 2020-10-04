const users = []
const rooms = ['covid', 'covid19']

//add user
const addUser = ({ id, username, room}) =>{
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    if(!username || !room){
        return {
            error: 'Username and room are required!'
        }
    }
    //check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })
    if(existingUser){
        return {
            error: 'Username is in use!'
        }
    }
    //store user
    const user = {id, username, room}
    users.push(user)
    rooms.push(user.room)
    return {
        user
    }
}

//remove user

const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

//getuser
const getUser = (id)=>{
    return users.find((user)=>{
        return user.id === id
    })
}

//getusersinroom
const getUsersInRoom = (room) =>{
    return users.filter((user)=>{
        return user.room === room
    })
} 
const getAllRooms = ()=>{
    return rooms
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getAllRooms
}