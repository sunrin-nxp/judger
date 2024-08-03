import { utilities, WinstonModule } from 'nest-winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as winston from 'winston';
import * as moment from 'moment-timezone';
import { config } from 'dotenv'; config();

const env = process.env.NODE_ENV;

const appendTimestamp = winston.format((info, opts) => {
  if (opts.tz) {
    info.timestamp = moment().tz(opts.tz).format();
  }
  return info;
});

// 로그 저장 파일 옵션
const dailyOptions = {
  level: 'http',
  datePattern: 'YYYY-MM-DD',
  dirname: __dirname + '/../../../logs',
  filename: `judger.log.%DATE%`,
  maxFiles: 366,
  zippedArchive: true,
  colorize: true,
  handleExceptions: true,
  json: false,
};


export const winstonLogger = WinstonModule.createLogger({
  transports: [
  	
    // 콘솔 출력 옵션 지정
    new winston.transports.Console({
      level: env === 'production' ? 'http' : 'silly',
      format:
        env === 'production'
          ? winston.format.simple()	//production 환경에서는 로그를 최소화
          : winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike(`NXP - ${process.env.TAG}`, {
                prettyPrint: true, // 로그를 예쁘게 출력해줌
              }),
            ),
    }),

    // 파일 로깅 옵션 지정
    new winstonDaily(dailyOptions),
  ],
  // 포멧 지정
  format: winston.format.combine(
    appendTimestamp({ tz: 'Asia/Seoul' }),
    winston.format.json(),
    winston.format.printf((info) => {
      return `${info.timestamp} - ${info.level} [${process.pid}]: ${info.message}`;
    }),
  ),
});