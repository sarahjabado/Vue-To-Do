var sqlite3 = require('sqlite3').verbose();
var ws = require('ws').Server;
var server = new ws({port: 9001}); // see `ws` docs for other options
var db = new sqlite3.Database('./database.sqlite');

try {
  db.serialize(function () {
    'use strict';

    console.log('Creating database if it doesn\'t exist.');
    db.run("CREATE TABLE if not exists items (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, done BOOL, ticket TEXT)");
    console.log('Done!');

  });
} catch (e) { }

console.log('Starting server...');
server.on('connection', function (socket) {
  console.log('New connection');
  socket.send('Ayy-Okay!');
  socket.on('message', function (data) { processData(data, socket); });
  socket.on('close', function () { });
  socket.on('error', function (err) { console.log(err); });
});
console.log('Server started on port 9001.');

function newItem(item) {
  var sql = db.prepare("INSERT INTO items VALUES (?, ?, ?, ?)");
  sql.run(item.id, item.text, item.done, item.ticket);
  let resp = new Promise((success, reject) => {
    try {
      sql.finalize();
      fetchLastItem().then((res) => {
        success(res);
      });
    } catch (e) {
      reject(e);
    }
  });
  return resp;
  // resp.then((res) => {
  //   return res;
  // }).catch((e) => {
  //   return false;
  // });
}

function fetchLastItem() {
  var prom = new Promise((success, fail) => {
    try {
      db.all("select * from items order by id desc limit 1", (err, rows) => {
        success(rows); 
      });
    } catch (e) {
      fail(e);
    }
  });
  return prom;
}

function fetchItems() {
  var prom = new Promise((success, fail) => {
    try {
      const result = [];
      db.all("select * from items where done = 0", (err, rows) => {
        console.log(rows);
        if (rows.length === 0) {
          fail('No results.');
        }
        success(rows);
      });
    } catch (e) {
      fail(e);
    }
  });
  return prom;
}

function selectItem(id) {
  var results = [];
  db.each("SELECT * FROM items where id = (?)", id, function (err, row) {
    results.push(row);
  });
  return results;
}

function completeItem(item) {
  var sql = db.prepare("UPDATE items SET done = 1 where id = (?)");
  sql.run(item.id);
  sql.finalize();
}

function processData(data, socket) {
    data = JSON.parse(data);
    console.log('Received', data.request);
    var response = null;
    switch (data.request) {
    case "FETCH_ALL":
      fetchItems().then((res) => {
        console.log('Res', res);
          const response = {
            success: true,
            type: "FETCH_ALL",
            items: res
          };
          console.log("Sending", JSON.stringify(response));
          socket.send(JSON.stringify(response));
        }).catch((r) => {
          console.log(r);
          const response = {
            success: false,
            type: "FETCH_ALL",
            items: []
          };
          console.log("Sending", JSON.stringify(response));
          socket.send(JSON.stringify(response));
        });
        break;
    case "FETCH":
        response = {
            success: true,
            type: "FETCH",
            item: selectItem(data.itemId)
        };
        socket.send(JSON.stringify(response));
        break;
    case "INSERT":
      const result = newItem(data.item);
      result.then((res) => {
        if (res.length === 1) {
          response = {
            success: true,
            type: "INSERT",
            item: res[0]
          };
        } else {
          response = {
            success: false,
            type: "INSERT",
            item: null
          };
        }
        console.log('Sending', JSON.stringify(response));
        socket.send(JSON.stringify(response));
      })
        break;
      case "COMPLETE":
        completeItem(data.item);
        response = {
          success: false,
          type: "COMPLETE",
          item: data.item
        };
        console.log('Sending', JSON.stringify(response));
        socket.send(JSON.stringify(response));
          break;
    default:
        socket.send('{"success": "false"}');
        break;
    }
}