export async function execute_query(apiMethod, body, table) {
  const response = await fetch(
    `http://localhost:4000/${apiMethod}?table=${table}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  const data = await response.json();
  return data;
}
