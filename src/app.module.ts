import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { ProductsModule } from './product/products.module';
import * as config from 'config';

@Module({
  imports: [
    SequelizeModule.forRoot({
      username: config.get('db.username'),
      password: config.get('db.password'),
      database: config.get('db.database'),
      host: config.get('db.host'),
      port: config.get('db.port'),
      dialect: config.get('db.dialect'),
      autoLoadModels: true,
      synchronize: true,
      models: [User],
      define: { timestamps: true },
    }),
    UsersModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
