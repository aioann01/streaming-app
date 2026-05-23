import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
} from 'typeorm';

import { UserRole } from '../model/UserRoles';

@Index(['created_at'])
@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'text' })
    password: string;

    @Column({ type: 'enum', enum: UserRole })
    role: UserRole;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    last_logged_in_at?: Date;
}