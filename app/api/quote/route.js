const WEBHOOK_URL =
  process.env.QUOTE_WEBHOOK_URL ||
  "https://script.google.com/macros/s/AKfycbz41daj3jwEu4Vp8RouQK5WO9TnBAsydTZ67OliIb12XuIwCn4jNYVdBHBmKtqrw9LY/exec";

function readField(body, key) {
  const value = body?.[key];
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const payload = {
    name: readField(body, "name"),
    phone: readField(body, "phone"),
    email: readField(body, "email"),
    address: readField(body, "address"),
    date: readField(body, "date"),
    service: readField(body, "service"),
    message: readField(body, "message"),
  };

  if (!payload.name || !payload.phone || !payload.address) {
    return Response.json({ error: "Name, phone, and address are required." }, { status: 400 });
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return Response.json({ error: "Quote request could not be saved." }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Quote request could not be saved." }, { status: 502 });
  }
}
