import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToiletsModule } from 'src/module/toilets/toilets.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('POSTGRES_HOST', 'localhost'),
        port: configService.getOrThrow<number>('POSTGRES_PORT', 5432),
        username: configService.getOrThrow<string>('POSTGRES_USER', 'root'),
        password: configService.getOrThrow<string>('POSTGRES_PASSWORD', 'pass'),
        database: configService.getOrThrow<string>(
          'POSTGRES_DB',
          'analytics-db',
        ),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ToiletsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
