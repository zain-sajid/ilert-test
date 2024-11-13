import axios from 'axios';

type MutateMethod = 'POST' | 'PUT' | 'DELETE';

export const mutateData = async (
  url: string,
  data: any,
  method: MutateMethod
) => {
  return await axios({
    method,
    url,
    data,
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ILERT_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
};
