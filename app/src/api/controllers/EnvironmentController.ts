import { NextApiRequest, NextApiResponse } from 'next';

import { CUSTOM_ENV } from '@utils/Environment';
import Settings from '@utils/Settings';

export default class EnvironmentController {
    static async list(req: NextApiRequest, res: NextApiResponse) {
        if (req.userId) {
            await req.can(['environment_view']);
        }

        const settings = await Settings.get('ENV_');

        res.json(
            req.userId
                ? {
                      title: CUSTOM_ENV ? settings.ENV_CUSTOM_TITLE : settings.ENV_TITLE,
                      companyName: settings.ENV_COMPANY_NAME,
                      jwtExpiration: parseInt(settings.ENV_TOKEN_EXPIRATION),
                      idleTime: parseInt(settings.ENV_IDLE_TIME),
                      favicon: CUSTOM_ENV ? settings.ENV_CUSTOM_FAVICON : settings.ENV_FAVICON,
                      loginTitle: settings.ENV_LOGIN_TITLE,
                      loginLogo: CUSTOM_ENV ? settings.ENV_CUSTOM_LOGIN_LOGO : settings.ENV_LOGIN_LOGO,
                      headerLogo: settings.ENV_HEADER_LOGO,
                      backgroundLogin: CUSTOM_ENV
                          ? settings.ENV_CUSTOM_BACKGROUND_LOGIN
                          : settings.ENV_BACKGROUND_LOGIN,
                      reportLogo: settings.ENV_REPORT_LOGO,
                      reportHeaderBackground: settings.ENV_REPORT_HEADER_BACKGROUND,
                      reportHeaderText: settings.ENV_REPORT_HEADER_TEXT,
                      reportFooterBackground: settings.ENV_REPORT_FOOTER_BACKGROUND,
                      reportFooterText: settings.ENV_REPORT_FOOTER_TEXT,
                      documentMaxUploadSize: parseInt(settings.ENV_DOCUMENT_MAX_UPLOAD_SIZE),
                      orderStatusBudget: settings.ENV_ORDER_STATUS_BUDGET,

                      customTitle: settings.ENV_CUSTOM_TITLE,
                      customFavicon: settings.ENV_CUSTOM_FAVICON,
                      customLoginLogo: settings.ENV_CUSTOM_LOGIN_LOGO,
                      customHeaderLogo: settings.ENV_CUSTOM_HEADER_LOGO,
                      customBackgroundLogin: settings.ENV_CUSTOM_BACKGROUND_LOGIN
                  }
                : {
                      title: CUSTOM_ENV ? settings.ENV_CUSTOM_TITLE : settings.ENV_TITLE,
                      favicon: CUSTOM_ENV ? settings.ENV_CUSTOM_FAVICON : settings.ENV_FAVICON,
                      loginTitle: settings.ENV_LOGIN_TITLE,
                      loginLogo: CUSTOM_ENV ? settings.ENV_CUSTOM_LOGIN_LOGO : settings.ENV_LOGIN_LOGO,
                      backgroundLogin: CUSTOM_ENV ? settings.ENV_CUSTOM_BACKGROUND_LOGIN : settings.ENV_BACKGROUND_LOGIN
                  }
        );
    }

    static async update(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['environment_view']);

        const environment = req.body as {
            title: string;
            companyName: string;
            jwtExpiration: number;
            idleTime: number;
            favicon: string;
            loginTitle: string;
            loginLogo: string;
            headerLogo: string;
            backgroundLogin: string;
            reportLogo: string;
            reportHeaderBackground: string;
            reportHeaderText: string;
            reportFooterBackground: string;
            reportFooterText: string;
            documentMaxUploadSize: number;
            orderStatusBudget: string;

            customTitle?: string;
            customFavicon?: string;
            customLoginLogo?: string;
            customHeaderLogo?: string;
            customBackgroundLogin?: string;
        };

        console.log("environment", environment)
        await Settings.set(
            [
                ['ENV_TITLE', environment.title],
                ['ENV_COMPANY_NAME', environment.companyName],
                ['ENV_TOKEN_EXPIRATION', environment.jwtExpiration],
                ['ENV_IDLE_TIME', environment.idleTime],
                ['ENV_FAVICON', environment.favicon],
                ['ENV_LOGIN_TITLE', environment.loginTitle],
                ['ENV_LOGIN_LOGO', environment.loginLogo],
                ['ENV_HEADER_LOGO', environment.headerLogo],
                ['ENV_BACKGROUND_LOGIN', environment.backgroundLogin],
                ['ENV_REPORT_LOGO', environment.reportLogo],
                ['ENV_REPORT_HEADER_BACKGROUND', environment.reportHeaderBackground],
                ['ENV_REPORT_HEADER_TEXT', environment.reportHeaderText],
                ['ENV_REPORT_FOOTER_BACKGROUND', environment.reportFooterBackground],
                ['ENV_REPORT_FOOTER_TEXT', environment.reportFooterText],
                ['ENV_DOCUMENT_MAX_UPLOAD_SIZE', environment.documentMaxUploadSize],
                ['ENV_ORDER_STATUS_BUDGET', environment.orderStatusBudget],
                ['ENV_CUSTOM_TITLE', environment.customTitle],
                ['ENV_CUSTOM_FAVICON', environment.customFavicon],
                ['ENV_CUSTOM_LOGIN_LOGO', environment.customLoginLogo],
                ['ENV_CUSTOM_HEADER_LOGO', environment.customHeaderLogo],
                ['ENV_CUSTOM_BACKGROUND_LOGIN', environment.customBackgroundLogin]
            ]
                .filter(value => value[1] != null)
                .map(([key, value]) => [String(key), String(value)])
        );

        res.json(environment);
    }
}
