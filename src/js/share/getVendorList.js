import axios from 'axios';
/**
 * @param address for api call
 * @param increase on each request
 */
export const getVendorList = (url, pageNumber) => {
 
   const requst = axios({
    method: 'get',
    url,
    data: {
      page: pageNumber,
      page_size: 10,
      lat: 35.754,
      long: 51.328
    }
  });
  return requst.then((res) => res.data.data.finalResult);
}