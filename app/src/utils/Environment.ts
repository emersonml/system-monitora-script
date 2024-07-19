import Path from 'path';

// App
export const PRIMARY_COLOR = process.env.PRIMARY_COLOR || '';
export const COPYRIGHT = process.env.COPYRIGHT || '';
export const DOCUMENTS_PATH = Path.resolve(process.cwd(), process.env.DOCUMENTS_PATH || '');
export const TOKEN_SECRET = process.env.TOKEN_SECRET || '';

// Microservices
export const API_CUSTODY_YARD_URL = process.env.API_CUSTODY_YARD_URL || '';

// E-mail
export const EMAIL_HOST = process.env.EMAIL_HOST || '';
export const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '0');
export const EMAIL_SSL = process.env.EMAIL_SSL == 'true';
export const EMAIL_USER = process.env.EMAIL_USER || '';
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
export const EMAIL_DEFAULT_FROM = process.env.EMAIL_DEFAULT_FROM || '';

// CUSTOM ENV
export const CUSTOM_ENV = process.env.CUSTOM_ENV == 'true';

// Recaptcha
export const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY || '';

// Menus
export const MENU_DASHBOARD = process.env.MENU_DASHBOARD == 'true';
export const MENU_PROJECT_MANAGEMENT = process.env.MENU_PROJECT_MANAGEMENT == 'true';
export const MENU_DOCUMENT_MANAGEMENT = process.env.MENU_DOCUMENT_MANAGEMENT == 'true';
export const MENU_STATISTICS = process.env.MENU_STATISTICS == 'true';
export const MENU_HR = process.env.MENU_HR == 'true';
export const MENU_ACCOUNTING = process.env.MENU_ACCOUNTING == 'true';
export const MENU_REPORT = process.env.MENU_REPORT == 'true';
export const MENU_AUDIT = process.env.MENU_AUDIT == 'true';
export const MENU_SETTINGS = process.env.MENU_SETTINGS == 'true';
