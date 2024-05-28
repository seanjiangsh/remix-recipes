type DataWithDate = { createdAt?: string };
export const sortDataByCreatedDate = (a: DataWithDate, b: DataWithDate) => {
  const nowString = new Date().toISOString();
  const aTime = new Date(a.createdAt || nowString).getTime();
  const bTime = new Date(b.createdAt || nowString).getTime();
  return bTime - aTime;
};
