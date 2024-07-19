import { css } from 'styled-components';

type Span = {
    [key: number]: string;
};

export function grid(templateAreas: string | number, span?: Span) {
    if (typeof templateAreas == 'number') {
        const childCount = templateAreas;

        templateAreas = '';
        for (let i = 1; i <= childCount; i++) {
            templateAreas += '#\n';
        }
    }

    let childCount = 0;
    templateAreas = templateAreas
        .trim()
        .split('\n')
        .map(row => `'${row.trim()}'`)
        .join('\n')
        .replace(/(#)/g, () => `C${++childCount}`);

    let nthChild = '';
    for (let i = 1; i <= childCount; i++) {
        let area = `C${i}`;

        if (span) {
            if (span[i]) {
                if (span[i].startsWith('#')) {
                    area = span[i].replace('#', '').trim();
                } else {
                    area = `C${i} / ${span[i].trim()}`;
                }
            }
        }

        nthChild += `
            > :nth-child(${i}) {
                grid-area: ${area};
            }
        `;
    }

    const columns = templateAreas.split('\n')[0].match(/([.C])/g).length;

    return css`
        display: grid;
        grid-template-columns: repeat(${columns}, minmax(0, 1fr));
        grid-template-areas: ${templateAreas};
        ${nthChild}
    `;
}

export function textEllipsis(lines = 1) {
    return css`
        display: -webkit-box;
        -webkit-line-clamp: ${lines};
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        word-break: break-word;
        overflow: hidden;
    `;
}
