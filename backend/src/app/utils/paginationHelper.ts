type IOptions = {
    page?: unknown,
    limit?: unknown,
    sortOrder?: unknown,
    sortBy?: unknown
}

type IOptionsResult = {
    page: number,
    limit: number,
    skip: number,
    sortBy: string,
    sortOrder: string
}

const calculatePagination = (options: IOptions): IOptionsResult => {
    const requestedPage = Number(options.page);
    const requestedLimit = Number(options.limit);
    const page = Number.isFinite(requestedPage) && requestedPage > 0
        ? Math.floor(requestedPage)
        : 1;
    const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(Math.floor(requestedLimit), 100)
        : 10;
    const skip = (page - 1) * limit;

    const sortBy = typeof options.sortBy === 'string' ? options.sortBy : 'createdAt';
    const requestedSortOrder = typeof options.sortOrder === 'string'
        ? options.sortOrder.toLowerCase()
        : 'desc';
    const sortOrder = requestedSortOrder === 'asc' ? 'asc' : 'desc';

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
}


export const paginationHelper = {
    calculatePagination
}