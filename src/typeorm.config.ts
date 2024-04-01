import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
dotenv.config();

const port: number = parseInt(process.env.PORT);
// console.log(port);
const database: string = process.env.DB_NAME;
// console.log(database);

const typeOrmConfig: TypeOrmModuleOptions = {
  type: "mysql",
  host: process.env.HOST,
  port: port,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: database,
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  synchronize: true, // set to false in production
};

export default typeOrmConfig;
