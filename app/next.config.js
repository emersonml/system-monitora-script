const withPWA = require('next-pwa');


module.exports = {
    experimental: {
        styledComponents: true
    },
    env: {
        // App
        PRIMARY_COLOR: process.env.PRIMARY_COLOR,
        COPYRIGHT: process.env.COPYRIGHT,
        DOCUMENTS_PATH: process.env.DOCUMENTS_PATH,

        // Microservices
        API_CUSTODY_YARD_URL: process.env.API_CUSTODY_YARD_URL,
        // E-mail
        EMAIL_HOST: process.env.EMAIL_HOST,
        EMAIL_PORT: process.env.EMAIL_PORT,
        EMAIL_SSL: process.env.EMAIL_SSL,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
        EMAIL_DEFAULT_FROM: process.env.EMAIL_DEFAULT_FROM,
        CUSTOM_ENV: process.env.CUSTOM_ENV,

        // Recaptcha
        RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,

        // Menus
        MENU_DASHBOARD: process.env.MENU_DASHBOARD,
        MENU_PROJECT_MANAGEMENT: process.env.MENU_PROJECT_MANAGEMENT,
        MENU_DOCUMENT_MANAGEMENT: process.env.MENU_DOCUMENT_MANAGEMENT,
        MENU_STATISTICS: process.env.MENU_STATISTICS,
        MENU_HR: process.env.MENU_HR,
        MENU_ACCOUNTING: process.env.MENU_ACCOUNTING,
        MENU_REPORT: process.env.MENU_REPORT,
        MENU_AUDIT: process.env.MENU_AUDIT,
        MENU_SETTINGS: process.env.MENU_SETTINGS
    },
    trailingSlash: true,

    async redirects() {
        return [
            {
                source: '/',
                destination: '/dashboard',
                permanent: false
            }
        ];
    },
    webpack: (config, options) => {
        const { dev, isServer } = options;

        if (config.module.generator?.asset?.filename) {
            delete config.module.generator.asset.filename;
        }

        for (const rule of config.module.rules) {
            if (rule.oneOf) {
                rule.oneOf.push({
                    test: /\.less$/,
                    use: [
                        {
                            loader: 'style-loader',
                            options: {
                                injectType: isServer ? 'lazyStyleTag' : 'styleTag'
                            }
                        },
                        'css-loader',
                        {
                            loader: 'less-loader',
                            options: {
                                lessOptions: {
                                    modifyVars: {
                                        '@primary-color': process.env.PRIMARY_COLOR
                                    },
                                    javascriptEnabled: true
                                }
                            }
                        }
                    ]
                });
            }
        }

        if (!dev) {
            config = withPWA().webpack(config, options);
        }

        return config;
    }
}
