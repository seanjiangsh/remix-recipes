type DataWithDate = { createdAt?: string };
export const sortDataByCreatedDate = (
  a: DataWithDate,
  b: DataWithDate,
  desc?: boolean
) => {
  const nowString = new Date().toISOString();
  const aTime = new Date(a.createdAt || nowString).getTime();
  const bTime = new Date(b.createdAt || nowString).getTime();
  return desc ? aTime - bTime : bTime - aTime;
};
