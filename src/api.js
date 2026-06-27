const API_BASE_URL = (import.meta.env.API_URL || '').trim().replace(/\/+$/, '');

const defaultCatalogMeta = {
  page: 1,
  pageSize: 12,
  totalItems: 0,
  totalPages: 0,
  itemsOnPage: 0,
  totalCompanies: 0,
  hasPreviousPage: false,
  hasNextPage: false,
  query: {
    search: '',
    industry: '',
    serviceType: '',
    region: '',
    city: '',
  },
};

const defaultFilterOptions = {
  industries: [],
  serviceTypes: [],
  regions: [],
  cities: [],
};

function buildApiUrl(path) {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

function buildCatalogPath(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    const normalizedValue = typeof value === 'string' ? value.trim() : value;

    if (normalizedValue === '') {
      return;
    }

    searchParams.set(key, String(normalizedValue));
  });

  const queryString = searchParams.toString();

  return queryString ? `/api/catalog?${queryString}` : '/api/catalog';
}

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

function hasCatalogMeta(meta) {
  return (
    meta &&
    Number.isInteger(meta.page) &&
    Number.isInteger(meta.pageSize) &&
    Number.isInteger(meta.totalItems) &&
    Number.isInteger(meta.totalPages)
  );
}

export async function fetchCatalog({ signal, ...params } = {}) {
  const response = await fetch(buildApiUrl(buildCatalogPath(params)), {
    method: 'GET',
    signal,
  });
  const payload = await readResponse(response);

  if (!response.ok) {
    throw createApiError(response, payload, 'Не удалось загрузить каталог компаний.');
  }

  if (!hasCatalogMeta(payload?.meta) || !payload?.filterOptions) {
    throw new Error('Backend /api/catalog вернул устаревший формат без meta-пагинации. Перезапустите или пересоберите backend.');
  }

  return {
    companies: Array.isArray(payload?.companies) ? payload.companies : [],
    conferenceDates: Array.isArray(payload?.conferenceDates) ? payload.conferenceDates : [],
    timeOptions: Array.isArray(payload?.timeOptions) ? payload.timeOptions : [],
    filterOptions: {
      industries: Array.isArray(payload?.filterOptions?.industries) ? payload.filterOptions.industries : [],
      serviceTypes: Array.isArray(payload?.filterOptions?.serviceTypes) ? payload.filterOptions.serviceTypes : [],
      regions: Array.isArray(payload?.filterOptions?.regions) ? payload.filterOptions.regions : [],
      cities: Array.isArray(payload?.filterOptions?.cities) ? payload.filterOptions.cities : [],
    },
    meta: {
      ...defaultCatalogMeta,
      ...payload?.meta,
      query: {
        ...defaultCatalogMeta.query,
        ...payload?.meta?.query,
      },
    },
  };
}

export function getDefaultCatalogMeta() {
  return defaultCatalogMeta;
}

export function getDefaultFilterOptions() {
  return defaultFilterOptions;
}

export async function createMeetingRequest(form) {
  const response = await fetch(buildApiUrl('/api/meeting-requests'), {
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
