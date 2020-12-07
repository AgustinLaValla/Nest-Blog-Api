import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm"
import { config } from 'dotenv';

config();

const PASSWORD = process.env.DB_PASSWORD;

export class DatabaseConnectionService implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: PASSWORD,
            database: 'nest-blog',
            autoLoadEntities: true,
            entities: ['dist/**/*.entity.{js, ts}'],
            synchronize: true,
            logging: false,
            dropSchema: false,
        }
    }
}