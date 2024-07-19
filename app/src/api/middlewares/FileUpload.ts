import multer from 'multer';

import { DOCUMENTS_PATH } from '@utils/Environment';
import Util from '@utils/Util';

const CONFIG = {
    storage: multer.diskStorage({
        destination: DOCUMENTS_PATH,
        filename: (req, file, callback) => {
            callback(null, `${Util.uuid()}${Util.getExtName(file.originalname)}`);
        }
    })
};

export function file(field = 'file') {
    return multer(CONFIG).single(field);
}

export function files(field = 'files') {
    return multer(CONFIG).array(field);
}
