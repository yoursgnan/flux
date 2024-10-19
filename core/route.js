class Route{
    constructor(endpoint){
        this.endpoint = endpoint
        this.controllers = {
            get: null,
            post: null,
            put: null,
            delete: null,
        }
    }
    get(callback){
        this.controllers.get = callback
        return this
    }
    post(callback){
        this.controllers.post = callback
        return this
    }
    put(callback){
        this.controllers.put = callback
        return this
    }
    delete(callback){
        this.controllers.delete = callback
        return this
    }

}

module.exports = Route