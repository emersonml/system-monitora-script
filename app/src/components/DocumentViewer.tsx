import Script from 'next/script';
import { useEffect, useState } from 'react';

import { Modal } from 'antd';
import { MdDownload } from 'react-icons/md';
import styled from 'styled-components';

import useDocumentViewerState from '@states/DocumentViewerState';
import FileBrowser from '@utils/FileBrowser';
import Util from '@utils/Util';

export default function DocumentViewer() {
    const { visible, type, title, url, hide } = useDocumentViewerState();

    const [loading, setLoading] = useState(true);
    const [localUrl, setLocalUrl] = useState<string>();

    const isIframe = /^pdf|txt|mp(3|4)|docx?|odt|csv|xlsx?|ods|pptx?|odp$/i.test(type);
    const isImage = /^png|jpe?g|tiff?$/i.test(type);

    useEffect(() => {
        setLocalUrl(url);
    }, [url]);

    useEffect(() => {
        (async () => {
            setLoading(true);

            if (/^tiff?$/i.test(type)) {
                try {
                    const buffer = await Util.imageUrlToArrayBuffer(url);
                    setLocalUrl(new window.Tiff({ buffer }).toDataURL());
                } catch (error) {
                    setLocalUrl(url);
                }
            } else if (/^docx?|odt|csv|xlsx?|ods|pptx?|odp?$/i.test(type)) {
                setLocalUrl(`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURI(url)}`);
            }

            setLoading(false);
        })();
    }, [type]);

    function handleDownload() {
        FileBrowser.save(`${url}&download=true`, title);
    }

    return (
        <>
            <Script src="js/tiff.min.js" />

            <Container visible={visible} title={title} onCancel={hide} destroyOnClose>
                <DownloadButton onClick={handleDownload}>
                    <MdDownload size={20} />
                </DownloadButton>

                {!loading && (
                    <>
                        {isIframe && <object data={localUrl} aria-label={title} />}
                        {isImage && <img src={localUrl} alt={title} />}
                    </>
                )}
            </Container>
        </>
    );
}

const Container = styled(Modal)`
    top: 8px !important;
    width: 80vw !important;
    padding: 0 !important;
    margin: 0 auto !important;
    max-width: calc(100vw - 16px) !important;
    object,
    embed {
        width: 100%;
        height: 100%;
        border: none;
    }
    .ant-modal-body {
        display: flex;
        align-items: center;
        justify-content: center;
        height: calc(100vh - 71px) !important;
        padding: 0 !important;
        img {
            max-width: 90%;
            max-height: 90%;
        }
    }
    .ant-modal-footer {
        display: none !important;
    }
    @media (max-width: 1000px) {
        width: calc(100vw - 16px) !important;
    }
`;

const DownloadButton = styled.a`
    position: absolute;
    top: 17px;
    right: 50px;
    line-height: 0;
`;
