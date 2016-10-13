var methodOverride = require('method-override'),
    bodyParser     = require('body-parser'),
    mongoose       = require('mongoose'),
    morgan         = require('morgan'),
    express        = require('express'),
    app            = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  mongoose.connect(process.env.MONGO);
};

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('combined'));

var TodoSchema = new mongoose.Schema({
    content: String,
    created: {type: Date, default: Date.now},
    complete: {type: Boolean, default: false}
});

var Todo = mongoose.model('Todo', TodoSchema);

var ListSchema = new mongoose.Schema({
    listTitle: String
});

var List = mongoose.model('List', ListSchema);

app.get('/',function(req,res){
    Todo.find({}, function(err,allTodos){
        if (err) {
            console.log(err);
        } else {
            List.find({}, function(err,allLists){
                if (err) {
                    console.log(err);
                } else {
                    res.render('index', {lists: allLists, todos: allTodos});
              }
          });
        }
    });
});

app.post('/todos', function(req, res){
    Todo.create(req.body.todo, function(err, newTodo){
        if(err) {
          console.log(err);
        } else {
          res.redirect('/')
        }
    });
});

app.delete('/todos/:id', function(req, res){
  Todo.findByIdAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.put('/todos/:id', function(req, res) {
  Todo.findByIdAndUpdate(req.params.id, { $set: {complete: JSON.parse(req.body.complete)}}, function(err, todo){
    if(err){
      console.log(err);
    } else {
      res.send(todo);
    }
  });
});

app.post('/list', function(req, res) {
  List.create({listTitle: req.body.title}, function(err, list) {
    if(err){
      console.log(err);
    } else {
      res.send(list);
    }
  })
})

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function(){
    console.log("serve's up fool");
});
