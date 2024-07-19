import Util from '@utils/Util';

export default class FileBrowser {
    static open({ accept = '*', multiple = false }) {
        return new Promise<File[]>(resolve => {
            const input = window.document.createElement('input');
            input.type = 'file';
            input.accept = accept;
            input.multiple = multiple;
            input.onchange = () =>
                resolve(
                    Array.from(input.files).filter(file => {
                        if (accept == '*') return true;

                        return accept.includes(Util.getExtName(file.name));
                    })
                );
            input.click();

            document.body.onfocus = () => {
                Util.delay(100, () => {
                    if (input.files.length == 0) {
                        resolve(null);
                    }
                });

                document.body.onfocus = null;
            };
        });
    }

    static save(url: string, filename: string) {
        const link = window.document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    }
}
