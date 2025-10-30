import { TIMEOUT_SEC } from "./config.js";

// this timeout func will determine the fetching should be rejected if it isn't finished in given time taken
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function(url, uploadData = undefined) {
    try{
      const fetchPro = uploadData ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(uploadData),
        }) : fetch(url);
      
      const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // use Promise.race to race fetching and timeout
      const data = await res.json();
              
      if(!res.ok) throw new Error(`${data.message} ${res.status}`);
      return data;
    }
    catch(err)
    {
        throw err;
    }
}

/*
export const getJSON = async function(url) {
    try{
        const fetchPro = fetch(url);
        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // use Promise.race to race fetching and timeout
        const data = await res.json();
                
        if(!res.ok) throw new Error(`${data.message} ${res.status}`);
        return data;
    }
    catch(err)
    {
        throw err;
    }
}

 export const sendJSON = async function(url, uploadData) {
    try{
        const fetchPro = fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(uploadData),
        });

        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // use Promise.race to race fetching and timeout
        const data = await res.json();
                
        if(!res.ok) throw new Error(`${data.message} ${res.status}`);
        return data;
    }
    catch(err)
    {
        throw err;
    }
}
 */