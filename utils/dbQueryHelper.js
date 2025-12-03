export const buildSearchFilter = (search, additionalFilters = {}) => {
  const searchFilter = search.trim() !== "" 
    ? { title: { $regex: search, $options: "i" } } 
    : {};
  
  return { ...searchFilter, ...additionalFilters };
};

export const calculatePagination = (page, limit) => ({
  skip: (page - 1) * limit,
  limit: Number(limit),
});

export const buildPaginationMeta = (page, limit, totalItems) => ({
  currentPage: Number(page),
  totalPages: Math.ceil(totalItems / limit),
  totalItems,
});