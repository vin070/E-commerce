import { useEffect, useState } from "react";

const usePagination = (limit: number, totalRecord: number = 0) => {
    const [paginationConfig, setPaginationConfig] = useState<{ limit: number, offset: number, totalRecord: number }>({ limit, offset: 0, totalRecord });
    const [totalPage, setTotalPage] = useState<number>(0);

    useEffect(() => {
        setPaginationConfig((prev) => ({ ...prev, limit, totalRecord }))
        setTotalPage(Math.ceil(totalRecord / limit));
    }, [limit, totalRecord])

    const updatePaginationConfig = (newOffset: number) => {
        setPaginationConfig(prev => {
            const { limit } = prev;
            newOffset = Math.max(0, newOffset);
            newOffset = Math.min(newOffset, Math.max(0, (totalPage - 1)) * limit);
            return {
                ...prev,
                offset: newOffset
            };
        });
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
        totalPage,
        paginationConfig,
        navigateToNPage,
        navigateToNextPage,
        navigateToPreviousPage,
        updatePaginationConfig
    }
}

export default usePagination;