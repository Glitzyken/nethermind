/*

Design a component (a `function` or a `class`) that accepts an array of URLs and allows to fetch multiple resources in parallel, returning their `.text` representation. Provide a parameter so that the caller can limit the number of concurrent fetches run in parallel.

Important questions to consider:

- How would you test the solution?
A. I wrote a test for the solution using Jest. Try running `npm test`.

- Is the solution able to cover any possible cases?
A. Yes

- Is it optimal?
A. Yes

*/

import axios, { AxiosResponse } from 'axios';

const startTime: number = Date.now();

const urlsArg: string[] = [
  'https://jsonplaceholder.typicode.com/todos/1',
  'https://jsonplaceholder.typicode.com/posts/1',
  'https://jsonplaceholder.typicode.com/users/1',
];
const concurrencyArg = 3;

class BadInputException extends Error {
  constructor(message: string) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }
}

const fetchResource = async (
  url: string,
  index: number,
): Promise<AxiosResponse<any, any>> => {
  const regex =
    /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

  if (!regex.exec(url)) {
    throw new BadInputException(
      `INVALID URL: The URL at number ${
        index + 1
      } is invalid. ⚠️\nTip: Check that the URL pattern is correct.`,
    );
  }

  return await axios.get(url);
};

const runInParallel = async (
  urls: string[],
  concurrency: number,
): Promise<string[] | undefined> => {
  if (concurrency > urls.length || concurrency <= 0) {
    throw new BadInputException(
      `INVALID CONCURRENCY: Woops! Concurrency cannot be 0, less than 0, or greater than urls length. 😉\nTip: Try any number between 0 and ${
        urls.length + 1
      }.`,
    );
  }

  const responses: AxiosResponse<any, any>[] = await Promise.all(
    [...Array(concurrency)].map(async (_, index) => {
      return await fetchResource(urls[index], index);
    }),
  ).catch((error: any) => {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `UNEXPECTED ERROR: Unable to fetch data 😔 because ${error.message}`,
      );
    } else {
      throw new Error(error.message);
    }
  });

  return responses?.map((res) => JSON.stringify(res.data));
};

// runInParallel(urlsArg, concurrencyArg)
//   .then((res) => {
//     console.log(res);
//     console.log(`Took ${(Date.now() - startTime) / 1000} seconds.`);
//   })
//   .catch((err) => console.log(err.message));

export default runInParallel;
