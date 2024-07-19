import { useCallback, useState } from 'react';

import { FilterValue, SorterResult, TableCurrentDataSource, TablePaginationConfig } from 'antd/lib/table/interface';

import { PrismaTypes } from '@services/Prisma';

type TableChange<T> = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[],
    extra: TableCurrentDataSource<T>
) => void;

export default function useSortTable<T>(): [string, TableChange<T>] {
    const [sort, setSort] = useState<string>(undefined);

    const handleTableChange = useCallback(
        (
            pagination: TablePaginationConfig,
            filters: Record<string, FilterValue | null>,
            sorter: SorterResult<T> | SorterResult<T>[],
            extra: TableCurrentDataSource<T>
        ) => {
            if (extra.action == 'sort') {
                if (Array.isArray(sorter)) {
                    sorter = sorter[0];
                }

                if (sorter.order) {
                    if (Array.isArray(sorter.field)) {
                        sorter.field = sorter.field.join('.');
                    }
                    setSort((sorter.order == 'descend' ? '-' : '') + sorter.field);
                } else {
                    setSort(undefined);
                }
            }
        },
        []
    );

    return [sort, handleTableChange];
}

export function parseSort(sort: string): Record<string, PrismaTypes.Prisma.SortOrder> {
    if (!sort) return undefined;

    const direction: PrismaTypes.Prisma.SortOrder = sort.startsWith('-') ? 'desc' : 'asc';
    const field = sort.replace('-', '');

    return { [field]: direction };
}
