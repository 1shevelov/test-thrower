// import { CounterComponent } from "../components/CounterComponent";

export class UIView extends Phaser.GameObjects.Container {
    private readonly ThrowHelperPositionMult = new Phaser.Math.Vector2(0.5, 0.07);
    // private throwHelperLength: number;

    // private counter: CounterComponent;
    private timerBar: Phaser.GameObjects.Sprite;
    private timerRunner: Phaser.GameObjects.Sprite;

    public constructor(private mainScene: Phaser.Scene) {
        super(mainScene);
        // this.init();
        this.createHoldTimer();
        this.reset();
    }

    public updateHoldTimer(timePart: number): void {
        if (Number.isNaN(timePart) || timePart < 0) timePart = 0;
        if (timePart > 1) timePart = 1;
        this.timerRunner.setPosition(
            this.timerBar.x - this.timerBar.displayWidth / 2 + this.timerBar.displayWidth * timePart,
            this.timerBar.y,
        );
    }

    public reset(): void {
        this.updateHoldTimer(0);
    }

    // public updateCounter(): void {
    //     this.counter.updateRounds();
    // }

    // private init(): void {
    //     // this.initCounter();
    // }

    // private initCounter(): void {
    //     this.counter = new CounterComponent(this.scene);
    //     this.counter.setPosition(300, 100);
    //     this.add(this.counter);
    // }

    private createHoldTimer(): void {
        const { width, height } = this.scene.scale.gameSize;
        this.timerBar = this.scene.add.sprite(
            width * this.ThrowHelperPositionMult.x,
            height * this.ThrowHelperPositionMult.y,
            "game-ui",
            "throw-helper.png",
        );
        // this.throwHelper.setDisplaySize(this.throwHelperLength, this.throwHelperLength);
        this.timerBar.setOrigin(0.5, 0.5);
        this.timerBar.setScale(2);
        // this.throwHelper.setPosition(width * this.ThrowHelperPositionMult.x, height * this.ThrowHelperPositionMult.y);
        // this.throwHelper.setVisible(false);
        this.add(this.timerBar);

        this.timerRunner = this.scene.add.sprite(0, 0, "game-ui", "runner.png");
        // this.throwRunner.setDisplaySize();
        this.timerRunner.setOrigin(0.5, 0.5);
        this.timerRunner.setScale(this.timerBar.scale);
        // this.timerRunner.setPosition(this.timerBar.x - this.timerBar.displayWidth / 2, this.timerBar.y);
        // this.throwRunner.setVisible(false);
        this.add(this.timerRunner);
    }
}
