var http = require('http')
const url = require('url')

const Route = require('./core/route')


class Flux{
    constructor(){
        this.routes = {}
    }
    route(endpoint){
        const route_object = new Route(endpoint)
        this.routes[endpoint] = route_object
        return route_object
    }
    addCustomMethods(req,res){
        let url_parse = url.parse(req.url,true)
        req.query = url_parse.query
        req.pathname = url_parse.pathname

        // add send method and json method to communicate in json and set content type application/json automatically
        res.send = function(value,...args){
            if(typeof value == typeof 'string'){
                res.writeHead(this.statusCode || 200, { 'Content-Type': 'text/plain' });
                res.end(value)
            }
            else if(value instanceof Object){
                res.writeHead(this.statusCode || 200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(value));
            }
            
        }
        res.json = function(value,...args){
            res.writeHead(this.statusCode || 200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(value));
        }

        res.status = function(statusCode){
            this.statusCode = statusCode
            return res
        }

    }
    start(port, callback) {
        const server = http.createServer((req, res) => {
            this.addCustomMethods(req,res)
            
            const route = this.routes[req.pathname];

            if (route) {
                const method = req.method.toLowerCase();
                
                if (route.controllers[method]) {
                    try {
                        route.controllers[method](req, res);
                    } catch (error) {
                        res.status(500).json({ error: 'Internal Server Error', message: error.message });
                    }
                } else {
                    res.status(405).send(`${req.method} method not allowed/defined for ${req.url}`);
                }
            } else {
                res.status(404).send(`404 Not Found: ${req.url}`);
            }
        });

        server.listen(port, callback);
    }
}

module.exports = Flux