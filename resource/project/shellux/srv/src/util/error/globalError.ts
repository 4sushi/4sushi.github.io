import {GameError} from "./gameError";
/**
 * Created by sushi on 17/05/17.
 */

export class GlobalError extends GameError{

    constructor(message:string){
        super(message);
        this.codeError = 0;
    }
}