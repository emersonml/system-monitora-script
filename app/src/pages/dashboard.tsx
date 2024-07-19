import { useState } from 'react';

import { Card, Table } from 'antd';
import styled from 'styled-components';

import Layout from '@components/Layout';
import { initialValues as initialFilterValues } from '@components/Page/Users/Filters';
import CompanyApi from '@services/Api/CompanyApi';

export default function DashboardPage() {
    const [pagination, setPagination] = useState({ page: 1, size: 10 });
    const [filter] = useState(initialFilterValues);
    const companies = CompanyApi.list({ ...pagination, ...filter });

    return (
        <Layout>
            <Container>
                <h4>Informações xxxx bhdos Condomínios</h4>
            </Container>

            <Card>
                <Summary>
                    <strong>Condomínios Cadastrados: </strong>
                    <span>{companies?.data?.total || 0}</span>
                </Summary>
                <TableContainer
                    dataSource={companies.data?.list}
                    loading={companies.isLoading}
                    rowKey="id"
                    size="middle"
                    scroll={{ y: 'auto' }}
                    pagination={{
                        current: pagination.page,
                        pageSize: pagination.size,
                        total: companies.data?.total || 0,
                        showSizeChanger: true,
                        onChange: (page, size) => setPagination({ page, size })
                    }}>
                    <Table.Column title="Nome Fantasia" dataIndex="name" width={300} />
                    <Table.Column title="CNPJ" dataIndex="cnpj" width={300} />
                    <Table.Column title="Telefone" dataIndex="phone" width={300} />
                </TableContainer>
            </Card>
        </Layout>
    );
}

const Summary = styled.div`
    display: grid;
    grid-template-columns: max-content max-content;
    grid-gap: 4px 16px;
    margin-bottom: 8px;

    span {
        text-align: right;
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;

    h4 {
        font-weight: normal;
        color: #d1d2d4;
    }
`;

const TableContainer = styled(Table)`
    .ant-table-body {
        max-height: calc(100vh - 421px) !important;
    }

    @media (max-width: 700px) {
        .ant-table-body {
            max-height: calc(100vh - 532px) !important;
        }
    }

    @media (max-width: 430px) {
        .ant-table-body {
            max-height: 100vh !important;
        }
    }
`;
