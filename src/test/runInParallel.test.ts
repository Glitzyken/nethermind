import runInParallel from '../index';

test('the fetch succeeds with an array of strings', async () => {
  const data: string[] | undefined = await runInParallel(urlsArg, 3);

  expect(data).toHaveLength(3);

  data?.forEach((el) => expect(typeof el).toBe('string'));
});

test('the fetch fails by a invalid concurrency input', async () => {
  expect.assertions(1);
  try {
    await runInParallel(urlsArg, 0);
  } catch (e: any) {
    expect(e.message).toMatch('INVALID CONCURRENCY:');
  }
});

test('the fetch fails by an invalid url input case 1', async () => {
  expect.assertions(1);
  try {
    await runInParallel(badUrlsArg1, 3);
  } catch (e: any) {
    expect(e.message).toMatch('INVALID URL:');
  }
});

test('the fetch fails by an invalid url input case 2', async () => {
  expect.assertions(1);
  try {
    await runInParallel(badUrlsArg2, 2);
  } catch (e: any) {
    expect(e.message).toMatch('UNEXPECTED ERROR:');
  }
});

const urlsArg: string[] = [
  'https://jsonplaceholder.typicode.com/todos/1',
  'https://jsonplaceholder.typicode.com/posts/1',
  'https://jsonplaceholder.typicode.com/users/1',
  'https://jsonplaceholder.typicode.com/users/1',
  'https://jsonplaceholder.typicode.com/users/1',
];

const badUrlsArg1: string[] = [
  'htps://jsonplaceholder.typicode.com/todos/1', // invalid url
  'https://jsonplaceholder.typicode.com/posts/1',
  'https://jsonplaceholder.typicode.com/users/1',
];

const badUrlsArg2: string[] = [
  'https://jsonplaceholder.typicode.com/ptttttttttts/1',
  'https://jsonplaceholder.typicode.com/users/1',
];
