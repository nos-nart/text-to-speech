export type LoggerLevel = 'log' | 'warn' | 'error';

export interface LoggerOptions {
  level?: LoggerLevel;
  disabled?: boolean;
}

/**
 * Usage
 * import Logger from '@/utils/logger';
 * const nameLog = new Logger('name -> ')
 * nameLog.log(name)
 */

export default class Logger {
  name: string;

  level: LoggerLevel;

  disabled: boolean;

  private prefix: string;

  private map = {
    log: 0,
    warn: 1,
    error: 2,
  };

  constructor(name: string, options?: LoggerOptions) {
    this.name = name;
    this.level = options?.level || 'warn';
    this.disabled = options?.disabled || false;
    this.prefix = `${this.name}`;
  }

  private canPrint(type: LoggerLevel) {
    if (import.meta.env.MODE === 'development') {
      return this.map[this.level] <= (this.map[type] || 2);
    }
    return true;
  }

  private print(type: LoggerLevel = 'log') {
    return (message: string, ...params: any[]) => {
      if (this.disabled || !this.canPrint(type)) {
        return;
      }

      // eslint-disable-next-line no-console
      console[type](
        `%c[${this.prefix}] %c${message}`,
        'font-weight: bolder',
        'font-weight: normal',
        ...params,
      );
    };
  }

  log(message: string, ...params: any[]) {
    this.print('log')(message, ...params);
  }

  warn(message: string, ...params: any[]) {
    this.print('warn')(message, ...params);
  }

  error(message: string, ...params: any[]) {
    this.print('error')(message, ...params);
  }
}
