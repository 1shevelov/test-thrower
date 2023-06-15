import { GrenadeTypes } from "../configs/Entities";

export class Grenade {
    private weight: number; // "throwStrength"
    private detonationPower: number;
    private effect: Phaser.GameObjects.Particles.ParticleEmitter;

    public constructor(type: GrenadeTypes) {
        console.log(`Grenade of type ${type} created `);
    }

    // use cubic bezier to animate grenade trajectory
    public throw(): void {
        //
    }

    public detonate(): void {
        //
    }

    private init(): void {
        //
    }
}
