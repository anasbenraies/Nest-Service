import { User } from 'src/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const ormConfig: PostgresConnectionOptions = {
  type: 'postgres',
  database: 'testDB',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  //synchronize: true,
};
