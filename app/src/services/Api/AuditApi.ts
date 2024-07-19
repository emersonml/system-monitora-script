import { Paginate } from 'axios';
import { endOfDay, parseISO, startOfDay } from 'date-fns';

import Api from '@services/Api';
import { PrismaTypes } from '@services/Prisma';
import { useQuery } from '@services/QueryClient';
import { Translation } from '@states/TranslationState';

type ListArgs = {
    translation: Translation;
    page?: number;
    size?: number;
    sort?: string;
    search?: string;
    author?: string;
    startDate?: Date;
    endDate?: Date;
};

export type ListAudit = {
    id: string;
    date: Date;
    author: string;
    action: PrismaTypes.AuditActionEnum;
    description: string;
    model: PrismaTypes.AuditModelEnum;
    ipAddress?: string;
};

export default class AuditApi {
    static list({ translation, ...args }: ListArgs) {
        return useQuery(['audits', args], () => AuditApi.listWithPromise({ translation, ...args }));
    }

    static async listWithPromise({ translation, ...args }: ListArgs) {
        const data = await Api.get<Paginate<ListAudit[]>>('audits', {
            params: {
                page: args?.page,
                size: args?.size,
                sort: args?.sort,
                search: args?.search,
                author: args?.author,
                startDate: args?.startDate ? startOfDay(args?.startDate) : undefined,
                endDate: args?.endDate ? endOfDay(args?.endDate) : undefined
            }
        });

        return {
            ...data,
            list: data.list.map(audit => ({
                ...audit,
                date: audit.date ? parseISO(String(audit.date)) : null,
                description: (() => {
                    const description = {
                        session: 'Usuário "{{description}}" fez {{action}} com endereço ip "{{ipAddress}}"',
                        role: 'Permissão "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        capability: 'Capacidade(s) de "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        attachment: 'Anexo "{{description}}" foi {{maleAction}} por "{{author}}"',
                        user: 'Usuário "{{description}}" foi {{maleAction}} por "{{author}}"',
                        employee: 'Servidor "{{description}}" foi {{maleAction}} por "{{author}}"',
                        customer: 'Cliente "{{description}}" foi {{maleAction}} por "{{author}}"',
                        vendor: 'Fornecedor "{{description}}" foi {{maleAction}} por "{{author}}"',
                        salesFunnelColumn:
                            'Coluna do funil de vendas "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        order: 'Pedido de número "{{description}}" foi {{maleAction}} por "{{author}}"',
                        orderStatus: 'Status de pedido "{{description}}" foi {{maleAction}} por "{{author}}"',
                        product: 'Produto/Serviço "{{description}}" foi {{maleAction}} por "{{author}}"',
                        productCategory:
                            'Categoria de produto/serviço "{{description}}" foi {{maleAction}} por "{{author}}"',
                        department: 'Unidade "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        departmentType: 'Tipo de unidade "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        project: 'Projeto "{{description}}" foi {{maleAction}} por "{{author}}"',
                        projectType: 'Tipo de projeto "{{description}}" foi {{maleAction}} por "{{author}}"',
                        task: 'Tarefa "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        folder: 'Pasta "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        document:
                            'Documento "{{description}}" foi {{maleAction}} por "{{author}}" com endereço ip "{{ipAddress}}"',
                        withdrawPartner: 'Retirada de sócio "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        expense: 'Despesa "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        expenseCategory: 'Categoria de despesa "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        revenue: 'Receita "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        revenueCategory: 'Categoria de receita "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        plan: 'Plano "{{description}}" foi {{maleAction}} por "{{author}}"',
                        procedure: 'Procedimento n° "{{description}}" foi {{maleAction}} por "{{author}}"',
                        procedureType: 'Tipo de procedimento "{{description}}" foi {{maleAction}} por "{{author}}"',
                        procedureConclusion:
                            'Conclusão de procedimento "{{description}}" foi {{maleAction}} por "{{author}}"',
                        instrument: 'Instrumento "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        occurrence: 'Ocorrência n° "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        occurrenceMotivation:
                            'Motivação de ocorrência "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        occurrenceEnvironment:
                            'Ambiente de ocorrência "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        nature: 'Natureza "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        natureGroup: 'Grupo de natureza "{{description}}" foi {{maleAction}} por "{{author}}"',
                        district: 'Bairro "{{description}}" foi {{maleAction}} por "{{author}}"',
                        city: 'Cidade "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        instaurationForm: 'Forma de instauração "{{description}}" foi {{maleAction}} por "{{author}}"',
                        risp: 'RISP "{{description}}" foi {{maleAction}} por "{{author}}"',
                        person: 'Pessoa "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        profession: 'Profissão "{{description}}" foi {{maleAction}} por "{{author}}"',
                        gender: 'Gênero "{{description}}" foi {{maleAction}} por "{{author}}"',
                        sexualOrientation: 'Orientação sexual "{{femaleAction}}" foi {{maleAction}} por "{{author}}"',
                        ethnicity: 'Etnia "{{description}}" foi {{femaleAction}} por "{{author}}"',
                        schooling: 'Escolaridade "{{description}}" foi {{maleAction}} por "{{author}}"',
                        civilState: 'Estado civil "{{description}}" foi {{maleAction}} por "{{author}}"'
                    };

                    function parseAction(action: PrismaTypes.AuditActionEnum, type: 'male' | 'female') {
                        return {
                            create: translation(type == 'male' ? 'criado' : 'criada'),
                            view: translation(type == 'male' ? 'visualizado' : 'visualizada'),
                            edit: translation(type == 'male' ? 'editado' : 'editada'),
                            delete: translation(type == 'male' ? 'deletado' : 'deletada')
                        }[action];
                    }

                    function parseDescription(model: PrismaTypes.AuditModelEnum, description: string) {
                        if (model == 'folder' || model == 'document') {
                            return description.toUpperCase();
                        }

                        return description;
                    }

                    if (audit.action == 'custom') {
                        const { action, ...args } = JSON.parse(audit.description) as { [key: string]: string };

                        if (audit.model == 'document') {
                            if (action == 'status') {
                                const { name } = args;

                                return translation('Documento "{{name}}" foi publicado por "{{author}}"', {
                                    name: name.toUpperCase(),
                                    author: audit.author
                                });
                            }

                            if (action == 'folder') {
                                const { name, from, to } = args;

                                return translation(
                                    'Documento "{{name}}" foi movido da pasta "{{from}}" para "{{to}}" por "{{author}}"',
                                    {
                                        name: name.toUpperCase(),
                                        from: from.toUpperCase(),
                                        to: to.toUpperCase(),
                                        author: audit.author
                                    }
                                );
                            }

                            if (action == 'download') {
                                const { name } = args;

                                return translation(
                                    'Documento "{{name}}" foi baixado por "{{author}}"  com endereço ip "{{ipAddress}}"',
                                    {
                                        name: name.toUpperCase(),
                                        author: audit.author,
                                        ipAddress: audit.ipAddress
                                    }
                                );
                            }
                        } else if (audit.model == 'folder') {
                            if (action == 'name') {
                                const { from, to } = args;

                                return translation('Pasta "{{from}}" foi renomeada para "{{to}}" por "{{author}}"', {
                                    from: from.toUpperCase(),
                                    to: to.toUpperCase(),
                                    author: audit.author
                                });
                            }

                            if (action == 'parent') {
                                const { name, from, to } = args;

                                return translation(
                                    'Pasta "{{name}}" foi movida de "{{from}}" para "{{to}}" por "{{author}}"',
                                    {
                                        name: name.toUpperCase(),
                                        from: from.toUpperCase(),
                                        to: to.toUpperCase(),
                                        author: audit.author
                                    }
                                );
                            }

                            if (action == 'removedUser') {
                                const { folder, user } = args;

                                return translation(
                                    'Usuário "{{user}}" foi removido da pasta "{{folder}}" por "{{author}}"',
                                    {
                                        user,
                                        folder: folder.toUpperCase(),
                                        author: audit.author
                                    }
                                );
                            }

                            if (action == 'addedUser') {
                                const { folder, user } = args;

                                return translation(
                                    'Usuário "{{user}}" foi adicionado a pasta "{{folder}}" por "{{author}}"',
                                    {
                                        user,
                                        folder: folder.toUpperCase(),
                                        author: audit.author
                                    }
                                );
                            }

                            if (action == 'permission') {
                                const { permission, permissionValue, folder, user } = args;
                                const permissions = {
                                    folderCreate: translation('criar pasta'),
                                    folderEdit: translation('editar pasta'),
                                    folderDelete: translation('excluir pasta'),
                                    documentCreate: translation('criar documento'),
                                    documentEdit: translation('editar documento'),
                                    documentDelete: translation('excluir documento')
                                };

                                return translation(
                                    'Permissão de "{{permission}}" do usuário "{{user}}" foi {{action}} na pasta "{{folder}}" por "{{author}}"',
                                    {
                                        permission: permissions[permission],
                                        action: translation(permissionValue ? 'adicionada' : 'removida'),
                                        user,
                                        folder: folder.toUpperCase(),
                                        author: audit.author
                                    }
                                );
                            }
                        }
                    }

                    return translation(description[audit.model], {
                        author: audit.author,
                        description: parseDescription(audit.model, audit.description),
                        action: audit.action,
                        maleAction: parseAction(audit.action, 'male'),
                        femaleAction: parseAction(audit.action, 'female'),
                        ipAddress: audit.ipAddress
                    });
                })()
            }))
        };
    }
}
