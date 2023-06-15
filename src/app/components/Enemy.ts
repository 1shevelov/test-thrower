import { EnemyTypes } from "../configs/Entities";

export class Enemy {
    private hp: number; // "throwStrength"
    private speed: number;
    private sprite: Phaser.GameObjects.Sprite;

    public constructor(type: EnemyTypes) {
        console.log(`Enemy of type ${type} created `);
    }

    public receiveDamage(): void {
        //
    }

    private init(): void {
        this.create();
    }

    private create(): void {
        //
    }

    private die(): void {
        //
    }
}
