import {axiosInstance} from './axiosInstance';

export interface ISicks {
  sickCd: string;
  sickNm: string;
}

const URL_SICK = 'sick';

export const getSick = async (param: string): Promise<ISicks[]> => {
  if (param === '') return [];
  if ('caches' in window) {
    const payload = {
      sickNm_like: param,
    };

    const queryStr = new URLSearchParams(payload).toString();
    const cacheStorage = await caches.open(URL_SICK);
    const cachedResponse = await cacheStorage.match(queryStr);

    if (!cachedResponse || !cachedResponse.ok) {
      const config = {
        params: {
          q : param
        },
      };
      const { data } = await axiosInstance.get(`/${URL_SICK}`, config);
      const resultData = data.slice(0, 7);
      cacheStorage.put(queryStr, new Response(JSON.stringify(resultData)));
      return resultData;
    }

    const cached = await cachedResponse?.json();
    return cached;
  }

  return [];
};