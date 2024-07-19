import Image from 'next/image';

type Props = {
    name: string;
    width?: number;
    height?: number;
    className?: string;
    onClick?: () => void;
};

const EXTS = [
    'csv',
    'doc',
    'docx',
    'jpeg',
    'jpg',
    'mp3',
    'mp4',
    'odp',
    'ods',
    'odt',
    'pdf',
    'png',
    'ppt',
    'pptx',
    'rar',
    'tar.gz',
    'tar',
    'tif',
    'tiff',
    'txt',
    'xls',
    'xlsx',
    'zip'
];

export default function DocumentIcon({ name, width = 42, height = 48, className, onClick }: Props) {
    const ext = EXTS.includes(name) ? name : 'default';

    return (
        <Image
            src={`/images/documents/${ext}.png`}
            alt={name}
            width={width}
            height={height}
            className={className}
            onClick={onClick}
        />
    );
}
