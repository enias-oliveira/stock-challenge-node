import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.HOST,
        port: Number(process.env.PORT),
      }
    },
  );
  await app.listen();
}
bootstrap();


    // {
    //   transport: Transport.TCP,
    //   options: {
    //     host: process.env.HOST,
    //     port: Number(process.env.PORT),
    //   }
    // },
