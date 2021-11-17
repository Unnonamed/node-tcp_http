const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

//////////////////////////app/////////////////////////////
var app = express(); // express 엔진 선언

app.use(bodyParser.urlencoded({ extended: false })); // url 인코딩 설정
app.use(bodyParser.json()); // json 데이터 수집 설정

today = getCurrentDate();

setInterval(() => {
    //str = Math.random().toString(36).substr(2, 11); // "0.twozs5xfni"
    str = makeid(30)
    today = getCurrentDate()
}, 1000);

//SyntaxError: Block-scoped declarations (let, const, function, class)
//you should change let -> var
let req_cnt = 0; 

app.get('/e-IoT_GATEWAY', function (req, res) {
  var data = {
    'type': 'string',
    'string': [today, str],
    'm2m:cin':{'con':req_cnt.toString()}
    };
    console.log(req.url.toString())
    console.log(data);
    res.json(data);
});


var server = http.createServer(app);

server.listen(process.env.PORT || 5000, function () {
    console.log(`port [ ${server.address().port} ] Server Startup.. `);
    console.log('hello ')
})

// http.createServer(app).listen(process.env.PORT || 5000, function () {
//   console.log(`5000 port Server Startup..`);
//   console.log('hello ')
// })

server.on('connection', function(socket){
    var addr = socket.address();
    console.log('connect client : %s, %d', addr.address, addr.port);
})

server.on('request', function(req, res){
    console.log('request call client.');
    req_cnt = req_cnt + 1;
})











function getCurrentDate()
{
    var date = new Date();
    var year = date.getFullYear().toString();

    var month = date.getMonth() + 1;
    month = month < 10 ? '0' + month.toString() : month.toString();

    var day = date.getDate();
    day = day < 10 ? '0' + day.toString() : day.toString();

    var hour = date.getHours();
    hour = hour < 10 ? '0' + hour.toString() : hour.toString();

    var minites = date.getMinutes();
    minites = minites < 10 ? '0' + minites.toString() : minites.toString();

    var seconds = date.getSeconds();
    seconds = seconds < 10 ? '0' + seconds.toString() : seconds.toString();

    return year + month + day + hour + minites + seconds;
}

function makeid(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}