export const transformItem = (item) => ({
  title: item.title,
  description: item.description,
});

export const transformItems = (items) => items.map(transformItem);
