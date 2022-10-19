import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';
import { uploadeRecipe } from './model.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadeData = undefined) {
  try {
    const fetchPro = uploadeData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadeData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    //   console.log(data);
    return data;
  } catch (err) {
    throw err;
  }
};

/* export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    // const res = await fetch(url);
    // console.log(res);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    //   console.log(data);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadeData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadeData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    //   console.log(data);
    return data;
  } catch (err) {
    throw err;
  }
};
 */
