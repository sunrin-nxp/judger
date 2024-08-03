import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/swagger.util';
import { linkToDatabase } from './utils/db.util';
import { winstonLogger } from './utils/winston.util';
import { config } from 'dotenv'; config();

const env = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('judge');
  app.useLogger(winstonLogger);
  linkToDatabase();
  if (env.MODE == "DEV") {
    try {
      setupSwagger(app);
      console.log("Swagger is enabled");
    } catch (e) {
      console.error(e);
    }
  }
  await app.listen(env.PORT);
}
bootstrap();
