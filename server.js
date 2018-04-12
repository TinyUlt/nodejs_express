var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

app.get('/index.htm', function (req, res) {
    res.sendFile( __dirname + "/" + "index.htm" );
})

app.get('/process_get', function (req, res) {

    // 输出 JSON 格式
    var response = {
        "first_name":req.query.first_name,
        "last_name":req.query.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
})

app.get('/d_*', function (req, res) {

     find(req.params['0'], req, res );
})
app.post('/process_post', urlencodedParser, function (req, res) {

    // 输出 JSON 格式
    var response = {
        "first_name":req.body.first_name,
        "last_name":req.body.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
})
app.post('/d_*', urlencodedParser, function (req, res) {

    find(req.params['0'], req, res );
})
const moment = require('moment');

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://root:TinyUlt920805@47.52.225.13:27017/huobi?authSource=admin';
var dbase;
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log('Connected correctly to server.');
    dbase = db.db("huobi");
    // dbase.createCollection('site', function (err, res) {
    //     assert.equal(null, err);
    //     console.log("创建集合!");
    //     db.close();
    // });
});
function getDateString(){
    var today=new Date();
    return today.getFullYear()+"_" + (today.getMonth() + 1) + "_" + today.getDate();
}
function getDataValue(){
    var today=new Date();
    return today.valueOf();
}

function find(pathName, req, response){

    var query = {};
    let startTime =parseInt(req.query.startTime);
    let endTime =parseInt( req.query.endTime);
    dbase.collection("g"). find({_id:{$gte:startTime,$lte:endTime}, [pathName]:1 }).project({_id:1, btc:1, usd:1, usdt:1,usdtbuy:1, btcminamount:1,btcminvol:1, btcmincount:1 }).sort({_id:1}).toArray(function(err, result) { // 返回集合中所有数据
        if (err) throw err;

        // response.writeHead(200, {"Content-Type": "text/plain"});
        // response.write(JSON.stringify(result));
        response.end(JSON.stringify(result));
    });
}
var server = app.listen(80, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port)

});