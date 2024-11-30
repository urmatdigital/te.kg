import { NextRequest, NextResponse } from 'next/server';

const MOYSKLAD_API_URL = 'https://api.moysklad.ru/api/remap/1.2';
const MOYSKLAD_LOGIN = 'admin@tulparex';
const MOYSKLAD_PASSWORD = 'Tulpar321654987*';

// Создаем Basic Auth токен
const basicAuth = Buffer.from(`${MOYSKLAD_LOGIN}:${MOYSKLAD_PASSWORD}`).toString('base64');

async function getMoyskladToken(): Promise<string> {
  const response = await fetch(`${MOYSKLAD_API_URL}/security/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuth}`,
      'Accept-Encoding': 'gzip',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function makeRequest(
  endpoint: string,
  method: string = 'GET',
  token: string,
  body?: any,
  params?: URLSearchParams
) {
  const url = new URL(`${MOYSKLAD_API_URL}${endpoint}`);
  if (params) {
    url.search = params.toString();
  }

  const response = await fetch(url.toString(), {
    method,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept-Encoding': 'gzip',
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// GET /api/moysklad/counterparties
export async function GET(request: NextRequest) {
  try {
    const token = await getMoyskladToken();
    const searchParams = request.nextUrl.searchParams;
    
    // Получаем параметры запроса
    const search = searchParams.get('search');
    const filter = searchParams.get('filter');
    const limit = searchParams.get('limit') || '100';
    const offset = searchParams.get('offset') || '0';
    const order = searchParams.get('order');

    // Формируем параметры для запроса к МойСклад
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filter) params.append('filter', filter);
    params.append('limit', limit);
    params.append('offset', offset);
    if (order) params.append('order', order);

    const data = await makeRequest('/entity/counterparty', 'GET', token, null, params);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in counterparties API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch counterparties' },
      { status: 500 }
    );
  }
}

// POST /api/moysklad/counterparties
export async function POST(request: NextRequest) {
  try {
    const token = await getMoyskladToken();
    const body = await request.json();
    
    const data = await makeRequest('/entity/counterparty', 'POST', token, body);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating counterparty:', error);
    return NextResponse.json(
      { error: 'Failed to create counterparty' },
      { status: 500 }
    );
  }
}

// PUT /api/moysklad/counterparties/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getMoyskladToken();
    const body = await request.json();
    
    const data = await makeRequest(
      `/entity/counterparty/${params.id}`,
      'PUT',
      token,
      body
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating counterparty:', error);
    return NextResponse.json(
      { error: 'Failed to update counterparty' },
      { status: 500 }
    );
  }
}

// DELETE /api/moysklad/counterparties/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getMoyskladToken();
    
    await makeRequest(`/entity/counterparty/${params.id}`, 'DELETE', token);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting counterparty:', error);
    return NextResponse.json(
      { error: 'Failed to delete counterparty' },
      { status: 500 }
    );
  }
}
