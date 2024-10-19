const Flux = require('./flux')

const app = new Flux()

const helloRoute = app.route('/hello')

helloRoute.get((req,res)=>{
    res.end('Hello World')
}).post((req,res)=>{
    res.json(req.query)
})

app.start(3000,()=>{
    console.log('server started on port 3000')
})