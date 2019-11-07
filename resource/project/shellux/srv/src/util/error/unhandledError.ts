/**
 * Created by sushi on 01/06/17.
 */


export class UnhandledError extends Error{

    codeError:number = -1;
    initialError:Error;

    constructor(initialError:Error){
        super("Unhandled error... Sorry... ");
        this.initialError = initialError;
    }
}