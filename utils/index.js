export const getToken = async (sql_query, axios, apiKey) => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };
  
    const data = {
      sql: sql_query,
      ttlMinutes: 2,
    };
    const result = await axios.post(
      "https://node-api.flipsidecrypto.com/queries",
      data,
      { headers }
    );
    if (result && result.status === 200)
      return {
        status: 200,
        result: result.data.token,
      };
    else return getToken(sql_query, axios, apiKey);
  };
  
  export const getData = async (token, axios, apiKey) => {
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    };
  
    const result = await axios.get(
      `https://node-api.flipsidecrypto.com/queries/${token}?pageNumber=1&pageSize=100000`,
      { headers }
    );
    if (result && result.status === 200) {
      if (result.data.status === "running") {
        return getData(token, axios, apiKey);
      } else {
        return {
          status: 200,
          result: result.data,
        };
      }
    } else {
      return getData(token, axios, apiKey);
    }
  };