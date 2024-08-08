class APIError extends Error{
    constructor(
        statusCode,
        message="Something Went wrong",
        errors=[],
        stack=""
    ){
        super(message);
        this.statusCode=statusCode;
        this.data=null;//read more about it
        this.message=message;
        this.success=false;
        this.errors=errors;

        if(stack){  // ignore this code for now.
            this.stack=stack;
        }else{
            Error.captureStackTrace(this,this.constructor);
        }

    }
}

export {APIError};