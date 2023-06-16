// import { EnemyTypes } from "../configs/Entities";

import { IBlastResult, GameEvents } from "../scenes/MainScene";

export class Enemy {
    private readonly StartHp = 80;
    private readonly DeathAnimationDuration = 1200;
    private readonly Position = new Phaser.Math.Vector2(400, 300);

    private hp: number; // "throwStrength"
    // private speed: number;
    private mainScene: Phaser.Scene;
    private gameEvents: Phaser.Events.EventEmitter;

    private sprite: Phaser.GameObjects.Sprite;
    private hpBar: Phaser.GameObjects.Container;

    public constructor(scene: Phaser.Scene, events: Phaser.Events.EventEmitter) {
        // type: EnemyTypes) {
        this.gameEvents = events;
        this.mainScene = scene;
        this.init();
        this.create();
        this.createHpBar();
    }

    private receiveDamage(blastResult: IBlastResult): void {
        const distance = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, blastResult.x, blastResult.y);
        if (distance > blastResult.radius + this.sprite.displayWidth / 2) {
            console.log("Missed!");
            return;
        }
        const damage = Math.round(
            blastResult.maxDamage * (1 - distance / (blastResult.radius + this.sprite.displayWidth / 2)),
        );
        this.hp -= damage;
        if (this.hp < 0) this.hp = 0;
        this.updateBar();
        if (this.hp <= 0) {
            this.die();
            return;
        }
        console.log(`enemy received ${damage} damage, hp left: ${this.hp}`);
        this.gameEvents.emit(GameEvents.EnemyReady);
    }

    private updateBar(): void {
        const hpPart = this.hp / this.StartHp;
        console.log(`hpPart: ${hpPart}`);
        const bar = this.hpBar.getByName("bar") as Phaser.GameObjects.Graphics;
        bar.clear();
        bar.fillStyle(0x00ff00, 1);
        const frame = this.hpBar.getByName("frame") as Phaser.GameObjects.Sprite;
        bar.fillRect(
            -frame.displayWidth / 2,
            -frame.displayHeight / 2,
            frame.displayWidth * hpPart,
            frame.displayHeight,
        );
    }

    private init(): void {
        this.gameEvents.on(GameEvents.GrenadeBlast, this.receiveDamage, this);
        this.hp = this.StartHp;
    }

    private create(): void {
        this.mainScene.anims.create({
            key: "death",
            repeat: 0,
            frames: this.mainScene.anims.generateFrameNames("enemy-demon", {
                prefix: "Death",
                suffix: ".png",
                start: 1,
                end: 6,
                zeroPad: 0,
            }),
            // frameRate: 5,
            duration: this.DeathAnimationDuration,
        });
        this.mainScene.anims.create({
            key: "walk",
            repeat: -1,
            frames: this.mainScene.anims.generateFrameNames("enemy-demon", {
                prefix: "Walk",
                suffix: ".png",
                start: 1,
                end: 6,
                zeroPad: 0,
            }),
            frameRate: 5,
        });
        this.sprite = this.mainScene.add.sprite(this.Position.x, this.Position.y, "enemy-demon").play("walk");
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setScale(1.7);
    }

    private die(): void {
        this.sprite.play("death");
        setTimeout(() => {
            this.mainScene.add.tween({
                targets: this.sprite,
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    // this.gameEvents.emit(GameEvents.EnemyDied);
                    this.reset();
                },
            });
        }, this.DeathAnimationDuration);
    }

    private reset(): void {
        this.hp = this.StartHp;
        this.updateBar();
        this.sprite.setAlpha(1);
        this.sprite.setPosition(this.Position.x, this.Position.y);
        this.sprite.play("walk");
        this.gameEvents.emit(GameEvents.EnemyReady);
    }

    private createHpBar(): void {
        this.hpBar = new Phaser.GameObjects.Container(this.mainScene, 0, 0);

        const frame = this.mainScene.add.sprite(0, 0, "game-ui", "hp-bar.png");
        frame.setOrigin(0.5, 0.5);
        // frame.setScale(2.0);
        // frame.setVisible(false);
        frame.setName("frame");
        this.hpBar.add(frame);

        const bar = this.mainScene.add.graphics();
        bar.fillStyle(0x00ff00, 1);
        bar.fillRect(-frame.displayWidth / 2, -frame.displayHeight / 2, frame.displayWidth, frame.displayHeight);
        // bar.setVisible(false);
        bar.setName("bar");
        this.hpBar.add(bar);

        this.hpBar.setPosition(this.sprite.x - frame.displayWidth / 2, this.sprite.y - this.sprite.displayHeight / 5);
        this.mainScene.add.existing(this.hpBar);
    }
}
