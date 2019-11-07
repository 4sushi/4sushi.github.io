import {GameError} from "./gameError";
/**
 * Created by sushi on 20/09/17.
 */

export class CmdParamTypeError extends GameError{

    constructor(){
        super("Incorrect parameter type");
        this.codeError = 1;
    }
}