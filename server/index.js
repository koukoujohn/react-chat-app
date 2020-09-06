const express = require('express');
//Note. For anything that is real time it's a good idea to use sockets because http or https is too slow.
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');
const router = require('./router');
const { use } = require('./router');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
    socket.on('join', ({ name , room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });

        if(error) return callback(error);
        
        socket.join(user.room);
        //shows this message when user logs in.
        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}.` });
        //shows this message to everyone else in the room except this socket's user.
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!`});
        
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });


        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message});

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
        }       
    });
});



const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server has started on port ${port}`));
