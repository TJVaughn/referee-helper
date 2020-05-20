const express = require('express')
const port = process.env.PORT
const path = require('path')

const app = require('./server/src/app')
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}
app.listen(port, () => {
    console.log("Server is listening on port: " + port)
})  