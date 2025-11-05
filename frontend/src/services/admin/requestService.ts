import API from "../APIClient";

export const fetchRoleRequests = async ({
  status,
  email,
  page,
  limit,
}: {
  status?: string;
  email?: string;
  page?: number;
  limit?: number;
}) => {
  const params: any = {};
  if (status && status !== "all") params.status = status;
  if (email) params.email = email;
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const { data } = await API.get("/role/requests", {
    params,
  });
  return data;
};
