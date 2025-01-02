import { Billboard } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`;

const getBillboards = async (id: string): Promise<Billboard[]> => {
  const response = await fetch(`${URL}/${id}`);

  return response.json();
};

export default getBillboards;
    