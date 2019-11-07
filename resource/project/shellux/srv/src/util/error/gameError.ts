/**
 * Created by sushi on 17/05/17.
 */

export abstract class GameError extends Error{

    codeError:number;

    constructor(message:string){
        super(message);
    }
}