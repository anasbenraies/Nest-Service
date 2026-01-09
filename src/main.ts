import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // this must be activated for the validation DTO of the body request
  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true 
    }
  ));
  app.enableCors({
    origin: 'http://localhost:3000', // votre frontend
    credentials: true,  // CRUCIAL
});
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
