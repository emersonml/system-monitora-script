import { NextApiRequest, NextApiResponse } from 'next';

import MimeType from 'mime-types';

import Prisma from '@services/Prisma';
import ApiError from '@utils/ApiError';
import Audit from '@utils/Audit';
import { FILES_SUPPORTED } from '@utils/Constant';
import { DOCUMENTS_PATH } from '@utils/Environment';
import FileUtil from '@utils/FileUtil';
import Settings from '@utils/Settings';
import Token from '@utils/Token';
import Util from '@utils/Util';

export type AttachmentModel = 'order' | 'project' | 'expense' | 'withdrawPartner' | 'plan' | 'form' | 'user';

export default class AttachmentController {
    static async create(req: NextApiRequest, res: NextApiResponse) {
        try {
            const { modelId, model, typeName } = req.body as {
                modelId: string;
                model: AttachmentModel;
                typeName?: string;
            };

            let userId: string;

            if (model == 'user') {
                const user = await Prisma.user.findUnique({
                    where: { id: modelId },
                    select: { id: true }
                });

                if (!user) {
                    throw new ApiError('Usuário não encontrado', 400);
                }

                userId = modelId;
            }

            if (!req.file) {
                throw new ApiError('Documento não informado', 400);
            }

            if (!FILES_SUPPORTED.includes(Util.getExtName(req.file.filename))) {
                throw new ApiError('Formato não suportado', 400);
            }

            const settings = await Settings.get(['ENV_DOCUMENT_MAX_UPLOAD_SIZE']);
            if (settings.ENV_DOCUMENT_MAX_UPLOAD_SIZE != null) {
                if (req.file.size >= parseInt(settings.ENV_DOCUMENT_MAX_UPLOAD_SIZE) * 1e6) {
                    throw new ApiError('Documento acima do tamanho comportado', 400);
                }
            }

            const attachment = await Prisma.attachment.create({
                data: {
                    path: req.file.filename.toLowerCase(),
                    filename: req.file.originalname,
                    userId,
                    typeName
                }
            });

            await Audit.log({
                authorId: req.userId,
                action: 'create',
                description: attachment.filename,
                modelId: attachment.id,
                modelName: 'attachment'
            });

            res.status(201).json({
                id: attachment.id,
                filename: attachment.filename,
                typeName: attachment?.typeName,
                userId: attachment?.userId,
                url: await createUrl(req.headers.server, req.userId, attachment.path)
            });
        } catch (error) {
            FileUtil.deleteFile(req.file?.path);

            throw error;
        }
    }

    static async delete(req: NextApiRequest, res: NextApiResponse) {
        const { id: paramId } = req.params as {
            id: string;
        };

        const attachment = await Prisma.attachment.findUnique({
            where: { id: paramId },
            select: {
                id: true,
                filename: true,
                path: true
            }
        });

        if (!attachment) {
            throw new ApiError('Documento não encontrado', 400);
        }

        await Prisma.attachment.delete({
            where: { id: paramId }
        });

        FileUtil.deleteFile(FileUtil.resolvePath(DOCUMENTS_PATH, attachment.path));

        await Audit.log({
            authorId: req.userId,
            action: 'delete',
            description: attachment.filename,
            modelId: attachment.id,
            modelName: 'attachment'
        });

        res.status(204).end();
    }

    static async view(req: NextApiRequest, res: NextApiResponse) {
        try {
            const { path } = req.params;
            const token = req.query.token as string;

            if (!token) {
                throw new ApiError('Token não informado', 401);
            }

            let tokenData = null;
            try {
                tokenData = Token.getData<{ userId: string; path: string }>(token);
                if (tokenData?.path && tokenData?.path != path) {
                    throw new ApiError('Sem permissão para acessar esse recurso', 403);
                }
            } catch (error) {
                tokenData = null;
            }

            const attachment = await Prisma.attachment.findFirst({
                where: { path },
                select: {
                    id: true,
                    filename: true
                }
            });
            const filePath = FileUtil.resolvePath(DOCUMENTS_PATH, path);

            if (!attachment || !FileUtil.existsPath(filePath)) {
                throw new ApiError('Documento não encontrado', 400);
            }

            await Audit.log({
                authorId: tokenData?.userId || '',
                action: 'view',
                description: attachment.filename,
                modelId: attachment.id,
                modelName: 'attachment'
            });

            const encodedFilename = encodeURIComponent(attachment?.filename || 'Documento.pdf');
            res.setHeader('Content-Type', MimeType.contentType(path) || 'application/octet-stream');
            res.setHeader('Content-Disposition', `inline; filename=${encodedFilename}`);
            FileUtil.createReadStream(filePath).pipe(res);
        } catch (error) {
            const message = error?.message || 'Error para visualizar o documento!';
            const status = error?.status || 500;
            throw new ApiError(message, status);
        }
    }
}

export async function createUrl(server: string | string[], userId: string, path: string) {
    return `${server}/api/attachments/view/${path}?token=${await Token.create({ userId, path })}`;
}
