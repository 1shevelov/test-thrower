import { IocContext } from "power-di";
import * as Stats from "stats.js";
import { SceneNames } from "../enums/Scenes";
import { PopupService } from "../services/PopupService";
// import { ForegroundView } from "../views/ForegroundView";
// import { GameView } from "../views/GameView";
// import { UIView } from "../views/UIView";
import { PlayerController } from "../components/PlayerController";

export default class MainScene extends Phaser.Scene {
    // private gameView: GameView;
    // private uiView: UIView;
    // private foregroundView: ForegroundView;
    private popupService: PopupService;

    private playerController: PlayerController;

    public constructor() {
        super({ key: SceneNames.Main });
    }

    public update(): void {
        const pointer = this.input.activePointer;
        if (pointer.x > 0 && pointer.x < this.scale.width && pointer.y > 0 && pointer.y < this.scale.height)
            this.playerController.throw(this.input.activePointer);
    }

    private init(): void {
        this.initServices();
        // this.initGameView();
        // this.initUIView();
        // this.initForegroundView();

        this.playerController = new PlayerController(this);

        if (process.env.NODE_ENV !== "production") {
            this.initStatJS();
        }
    }

    // private initGameView(): void {
    //     this.gameView = new GameView(this);
    //     this.add.existing(this.gameView);
    // }

    // private initUIView(): void {
    //     this.uiView = new UIView(this);
    //     this.add.existing(this.uiView);
    // }

    // private initForegroundView(): void {
    //     this.foregroundView = new ForegroundView(this);
    //     this.add.existing(this.foregroundView);

    //     this.popupService.view = this.foregroundView;
    // }

    private initServices(): void {
        this.popupService = IocContext.DefaultInstance.get(PopupService);
        this.popupService.initialize();
    }

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
