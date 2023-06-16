// import { GrenadeTypes } from "../configs/Entities";
import PathFollower from "phaser3-rex-plugins/plugins/pathfollower.js";
import { IBlastResult, GameEvents } from "../scenes/MainScene";

export class Grenade {
    public readonly MaxHoldDuration = 2500; // 3 seconds
    public readonly MaxDamage = 60;

    private readonly throwAnimationDuration = 1500; // 1 second
    private readonly blastAnimationDuration = 1000; // 1 second
    // private blastEffect: Phaser.GameObjects.Particles.ParticleEmitter;

    private readonly BlastRadiusMult = 0.15; // blast diameter is 30% of screen width

    private maxTrajectoryLength: number;

    private mainScene: Phaser.Scene;
    private gameEvents: Phaser.Events.EventEmitter;

    private position = new Phaser.Math.Vector2(0, 0);
    private sprite: Phaser.GameObjects.Sprite;

    public constructor(scene: Phaser.Scene, events: Phaser.Events.EventEmitter) {
        //type: GrenadeTypes) {
        //console.log(`Grenade of type ${type} created `);
        this.mainScene = scene;
        this.gameEvents = events;
        this.init();
        this.create();
    }

    public place(x: number, y: number): void {
        this.position.set(x, y);
        this.sprite.setPosition(x, y);
        this.sprite.setVisible(true);
    }

    // TODO: if pointerY > playerY (pointer below grenade), then grenade detonates in hands killing the player
    public throw(pointerX: number, pointerY: number, holdDuration: number): void {
        console.log(`throwing grenade towards ${pointerX}, ${pointerY} with hold duration ${holdDuration}`);
        const angle = Phaser.Math.Angle.Between(this.sprite.x, this.sprite.y, pointerX, pointerY);
        const throwLength = (holdDuration / this.MaxHoldDuration) * this.maxTrajectoryLength;
        const x = this.sprite.x + throwLength * Math.cos(angle);
        const y = this.sprite.y + throwLength * Math.sin(angle);
        const path = new Phaser.Curves.Path(this.sprite.x, this.sprite.y);
        const controlPoint1 = new Phaser.Math.Vector2(
            this.sprite.x < x
                ? this.sprite.x * 0.5 // ? this.sprite.x + (x - this.sprite.x) / 4
                : this.sprite.x * 1.5, // : this.sprite.x - (this.sprite.x - x) / 4,
            this.sprite.y + (y - this.sprite.y) / 3,
        );
        const controlPoint2 = new Phaser.Math.Vector2(
            this.sprite.x < x ? x * 0.6 : x * 1.4,
            y - (y - this.sprite.y) / 6,
        );
        // console.log(`end points: ${this.sprite.x}, ${this.sprite.y} and ${x}, ${y}`);
        // debug of bezier curve
        // const controlPoints = this.mainScene.add.graphics();
        // controlPoints.fillStyle(0xff0000, 1);
        // controlPoints.fillCircle(controlPoint1.x, controlPoint1.y, 10);
        // controlPoints.fillStyle(0x0000ff, 1);
        // controlPoints.fillCircle(controlPoint2.x, controlPoint2.y, 10);
        path.cubicBezierTo(x, y, controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y);
        const portionPathFollower = new PathFollower(this.sprite, {
            path: path,
            t: 0,
            rotateToPath: true,
        });

        this.mainScene.tweens.add({
            targets: portionPathFollower,
            t: 1,
            ease: "Power2",
            duration: this.throwAnimationDuration,
            repeat: 0,
            yoyo: false,
            onComplete: () => {
                this.detonate();
                const blastResult: IBlastResult = {
                    x: x,
                    y: y,
                    radius: this.getBlastRadius(),
                    maxDamage: this.MaxDamage,
                };
                this.gameEvents.emit(GameEvents.GrenadeBlast, blastResult);
            },
        });
    }

    private getBlastRadius(): number {
        return this.mainScene.scale.gameSize.width * this.BlastRadiusMult;
    }

    private detonate(): void {
        this.sprite.setVisible(false);
        const blastRadius = this.getBlastRadius();
        const blastArea = new Phaser.Geom.Rectangle(
            this.sprite.x - blastRadius * 0.75,
            this.sprite.y - blastRadius * 0.75,
            blastRadius * 1.5,
            blastRadius * 1.5,
        );
        const blastCircle = this.mainScene.add.graphics();
        blastCircle.fillStyle(0xff0000, 0.2);
        blastCircle.fillCircle(this.sprite.x, this.sprite.y, blastRadius / 2);
        // TODO: Is it possible to create at init and only activate here?
        // this.mainScene.add.particles("Flares", {
        //     frame: ["red", "blue", "green", "yellow"],
        //     lifespan: this.blastAnimationDuration,
        //     speed: { min: 50, max: 150 },
        //     scale: { start: 0.6, end: 0 },
        //     rotate: { start: 0, end: 360 },
        //     gravityY: 50,
        //     active: true,
        //     bounds: blastArea,
        //     bounce: 0.0,
        //     maxParticles: 50,
        //     x: this.sprite.x,
        //     y: this.sprite.y,
        // });
        const particles = this.mainScene.add.particles("Flares");
        particles.createEmitter({
            frame: ["red", "blue", "green", "yellow"],
            lifespan: this.blastAnimationDuration,
            speed: { min: 100, max: 200 },
            scale: { start: 0.6, end: 0 },
            rotate: { start: 0, end: 360 },
            gravityY: 50,
            active: true,
            bounds: blastArea,
            bounce: 0.0,
            maxParticles: 20,
            x: this.sprite.x,
            y: this.sprite.y,
        });
        this.mainScene.add.tween({
            targets: blastCircle,
            alpha: 0,
            ease: "Linear",
            duration: this.blastAnimationDuration * 3,
            repeat: 0,
            yoyo: false,
            onComplete: () => {
                blastCircle.destroy();
                this.reset();
            },
        });
    }

    private init(): void {
        this.maxTrajectoryLength = 0.7 * this.mainScene.scale.gameSize.height;
    }

    private create(): void {
        this.sprite = new Phaser.GameObjects.Sprite(this.mainScene, 0, 0, "game-assets", "grenade.png");
        this.sprite.setOrigin(0.5, 0.5);
        this.sprite.setScale(5);
        this.sprite.setVisible(false);
        this.mainScene.add.existing(this.sprite);
    }

    private reset(): void {
        this.sprite.setRotation(0);
        this.sprite.setVisible(true);
        this.sprite.setPosition(this.position.x, this.position.y);
        this.gameEvents.emit(GameEvents.GrenadeReset);
    }
}
