/**
 * Created by sushi on 18/09/17.
 */

export class TechnicalError extends Error{

    codeError:number;

    constructor(message:string){
        super(message);
    }
}