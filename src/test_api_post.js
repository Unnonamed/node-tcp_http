//바디 이슈 해결필요
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

function http_request() {
  const options = {
    hostname: '192.168.10.14',
    port: 7579,
    path: '/-----/gateway/catm1',
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'X-M2M-RI': '12345',
        'X-M2M-Origin': 'SOrigin',
        'Locale': 'en',
        'Content-Type': 'application/vnd.onem2m-res+json; ty=4'
    },
    body: {
        'm2m:cin': {'con':'0'}
      }
  };
  // var url = 'http://graph.facebook.com/517267866/?fields=picture';
  // http.get(url, function(res){
  
  const req = http.request(options, function(res) {
      var body = '';
      
    res.on("data", function(chunk) {
      body += chunk;
    });
  
    res.on("end", function() {
      const fbResponse = JSON.parse(body);
      console.log("Got a response: ", fbResponse);
    });
  
    res.on("error", function(error) {
      console.error(error);
    });
  
  });
  
  req.end();
}

http_request()

