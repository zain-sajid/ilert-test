import axios from 'axios';

type MutateMethod = 'POST' | 'PUT' | 'DELETE';

export const mutateData = async <T>(
  url: string,
  data: T,
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
