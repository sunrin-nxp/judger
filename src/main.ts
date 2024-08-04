import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/swagger.util';
import { linkToDatabase } from './utils/db.util';
import { winstonLogger } from './utils/winston.util';
import { config } from 'dotenv'; config();

const env = process.env;
const logger = new Logger("Main")

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    exposedHeaders: ["Authorization"],
    origin: ["nxp.octive.net", "localhost:7800"]
  })
  app.useLogger(winstonLogger);
  await linkToDatabase().then(() => { logger.log("Connected to MongoDB") }).catch((e) => logger.error(e));
  if (env.MODE == "DEV") {
    try {
      setupSwagger(app);
      logger.log("Swagger is enabled");
    } catch (e) {
      logger.error(e);
    }
  }
  await app.listen(env.PORT || 3000).then(() => { logger.log(`App is running on PORT ${env.PORT || 3000}`) });
}
bootstrap();
