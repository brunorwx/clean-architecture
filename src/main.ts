import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  // Log the URL so the developer can see where the app is running
  // Use 0.0.0.0 so it's accessible from other hosts if binding that way
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
