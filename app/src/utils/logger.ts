/* eslint-disable no-console */

function logFunction(type: string, ...args: any[]) {
  if (process.env.NODE_ENV === 'test') return;

  const logMessage = args.map((arg) => (arg))?.join(' ');
  console.log(`>> [${type}]: ${logMessage}`);
}

export const logger = {
  log: (...args: any[]) => logFunction('LOG', ...args),
  error: (...args: any[]) => logFunction('ERROR', ...args),
  warn: (...args: any[]) => logFunction('WARN', ...args),
  info: (...args: any[]) => logFunction('INFO', ...args),
};
