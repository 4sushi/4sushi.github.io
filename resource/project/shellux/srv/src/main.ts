/**
 * Created by sushi on 31/05/17.
 */

import {GameServer} from "./server/gameServer";
import {LOGGER} from "./server/logger";
try{
    let server = GameServer.bootstrap();
}
catch(e) {
    LOGGER.error(e.stack);

}