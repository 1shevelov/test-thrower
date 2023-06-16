// import { IocContext } from "power-di";
import * as Stats from "stats.js";
import { SceneNames } from "../enums/Scenes";
// import { PopupService } from "../services/PopupService";
// import { ForegroundView } from "../views/ForegroundView";
import { UIView } from "../views/UIView";
import { PlayerController } from "../components/PlayerController";
import { Grenade } from "../components/Grenade";
import { Enemy } from "../components/Enemy";

// sent by Grenade to Enemy
export interface IBlastResult {
    x: number;
    y: number;
    radius: number;
    maxDamage: number;
}

export enum GameEvents {
    GrenadeBlasted = "GrenadeBlasted",
    GrenadeReady = "GrenadeReady",
    EnemyReady = "EnemyReady",
    // EnemyDied = "EnemyDied",
}

enum GameStates {
    NotReady, // game is not ready
    Ready, // listening for player input
    Hold, // holding grenade
    Throw, // throwing  and blast animation
}

export default class MainScene extends Phaser.Scene {
    private uiView: UIView;
    // private foregroundView: ForegroundView;
    // private popupService: PopupService;

    private playerController: PlayerController;
    private grenade: Grenade;
    private enemy: Enemy;

    private gameState: GameStates = GameStates.NotReady;
    private gameEvents: Phaser.Events.EventEmitter;

    // check status before allowing to start the aim and hold
    private entitiesReadyStatus = {
        grenade: false,
        enemy: false,
    };

    public constructor() {
        super({ key: SceneNames.Main });
    }

    public update(): void {
        // console.log(this.gameState, this.entitiesReadyStatus);
        // player aims
        if (this.gameState === GameStates.Hold) {
            const pointer: Phaser.Input.Pointer = this.input.activePointer;
            if (
                // check if pointer is within the game area
                pointer.x > 0 &&
                pointer.x < this.scale.width &&
                pointer.y > 0 &&
                pointer.y < this.scale.height &&
                pointer.isDown
            ) {
                this.playerController.updateDirection(this.input.activePointer);
                // release the grenade if holding for too long
                if (pointer.getDuration() >= this.grenade.MaxHoldDuration) {
                    this.grenade.throw(pointer.x, pointer.y, this.grenade.MaxHoldDuration);
                    this.gameState = GameStates.Throw;
                }
                this.uiView.updateHoldTimer(pointer.getDuration() / this.grenade.MaxHoldDuration);
            }
        }
    }

    private init(): void {
        this.gameEvents = new Phaser.Events.EventEmitter();
        // this.initServices();
        // this.initForegroundView();
        this.initPlayerController();
        this.initUIView();
        this.initGrenade();
        this.initEnemy();

        if (process.env.NODE_ENV !== "production") {
            this.initStatJS();
        }
        // setTimeout(() => (this.gameState = GameStates.Ready), 100);
        // this.gameState = GameStates.Ready;
    }

    private initEnemy(): void {
        this.enemy = new Enemy(this, this.gameEvents);

        this.gameEvents.on(GameEvents.EnemyReady, () => {
            this.entitiesReadyStatus.enemy = true;
            this.reset();
            return;
        });
    }

    private initPlayerController(): void {
        this.playerController = new PlayerController(this);

        // initialization of aim and hold
        this.input.on("pointerdown", () => {
            if (this.gameState !== GameStates.Ready) return;
            this.gameState = GameStates.Hold;
            this.entitiesReadyStatus.grenade = false;
            this.entitiesReadyStatus.enemy = false;
        });
    }

    private initGrenade(): void {
        this.grenade = new Grenade(this, this.gameEvents);

        // throwing the grenade
        this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            if (this.gameState === GameStates.Hold) {
                this.grenade.throw(pointer.x, pointer.y, pointer.getDuration());
                this.gameState = GameStates.Throw;
            }
        });
        this.gameEvents.on(GameEvents.GrenadeReady, () => {
            this.entitiesReadyStatus.grenade = true;
            this.reset();
            return;
        });

        if (this.playerController) this.grenade.setStartingPosition(this.playerController.getPlayerPosition());
    }

    // get ready for a new throw
    private reset(): void {
        if (this.entitiesReadyStatus.grenade && this.entitiesReadyStatus.enemy) {
            this.gameState = GameStates.Ready;
            this.uiView.reset();
            // console.log("ready!");
        }
    }

    private initUIView(): void {
        this.uiView = new UIView(this);
        this.add.existing(this.uiView);
        // if (this.playerController) this.uiView.positionThrowHelper(this.playerController.getPlayerPosition());
    }

    // private initForegroundView(): void {
    //     this.foregroundView = new ForegroundView(this);
    //     this.add.existing(this.foregroundView);

    //     this.popupService.view = this.foregroundView;
    // }

    // private initServices(): void {
    //     this.popupService = IocContext.DefaultInstance.get(PopupService);
    //     this.popupService.initialize();
    // }

    private initStatJS(): void {
        const stats = new Stats();
        stats.showPanel(0);
        const update = (): void => {
            stats.begin();
            stats.end();
            requestAnimationFrame(update);
        };
        update();
        document.body.appendChild(stats.dom);
    }
}
