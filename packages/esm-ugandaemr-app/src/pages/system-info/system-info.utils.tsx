export const extractResourceInfo = (data) => {
  const arr = data[0]['resource']['compose']['include'][0]['concept'];
  return arr;
};
