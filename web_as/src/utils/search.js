export const searchItems = (items, query, searchFields) => {
  if (!query || query.trim() === '') {
    return items;
  }

  const lowerQuery = query.toLowerCase();

  return items.filter((item) =>
    searchFields.some((field) => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], item);
      return value && value.toString().toLowerCase().includes(lowerQuery);
    })
  );
};

export const filterItems = (items, filters) => {
  return items.filter((item) =>
    Object.entries(filters).every(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        return true;
      }
      return item[key] === value;
    })
  );
};

export const sortItems = (items, sortBy, sortOrder = 'asc') => {
  const sorted = [...items];
  sorted.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};

export const searchAndFilter = (items, query, searchFields, filters, sortBy, sortOrder) => {
  let result = items;

  if (query) {
    result = searchItems(result, query, searchFields);
  }

  if (filters && Object.keys(filters).length > 0) {
    result = filterItems(result, filters);
  }

  if (sortBy) {
    result = sortItems(result, sortBy, sortOrder);
  }

  return result;
};
