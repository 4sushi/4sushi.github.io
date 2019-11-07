
import DATABASE from "../database/dataBase";
import * as express from "express";
import * as http from "http";
import * as socketIo from "socket.io";
import * as session from "express-session";
import * as helmet from "helmet"; // Security HTTP

import { LOGGER } from './logger' ;
import { MainController } from '../controller/mainController' ;
import {ResponseGame} from "../exchange/responseGame";
import {Profile} from "./profile";
import DATA from "./data";
import Server = SocketIO.Server;
import {NotificationSocket} from "./notificationSocket";


const PORT = 8080;


export class GameServer {

    public app: any;
    private server: any;
    private io: Server;
    private port: number;
    private mainController: MainController;
    public notification:NotificationSocket;

    // key : idSession value : profile
    public profiles:Map<string,Profile>  = new Map();

    public static async bootstrap():Promise<GameServer>{
        let server:GameServer =  new GameServer();
        await server.run();
        return server;
    }

    constructor() {

    }

    public async run():Promise<void>{
        await this.connectDatabase(); // TODO
        this.createApp();
        this.session();
        this.security();
        this.config();
        this.createServer();
        this.sockets();
        await this.initData(); // TODO
        this.listen();
        this.mainController = new MainController(this);
    }

    private createApp(): void {
        this.app = express();
    }

    private session(): void{
        this.app.use(session({
            secret: 'fghmriegnkdlfngzpekgnrejnglkefnpzgernhnerrggdfgee',
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false }
        }))
    }

    private security(): void{
        this.app.use(helmet());
    }

    private createServer(): void {
        this.server = http.createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || PORT;
    }

    private async connectDatabase():Promise<void>{
       await DATABASE.connect();
    }

    private async initData():Promise<void>{
        await DATA.init();
    }

    private sockets(): void {
        this.io = socketIo(this.server);
        this.notification = new NotificationSocket(this.io);
    }


    private listen(): void {

        this.server.listen(this.port, () => {
            LOGGER.info('Connected client on port %s.', this.port);
        });

        this.io.on('connect', (socket: any) => {

            // add new profile on client connection
            let profile:Profile = new Profile();
            profile.socketID = socket.id;
            this.profiles.set(socket.id, profile);

            socket.on('cmd', (data: string, callback:any) => {
                let profil:Profile = this.profiles.get(socket.id);
                this.evtCmd(data, profil).then((resp:ResponseGame)=>{
                    callback(resp);
                });
            });
            socket.on('disconnect', () => {
                this.evtDisconnect();
                let profile:Profile = this.profiles.get(socket.id);
                this.mainController.accountController.accountService.logout(profile).then(()=>{
                    profile = null;
                    this.profiles.delete(socket.id);
                });
            });
        });

    }

    public async evtCmd(data: any, profil:Profile):Promise<ResponseGame>{
        let resp:ResponseGame = await this.mainController.newCommand(data, profil);
        return resp;
    }


    private evtConnection(socket: any){

    }

    private evtDisconnect(){

    }


}

