async function readResponse(response) {
  const contentType = response.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    return null;
  }

  return response.json();
}

function createApiError(response, payload, fallbackMessage) {
  const error = new Error(payload?.message || fallbackMessage);

  error.status = response.status;
  error.details = payload?.errors ?? null;

  return error;
}

export async function fetchCatalog({ signal } = {}) {
  const response = await fetch('/api/catalog', {
    method: 'GET',
    signal,
  });
  const payload = await readResponse(response);

  if (!response.ok) {
    throw createApiError(response, payload, 'Не удалось загрузить каталог компаний.');
  }

  return {
    companies: Array.isArray(payload?.companies) ? payload.companies : [],
    conferenceDates: Array.isArray(payload?.conferenceDates) ? payload.conferenceDates : [],
    timeOptions: Array.isArray(payload?.timeOptions) ? payload.timeOptions : [],
  };
}

export async function createMeetingRequest(form) {
  const response = await fetch('/api/meeting-requests', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(form),
  });
  const payload = await readResponse(response);

  if (!response.ok) {
    throw createApiError(response, payload, 'Не удалось отправить заявку.');
  }

  return payload;
}
