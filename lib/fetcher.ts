import axios from 'axios';

export const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const fetcherWithAuthHeader = (url: string) =>
  axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ILERT_API_KEY}`
      }
    })
    .then((res) => res.data);
