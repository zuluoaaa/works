'use strict'

const pending = 1;
const fulfilled = 2;
const rejected = 3;

function resolve(self) {

    return function (success) {
        if(self.state === pending){
            self.state = fulfilled;
        }
        self.value = success;

        self.onFulfilledCallbacks.map((item)=>{
            item(self.value);
        })
    }
}

function reject(self) {

    return function (error) {
        self.state = rejected;
        self.error = error;

        self.onRejectedCallbacks.map((item)=>{
            item(self.error);
        })
    }
}

class Promise{

    constructor(excutor){
        this.state = pending;
        this.error = null;
        this.value = null;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];


        try {
            excutor(resolve(this),reject(this));
        }catch (e){
            this.error = e;
            this.onRejectedCallbacks.map((item)=>{
                item(this.error);
            })
        }

        return this;
    }

    catch(callback){
        this.onRejectedCallbacks.push(callback);
        if(this.state === fulfilled){
            setTimeout(()=>{callback(this.value)},0)
        }

        return this;
    }

    then(callback){
        this.onFulfilledCallbacks.push(callback);
        if(this.state === rejected){
            setTimeout(()=>{callback(this.error);},0)
        }
        return this;
    }

}


