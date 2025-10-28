import API from "../APIClient";

const fetchRequestDetail = async (id: string) => {
  const res = await API.get(`/role/requests/${id}`);
  return res.data;
};
export default fetchRequestDetail;
