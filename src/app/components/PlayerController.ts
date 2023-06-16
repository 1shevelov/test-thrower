export enum PlayerEvents {
    PointerDown = "PointerDown",
    PointerUp = "PointerUp",
}

export class PlayerController {
    private readonly playerPositionMult: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0.5, 0.9);
    private playerPosition: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);

    private mainScene: Phaser.Scene;
    private events = new Phaser.Events.EventEmitter();

    public constructor(scene: Phaser.Scene) {
        this.mainScene = scene;
        this.init();
    }

    public holdingGrenade(
        maxHoldDuration: number,
        uiUpdate: (timePart: number, pointerPos: Phaser.Math.Vector2) => void,
    ): void {
        const pointer: Phaser.Input.Pointer = this.mainScene.input.activePointer;
        if (
            // check if pointer is within the game area
            pointer.x > 0 &&
            pointer.x < this.mainScene.scale.width &&
            pointer.y > 0 &&
            pointer.y < this.mainScene.scale.height &&
            pointer.isDown
        ) {
            // release the grenade if holding for too long
            if (pointer.getDuration() >= maxHoldDuration) this.events.emit(PlayerEvents.PointerUp, pointer);
            uiUpdate(pointer.getDuration() / maxHoldDuration, new Phaser.Math.Vector2(pointer.x, pointer.y));
        }
    }

    public getEvents(): Phaser.Events.EventEmitter {
        return this.events;
    }

    public getPlayerPosition(): Phaser.Math.Vector2 {
        return this.playerPosition;
    }

    private init(): void {
        const { width, height } = this.mainScene.scale.gameSize;
        this.playerPosition.x = width * this.playerPositionMult.x;
        this.playerPosition.y = height * this.playerPositionMult.y;

        this.mainScene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.events.emit(PlayerEvents.PointerDown, pointer);
        });
        this.mainScene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            this.events.emit(PlayerEvents.PointerUp, pointer);
        });
    }
}
