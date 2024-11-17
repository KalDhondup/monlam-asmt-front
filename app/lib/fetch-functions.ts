
interface FetchFunction {
  path: string,
  method: 'GET' | 'POST' | 'DELETE' | 'PUT',
  body?: any;
}

export async function fileUpload({ path, method, body }: FetchFunction) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${path}`, {
      method,
      body,
    });

    if (!response.ok) throw { error: new Error("Server Failed") };

    return { data: await response.json() };

  } catch (error) {
    return { error }
  }
}

export async function fetchFunction({ path, method, body }: FetchFunction) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}${path}`, {
      method,
      body,
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) throw { error: new Error("Server Failed") };

    return { data: await response.json() };

  } catch (error) {
    return { error }
  }
}