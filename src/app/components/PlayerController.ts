export class PlayerController {
    private throwDirection: Phaser.GameObjects.Graphics;
    private readonly throwDirectionLineStyle = {
        width: 5,
        color: 0x00ff00,
        alpha: 1,
    };
    private readonly ThrowDirectionLength = 250;
    private playerPosition: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
    private readonly playerPositionMult: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0.5, 0.9);

    private mainScene: Phaser.Scene;

    public constructor(scene: Phaser.Scene) {
        this.mainScene = scene;
        this.init();
    }

    // while player aims
    public updateDirection(pointer: Phaser.Input.Pointer): void {
        const angle = Phaser.Math.Angle.Between(this.playerPosition.x, this.playerPosition.y, pointer.x, pointer.y);
        if (angle < 0 && angle > -Math.PI) {
            // while pointer position is between the player position and a target
            this.throwDirection.clear();
            const x = this.playerPosition.x + this.ThrowDirectionLength * Math.cos(angle);
            const y = this.playerPosition.y + this.ThrowDirectionLength * Math.sin(angle);
            this.drawThrowDirection(x, y);
        }
    }

    public getPlayerPosition(): Phaser.Math.Vector2 {
        return this.playerPosition;
    }

    private init(): void {
        const { width, height } = this.mainScene.scale.gameSize;
        this.playerPosition.x = width * this.playerPositionMult.x;
        this.playerPosition.y = height * this.playerPositionMult.y;

        this.drawThrowDirection(this.playerPosition.x, this.playerPosition.y - this.ThrowDirectionLength);
    }

    // show line in the direction of the pointer
    private drawThrowDirection(endPosX: number, endPosY: number): void {
        this.throwDirection = this.mainScene.add.graphics();
        this.throwDirection.lineStyle(
            this.throwDirectionLineStyle.width,
            this.throwDirectionLineStyle.color,
            this.throwDirectionLineStyle.alpha,
        );
        this.throwDirection.lineBetween(this.playerPosition.x, this.playerPosition.y, endPosX, endPosY);
    }
}
