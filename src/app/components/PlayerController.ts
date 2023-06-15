export class PlayerController {
    private throwDirection: Phaser.GameObjects.Graphics;
    private readonly throwDirectionStyle: Phaser.Types.GameObjects.Graphics.LineStyle = {
        width: 10,
        color: 0x00ff00,
        alpha: 1,
    };
    private readonly throwDirectionLength: number = 200;
    private throwDirectionPos: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
    private readonly throwDirectionPosMult: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0.5, 0.8);

    private mainScene: Phaser.Scene;

    public constructor(scene: Phaser.Scene) {
        this.mainScene = scene;
        this.init();
    }

    public throw(pointer: Phaser.Input.Pointer): void {
        if (pointer.isDown) {
            // console.log(`x: ${pointer.x}, y: ${pointer.y}, duration: ${pointer.getDuration()}`);
            const angle = Phaser.Math.Angle.Between(
                this.throwDirectionPos.x,
                this.throwDirectionPos.y,
                pointer.x,
                pointer.y,
            );
            // console.log(angle);
            if (angle < 0 && angle > -Math.PI) {
                this.throwDirection.clear();
                const x = this.throwDirectionPos.x + this.throwDirectionLength * Math.cos(angle);
                const y = this.throwDirectionPos.y + this.throwDirectionLength * Math.sin(angle);
                this.drawThrowDirection(x, y);
                console.log(pointer.getDuration());
            }
        }
    }

    private init(): void {
        this.drawThrowDirection(this.throwDirectionPos.x, this.throwDirectionPos.y - this.throwDirectionLength);

        // this.mainScene.input.on(
        //     "pointerdown",
        //     (pointer: Phaser.Input.Pointer) => {
        //         console.log(pointer.x, pointer.y);
        //     },
        //     this,
        // );
    }

    private drawThrowDirection(endPosX: number, endPosY: number): void {
        const { width, height } = this.mainScene.scale.gameSize;
        this.throwDirectionPos.x = width * this.throwDirectionPosMult.x;
        this.throwDirectionPos.y = height * this.throwDirectionPosMult.y;
        this.throwDirection = this.mainScene.add.graphics();
        this.throwDirection.lineStyle(5, 0x00ff00, 1.0);
        this.throwDirection.lineBetween(this.throwDirectionPos.x, this.throwDirectionPos.y, endPosX, endPosY);
    }
}
