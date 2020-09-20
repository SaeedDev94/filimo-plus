import { registerAs } from '@nestjs/config';

export const urlConfig = registerAs('url', () => ({
  app: 'http://localhost:1399',
  filimo: 'https://www.filimo.com'
}));
