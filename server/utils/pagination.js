export const paginate = (requestFilters, totalCount, dbResult) => {
    const { limit = 10, pageNo = 1, offset = 0 } = requestFilters;
    const parsedLimit = parseInt(limit, 10);
    const parsedPageNo = parseInt(pageNo, 10);

    const totalPages = totalCount < parsedLimit ? 1 : Math.ceil(totalCount / parsedLimit);

    return {
        offset: +offset,
        limit: parsedLimit,
        currentPage: parsedPageNo,
        totalCount: +totalCount,
        totalPages,
        hasNext: parsedPageNo < totalPages,
        hasLast: parsedPageNo < totalPages,
        hasFirst: parsedPageNo > 1,
        hasPrevious: parsedPageNo > 1,
    };
};
