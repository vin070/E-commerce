import { useState } from "react";

export function usePagination(limit: number, offset: number = 0, totalRecord: number = 0) {
    const [paginationConfig, setPaginationConfig] = useState<{ limit: number, offset: number, totalRecord: number }>({ limit, offset, totalRecord });

    //get total page  
    const getTotalPage = () => {
        return Math.ceil(paginationConfig.totalRecord / limit);
    }

    const updatePaginationConfig = (newOffset: number, totalRecord?: number) => {
        const { limit } = paginationConfig;
        //Offset to should be gte 0
        newOffset = Math.max(0, newOffset);

        newOffset = Math.min(newOffset, Math.max(0, (getTotalPage() - 1)) * limit);
        setPaginationConfig({ ...paginationConfig, totalRecord: totalRecord ?? paginationConfig.totalRecord, offset: newOffset })
    }

    //Navigate to next page
    const navigateToNextPage = () => {
        const { limit, offset } = paginationConfig;
        updatePaginationConfig(offset + limit);
    }

    //Navigate to previous page
    const navigateToPreviousPage = () => {
        const { limit, offset } = paginationConfig;
        updatePaginationConfig(offset - limit);
    }

    //navigate to Nth page
    const navigateToNPage = (pageNumber: number) => {
        updatePaginationConfig(paginationConfig.limit * (pageNumber - 1));
    }

    return {
        paginationConfig,
        navigateToNPage,
        navigateToNextPage,
        navigateToPreviousPage,
        getTotalPage,
        updatePaginationConfig
    }
}
