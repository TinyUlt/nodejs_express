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
    let btc_enable = req.query.btc_enable;
    let btcamout_enable = req.query.btcamout_enable;
    let usdt_enable = req.query.usdt_enable;

    console.log(btc_enable);
    console.log(btcamout_enable);
    console.log(usdt_enable);
    let project = {};
    project["_id"] = 1;
    if(btc_enable == 1){
        console.log("btc_enable");
        project["btc"] = 1;
        project["aveUsdt"] = 1;
    }
    if(btcamout_enable == 1){
        console.log("btcamout_enable");

        project["btcminamount"] = 1;
        project["btcminvol"] = 1;
        project["btcmincount"] = 1;
    }
    if(usdt_enable == 1){
        console.log("usdt_enable");

        project["usd"] = 1;
        project["usdt"] = 1;
        project["usdtbuy"] = 1;
    }
    dbase.collection("g"). find({_id:{$gte:startTime,$lte:endTime}, [pathName]:1 }).project(project).sort({_id:1}).toArray(function(err, result) { // 返回集合中所有数据
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