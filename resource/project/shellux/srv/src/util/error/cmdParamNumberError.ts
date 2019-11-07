import {GameError} from "./gameError";
/**
 * Created by sushi on 17/05/17.
 */

export class CmdParamNumberError extends GameError{

    constructor(){
        super("Incorrect parameter number");
        this.codeError = 1;
    }
}