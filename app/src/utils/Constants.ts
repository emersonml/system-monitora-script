export const CAPABILITIES = ['menu_dashboard', 'menu_settings', 'user_menu', 'permission_menu'] as const;

export type Capability = (typeof CAPABILITIES)[number];
