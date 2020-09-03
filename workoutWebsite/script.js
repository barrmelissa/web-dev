var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);

var request     = require('request');
var parse       = require('body-parser');

app.use(parse.urlencoded({extended: true}));
app.use(parse.json());


app.get('/editPage', loadEditPage);

function loadEditPage(req, res, next){
        var SQLString   =       "SELECT * FROM workoouts WHERE id = " + req.params.id;
        mysql.pool.query(SQLString, function(err, result){
                if(err){
                        next(err);
                        return;
                }
                var editContext = {};
                editContext.dataList = result;
                res.render('editPage', editContext);
        });
}
app.post('/', postFunction);
function postFunction(req,res){
        var pDate;
        var lbsKg       =       (req.body.WChoice == "lbs");
        if(req.body.WWeight == ""){
                req.body.WWeight = "NULL";
        }
        if(req.body.WDate == ""){
                req.body.WDate = "NULL";
        }
        else{
                pDate = "'" + req.body.WDate + "'";
        }
        if(req.body.WReps == ""){
                req.body.WReps = "NULL";
        }
        var SQLString = 'INSERT INTO workouts(WName, WReps, WWeight, WDate, WChoice) VALUES ("' + req.body.WName + '", ' + req.body.WReps + ', ' + req.body.WWeight + ', ' + pDate + ', ' + lbsKg + ')';
        mysql.pool.query(SQLString, function(err, result){
                if(err){
                        next(err);
                        return;
                }
        });
        res.send("Added new Row.");

        var uParam = [];
        for(var x in req.query){
                uParam.push({'value':req.query[p]})
        }
        var context = {};
        context.dataList = uParam;
        res.render('home', context);

        }

app.get('/',function(req,res,next){
  var context = {};
  var createString = "CREATE TABLE diagnostic(" +
  "id INT PRIMARY KEY AUTO_INCREMENT," +
  "name VARCHAR(255) NOT NULL)";

mysql.pool.query('DROP TABLE IF EXISTS diagnostic', function(err){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query(createString, function(err){
      if(err){
        next(err);
                return;
      }
          mysql.pool.query('INSERT INTO diagnostic (`text`) VALUES ("MySQL is Working!")',function(err){
            mysql.pool.query('SELECT * FROM diagnostic', function(err, rows, fields){
                  context.results = JSON.stringify(rows);
                  res.render('home',context);
                });
          });
    });
  });
});



app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});