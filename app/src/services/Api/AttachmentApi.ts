import { AttachmentModel } from '@api/controllers/AttachmentController';
import Api from '@services/Api';
import { queryClient } from '@services/QueryClient';

export type Attachment = {
    id?: string;
    filename?: string;
    url?: string;
    typeName?: string;
};

export type CreateOrUpdateAttachment = {
    modelId: string;
    typeName?: string;
    model: AttachmentModel;
    file: File;
};

function updateQueryCache(modelId: string, model: AttachmentModel, attachment: Attachment) {
    let modelKey = '';
    switch (model) {
        case 'order':
            modelKey = 'orders';
            break;
        case 'project':
            modelKey = 'projects';
            break;
        case 'expense':
            modelKey = 'expenses';
            break;
        case 'withdrawPartner':
            modelKey = 'withdraws-partner';
            break;
        case 'user':
            modelKey = 'users';
            break;
    }

    const queryKey = [modelKey, modelId];
    const data = queryClient.getQueryData<{ attachments?: Attachment[] }>(queryKey);
    if (data) {
        if (attachment.url) {
            if (!data.attachments.find(attachmentFind => attachmentFind.id == attachment.id)) {
                data.attachments.push(attachment);
                data.attachments.sort((a, b) => a.filename.localeCompare(b.filename));
            }
        } else {
            data.attachments = data.attachments.filter(attachmentFilter => attachmentFilter.id != attachment.id);
        }

        queryClient.setQueryData(queryKey, data);
    }
}

export default class AttachmentApi {
    static async create(attachment: CreateOrUpdateAttachment) {
        const formData = new FormData();
        for (const [key, value] of Object.entries(attachment)) {
            if (value != null) {
                if (value instanceof File) {
                    formData.append(key, value, value.name);
                } else {
                    formData.append(key, value);
                }
            }
        }
        const newAttachment = await Api.post<Attachment>('attachments', formData);

        updateQueryCache(attachment.modelId, attachment.model, newAttachment);

        return newAttachment;
    }

    static async delete(id: string, modelId: string, model: AttachmentModel) {
        await Api.delete(`attachments/${id}/${model}`);

        updateQueryCache(modelId, model, { id });
    }
}
