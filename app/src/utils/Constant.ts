import packageJSON from '../../package.json';

export const APP_VERSION = packageJSON.version;
export const RELEASE_DATE = packageJSON.date;

export const IS_DEVELOPMENT = process.env.NODE_ENV == 'development';
export const IS_WEB = typeof window != 'undefined';

export const TOKEN_KEY = 'token';
export const EXPIRATION_TIME_KEY = 'expiration-time';

export const FILES_SUPPORTED =
    '.pdf,.txt,.doc,.docx,.odt,.csv,.xls,.xlsx,.ods,.ppt,.pptx,.odp,.png,.jpg,.jpeg,.tif,.tiff,.zip,.rar,.tar,.tar.gz,.mp3,.mp4';

export const CAPABILITIES = [
    'menu_dashboard',
    'menu_audit',
    'menu_settings',

    'import_view',

    'custom_field_view',

    'environment_view',

    'permission_view',
    'permission_create',
    'permission_edit',
    'permission_delete',

    'user_login',
    'user_view',
    'user_create',
    'user_edit',
    'user_delete'
] as const;

export type Capability = typeof CAPABILITIES[number];
