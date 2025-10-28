import API from "../APIClient";

const responseRequest = async ({
  id,
  status,
}: {
  id: string;
  status: "approved" | "rejected";
}) => {
  const res = await API.post(`/role/response-request/${id}`, { status });
  return res.data;
};

export default responseRequest;
