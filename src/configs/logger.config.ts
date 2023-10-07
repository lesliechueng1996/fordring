import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ConsoleTransportInstance } from 'winston/lib/winston/transports';

type TransportType = ConsoleTransportInstance | DailyRotateFile;

const transportArray: TransportType[] = [
  // error log
  new transports.DailyRotateFile({
    filename: 'logs/error/%DATE%-error.log',
    level: 'error',
    format: format.combine(format.timestamp(), format.json()),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxFiles: '30d',
  }),
  // all level log
  new transports.DailyRotateFile({
    filename: 'logs/all/%DATE%-all.log',
    format: format.combine(format.timestamp(), format.json()),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxFiles: '30d',
  }),
];

if (process.env.NODE_ENV !== 'production') {
  // console log
  transportArray.push(
    new transports.Console({
      format: format.combine(
        format.cli(),
        format.splat(),
        format.timestamp(),
        format.prettyPrint(),
        format.printf((info) => {
          return `${info.timestamp} [${info.level}] ${info.message} ${
            info.stack || ''
          }`;
        }),
      ),
    }),
  );
}

const logger = WinstonModule.createLogger({
  transports: transportArray,
});

export default logger;
