import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";

import typeOrmConfig from "./typeorm.config"; // Import the TypeORM configuration file

import { AuthUser } from "./middleware/AuthMiddleware";
import { TodoModule } from "./todo/todo.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TodoModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(AuthUser).forRoutes({
    //   path: "user",
    //   method: RequestMethod.POST,
    // });
    consumer.apply(AuthUser).forRoutes("user", "user/todo");
  }
}
