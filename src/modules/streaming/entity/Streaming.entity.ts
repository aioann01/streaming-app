import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index, AfterInsert
} from 'typeorm';


@Index(['created_at'])
@Index(['genre', 'created_at'])

@Entity('streaming')
export class Streaming {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @Column()
    thumbnail_url: string;

    @Column()
    video_url: string;

    @Column({ nullable: true })
    genre?: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;

}
