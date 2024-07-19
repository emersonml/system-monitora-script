import { useState } from 'react';

import { Button, Card, Table } from 'antd';
import { MdPrint } from 'react-icons/md';
import styled from 'styled-components';

import CardTitle from '@components/CardTitle';
import Layout from '@components/Layout';
import Filters, { initialValues as initialFilterValues } from '@components/Page/Audits/Filters';
import useFormat from '@hooks/Format';
import useReport from '@hooks/Report';
import useSortTable from '@hooks/SortTable';
import AuditApi from '@services/Api/AuditApi';
import useAuthState from '@states/AuthState';
import useTranslationState from '@states/TranslationState';

export default function AuditsPage() {
    const authState = useAuthState();
    const { translation } = useTranslationState();

    const [pagination, setPagination] = useState({ page: 1, size: 10 });
    const [filter, setFilter] = useState(initialFilterValues);

    const report = useReport();
    const format = useFormat();
    const [sort, setSort] = useSortTable();

    const audits = AuditApi.list({ translation, sort, ...pagination, ...filter });

    function handlePrint() {
        report(async () => {
            const audits = await AuditApi.listWithPromise({ translation, ...filter });

            return {
                title: translation('Auditoria'),
                content: [
                    {
                        text: translation('Auditoria'),
                        style: {
                            bold: true
                        },
                        margin: [0, 0, 0, 10]
                    },
                    {
                        text: [
                            {
                                text: translation('Total de registros:'),
                                style: {
                                    bold: true
                                }
                            },
                            ' ',
                            String(audits.total)
                        ],
                        margin: [0, 0, 0, 10]
                    },
                    {
                        table: {
                            widths: ['auto', '*'],
                            body: [
                                [translation('Data'), translation('Descrição')],
                                ...audits.list.map(audit => [
                                    format.date(audit.date, 'dd/MM/yyyy HH:mm'),
                                    audit.description
                                ])
                            ]
                        },
                        layout: 'lightHorizontalLines'
                    }
                ],
                extra: {
                    footer: {
                        text: translation('Relatório gerado em {{date}} por {{author}}', {
                            date: format.date(new Date(), 'dd/MM/yyyy HH:mm:ss'),
                            author: authState?.user?.name || ''
                        }),
                        alignment: 'right',
                        fontSize: 10,
                        margin: [0, 0, 15, 0]
                    }
                }
            };
        });
    }

    return (
        <Layout>
            <Card
                title={
                    <CardTitle
                        value={translation('Auditoria')}
                        toolbar={
                            <Button
                                type="primary"
                                icon={<MdPrint size={18} />}
                                disabled={audits.isLoading || audits.data?.list?.length == 0}
                                onClick={handlePrint}>
                                {translation('Imprimir')}
                            </Button>
                        }
                    />
                }>
                <Filters
                    onChange={filters => {
                        setPagination(pagination => ({ page: 1, size: pagination.size }));
                        setFilter(filters);
                    }}
                />
                <TableContainer
                    dataSource={audits.data?.list}
                    loading={audits.isLoading}
                    rowKey="id"
                    size="middle"
                    scroll={{ y: 'auto' }}
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.size,
                        total: audits.data?.total || 0,
                        showSizeChanger: true,
                        onChange: (page, size) => setPagination({ page, size })
                    }}
                    onChange={setSort}>
                    <Table.Column
                        title={translation('Data')}
                        dataIndex="date"
                        width={150}
                        sorter
                        render={date => format.date(date, 'dd/MM/yyyy HH:mm')}
                    />
                    <Table.Column title={translation('Descrição')} dataIndex="description" width={400} />
                </TableContainer>
            </Card>
        </Layout>
    );
}

const TableContainer = styled(Table)`
    .ant-table-body {
        max-height: calc(100vh - 421px) !important;
    }
    @media (max-width: 1300px) {
        .ant-table-body {
            max-height: calc(100vh - 499px) !important;
        }
    }
    @media (max-width: 700px) {
        .ant-table-body {
            max-height: 100vh !important;
        }
    }
`;
