// import { CounterComponent } from "../components/CounterComponent";

export class UIView extends Phaser.GameObjects.Container {
    private readonly HoldTimerPositionMult = new Phaser.Math.Vector2(0.5, 0.07);

    private throwDirectionLine: Phaser.GameObjects.Sprite;

    // private counter: CounterComponent;
    private timerBar: Phaser.GameObjects.Sprite;
    private timerRunner: Phaser.GameObjects.Sprite;

    public constructor(private mainScene: Phaser.Scene) {
        super(mainScene);
        this.createHoldTimer();
        this.createThrowDirectionLine();
        this.resetTimer();
    }

    public updateOnHold(timePart: number, pointerPos: Phaser.Math.Vector2): void {
        this.updateHoldTimer(timePart);
        this.updateDirectionLine(pointerPos.x, pointerPos.y);
    }

    public setPlayerPosition(playerPosition: Phaser.Math.Vector2): void {
        this.throwDirectionLine.setPosition(playerPosition.x, playerPosition.y);
        this.throwDirectionLine.setVisible(true);
    }

    // reset between throws
    public resetTimer(): void {
        this.updateHoldTimer(0);
    }

    public resetDirectionLine(): void {
        this.throwDirectionLine.setRotation(0);
    }

    // public updateCounter(): void {
    //     this.counter.updateRounds();
    // }

    // private initCounter(): void {
    //     this.counter = new CounterComponent(this.scene);
    //     this.counter.setPosition(300, 100);
    //     this.add(this.counter);
    // }

    // while player aims
    private updateDirectionLine(endX: number, endY: number): void {
        const angle = Phaser.Math.Angle.Between(this.throwDirectionLine.x, this.throwDirectionLine.y, endX, endY);
        if (angle < 0 && angle > -Math.PI) {
            // while pointer position is between the player position and a target
            this.throwDirectionLine.setRotation(angle + Math.PI / 2);
        }
    }

    // while player aims
    private updateHoldTimer(timePart: number): void {
        if (Number.isNaN(timePart) || timePart < 0) timePart = 0;
        if (timePart > 1) timePart = 1;
        this.timerRunner.setPosition(
            this.timerBar.x - this.timerBar.displayWidth / 2 + this.timerBar.displayWidth * timePart,
            this.timerBar.y,
        );
    }

    private createHoldTimer(): void {
        const { width, height } = this.scene.scale.gameSize;
        this.timerBar = this.scene.add.sprite(
            width * this.HoldTimerPositionMult.x,
            height * this.HoldTimerPositionMult.y,
            "game-ui",
            "throw-helper.png",
        );
        this.timerBar.setOrigin(0.5, 0.5);
        this.timerBar.setScale(2);
        this.add(this.timerBar);

        this.timerRunner = this.scene.add.sprite(0, 0, "game-ui", "runner.png");
        this.timerRunner.setOrigin(0.5, 0.5);
        this.timerRunner.setScale(this.timerBar.scale);
        this.add(this.timerRunner);
    }

    private createThrowDirectionLine(): void {
        this.throwDirectionLine = this.scene.add.sprite(0, 0, "game-ui", "pointer.png");
        this.throwDirectionLine.setOrigin(0.5, 1.0);
        this.throwDirectionLine.setScale(2);
        this.throwDirectionLine.setVisible(false);
        this.add(this.throwDirectionLine);
    }
}
