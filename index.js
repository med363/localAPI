const express=require('express')
const helmet=require('helmet')
const morgan = require('morgan')
const rfs = require("rotating-file-stream");
require('dotenv').config() // load variables from .env file

const res = require('express/lib/response')
const logger=require('./midelware')
const joi=require('joi')
const { urlencoded } = require('express')
const app=express()
// convetir les ndonee bson to json c'est une midelware
app.use(express.json())
//midelware url en coded
app.use(express.urlencoded())

//hlmet for secure data in header
app.use(helmet())
//morgan for log view log 
// app.use(morgan('tiny'))
// You can set morgan to log differently depending on your environment
// if (app.get('env') == 'production') {
//     app.use(morgan('common', { skip: function(req, res) { return res.statusCode < 400 }, stream: __dirname + '/../morgan.log' }));
//   } else {
//     app.use(morgan('dev'));
//   }


// create a log stream
// const rfsStream = rfs.createStream("log.txt", {
//     size: '10M', // rotate every 10 MegaBytes written
//     interval: '1d', // rotate daily
//     compress: 'gzip' // compress rotated files
//  })
 
//  // add log stream to morgan to save logs in file
//  app.use(morgan("tiny", {
//     stream: rfsStream
//  }));

 
// // another logger to show logs in console as well
// app.use(morgan("tiny"));
 
// MORGAN SETUP
// create a log stream
const rfsStream = rfs.createStream(process.env.LOG_FILE || 'log.txt', {
    size: process.env.LOG_SIZE || '10M',
    interval: process.env.LOG_INTERVAL || '1d',
    compress: 'gzip' // compress rotated files
 });
 
 // if log file defined then use rfs stream else print to console
 app.use(morgan(process.env.LOG_FORMAT || "dev", {
    stream: process.env.LOG_FILE ? rfsStream : process.stdout
 }));
 
 // if log file is defined then also show logs in console
 // else it will use the previous process.stdout to print to console
 if(process.env.LOG_FILE) {
    app.use(morgan(process.env.LOG_FORMAT || "dev"));    
 }
 


//on peut acceder a un fichier a travers url donc on va faire un midelware
app.use("/pub", express.static(__dirname + '/pub'));

//midrelware integrate in expressjs






//import midelware from externel module
// app.use(logger.log)








//midelware personalise
app.use((req,res,next)=>{
    console.log('login');
    next()
})










//midelware travail en mode synchronise on concederant l'ordre de midelware
app.use((req,res,next)=>{
    console.log('auth');
    next()
})















let courses = [
    {id:1,title:'js'},
    {id:2,title:'java'}
]
app.delete('/api/courses/:id',(req,res)=>{
    let course = courses.find(course => course.id=== parseInt(req.params.id))
    //delete course
    const i = courses.indexOf(course);
    courses.splice(i,1);
    
    //send
    res.status(204).send({});
})


app.get('/api/courses/',(req,res)=>{res.send(courses)})  


app.put('/api/courses/:id',(req,res)=>{
        
        //verify courses existe
        let course=courses.find(course=>{course.id===parseInt(req.params.id)
            if (!course)
            res.status(404).send('course not found !!!')
            else{
    res.send(course)
}
const {err,value} =ValidateCourses(req.body)

if(err){
    res.status(404).send(error.details[0].message)
}
//Modify
course.title = value.title
//send request
res.send(course)

})
})

app.post('/api/courses/',(req,res)=>{
    const {err,value} = ValidateCourses(req.body)
    if (err) {
        res.status(400).send(error.details[0].message)
    }
    let course = [
        {id:req.params.length+1},
        {title:req.body.title}
    ]
    courses=[...courses,course]
    res.send(courses)
})
app.get('/api/courses/:id',(req,res) =>
{
	let course = courses.find(course => course.id === parseInt(req.params.id))  //executer un callback se forme d'un function
	if(!course)
		res.status(404).send('course not found !!')
	else{
		res.send(course)
	}
})

const ValidateCourses=(course)=>{

    //validate course
    const schema = joi.object({
        title: joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required()})
return schema.validate(course)
}

const port = 3000
// const port=process.env.PORT || 3000
app.listen(port,(err)=>{
    if (err) console.log("Error in server setup");
    console.log(`server listen on ${port}`);
})