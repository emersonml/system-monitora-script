import { NextApiRequest, NextApiResponse } from 'next';

import Prisma from '@services/Prisma';
import {
    MENU_ACCOUNTING,
    MENU_AUDIT,
    MENU_DASHBOARD,
    MENU_DOCUMENT_MANAGEMENT,
    MENU_HR,
    MENU_PROJECT_MANAGEMENT,
    MENU_REPORT,
    MENU_SETTINGS,
    MENU_STATISTICS
} from '@utils/Environment';

export default class CapabilityController {
    static async list(req: NextApiRequest, res: NextApiResponse) {
        await req.can(['permission_view']);

        const search = req.query.search as string;

        const capabilities = filterCapabilities(
            (
                await Prisma.capability.findMany({
                    where: {
                        id: search ? { contains: search } : undefined
                    },
                    orderBy: {
                        id: 'asc'
                    }
                })
            ).map(capability => capability.id)
        );

        res.json(capabilities);
    }
}

export function filterCapabilities(capabilities: string[]) {
    if (!MENU_DASHBOARD) {
        capabilities = capabilities.filter(capability => !/^(menu_dashboard )/i.test(capability));
    }

    if (!MENU_PROJECT_MANAGEMENT) {
        capabilities = capabilities.filter(
            capability => !/^(menu_project_management|project_|task_)/i.test(capability)
        );
    }

    if (!MENU_DOCUMENT_MANAGEMENT) {
        capabilities = capabilities.filter(capability => !/^(menu_document_management|document_)/i.test(capability));
    }

    if (!MENU_STATISTICS) {
        capabilities = capabilities.filter(capability => !/^(menu_statistics)/i.test(capability));
    }

    if (!MENU_HR) {
        capabilities = capabilities.filter(capability => !/^(menu_hr|employee_|department_)/i.test(capability));
    }

    if (!MENU_ACCOUNTING) {
        capabilities = capabilities.filter(
            capability => !/^(menu_accounting|withdraw_partner_|expense_|revenue_|vendor_)/i.test(capability)
        );
    }

    if (!MENU_REPORT) {
        capabilities = capabilities.filter(capability => !/^(menu_report|report_)/i.test(capability));
    }

    if (!MENU_AUDIT) {
        capabilities = capabilities.filter(capability => !/^(menu_audit)/i.test(capability));
    }

    if (!MENU_SETTINGS) {
        capabilities = capabilities.filter(
            capability => !/^(menu_settings|user_|permission_|custom_field_|environment_|import_)/i.test(capability)
        );
    }

    return capabilities;
}
