//instead of using a database I use a simple array to track what users are in a room and how this state changes.
const users = [];

const addUser = ({id, name, room}) => {
    //to have a specific format: from John Koukoulakis to johnkoukoulakis
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //to check if a user with the same name exists in the same room
    const existingUser = users.find((user) => user.room === room && user.name === name);
    //if truthy returns an error object and exits addUser function
    if(!name || !room) return {error: 'Username and room are required'};
    if(existingUser) return { error: 'Username is already taken'};
    //else adds an object with all the parameters in the users array and exits
    const user = { id, name, room };

    users.push(user);
    console.log(user)
    return {user};
};

const removeUser = (id) => {
    //finds where is the user with the id we are looking for
    //and if it's inside the array we remove the user onject from the array
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };