const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist'));

app.listen(3000, () => console.log('Example app listening on port 3000!'))

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));

});

console.log('Server is running');