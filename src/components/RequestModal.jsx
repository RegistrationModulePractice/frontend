import { useEffect, useState } from 'react';

const timeOptions = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

function getInitialForm(company) {
  return {
    companyId: company?.id ?? '',
    companyName: company?.name ?? '',
    initiatorName: '',
    phone: '+7 ',
    email: '',
    date: '',
    time: '',
    topic: '',
    request: '',
    consent: false,
  };
}

function normalizePhone(value) {
  const digits = value.replace(/\D/g, '');
  let normalized = digits;

  if (normalized.startsWith('8')) {
    normalized = `7${normalized.slice(1)}`;
  }

  if (!normalized.startsWith('7')) {
    normalized = `7${normalized}`;
  }

  normalized = normalized.slice(0, 11);

  const country = normalized[0] ?? '7';
  const area = normalized.slice(1, 4);
  const middle = normalized.slice(4, 7);
  const pairOne = normalized.slice(7, 9);
  const pairTwo = normalized.slice(9, 11);

  let result = `+${country}`;

  if (area) {
    result += ` (${area}`;
  }

  if (area.length === 3) {
    result += ')';
  }

  if (middle) {
    result += ` ${middle}`;
  }

  if (pairOne) {
    result += `-${pairOne}`;
  }

  if (pairTwo) {
    result += `-${pairTwo}`;
  }

  return result;
}

function validateForm(form, conferenceDates) {
  const errors = {};

  if (!form.companyId || !form.companyName) {
    errors.companyName = 'Компания не выбрана.';
  }

  if (!form.initiatorName.trim() || form.initiatorName.trim().length < 3) {
    errors.initiatorName = 'Укажите имя и фамилию.';
  }

  const phoneDigits = form.phone.replace(/\D/g, '');
  if (phoneDigits.length !== 11) {
    errors.phone = 'Введите телефон в формате +7 (___) ___-__-__.';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(form.email.trim())) {
    errors.email = 'Укажите корректный email.';
  }

  if (!conferenceDates.some((date) => date.value === form.date)) {
    errors.date = 'Выберите один из дней конференции.';
  }

  if (!timeOptions.includes(form.time)) {
    errors.time = 'Выберите доступное время.';
  }

  if (!form.topic.trim() || form.topic.trim().length < 5) {
    errors.topic = 'Кратко обозначьте тему встречи.';
  } else if (form.topic.trim().length > 255) {
    errors.topic = 'Максимум 255 символов.';
  }

  if (form.request.trim().length > 1000) {
    errors.request = 'Максимум 1000 символов.';
  }

  if (!form.consent) {
    errors.consent = 'Нужно согласие на обработку персональных данных.';
  }

  return errors;
}

function fieldClasses(hasError) {
  return `mt-2 w-full rounded-2xl border px-4 py-3 text-sm text-slate-700 shadow-inner shadow-white/60 ${
    hasError
      ? 'border-rose-300 bg-rose-50/80'
      : 'border-slate-200 bg-white/90 hover:border-sky-300 focus:border-sky-400'
  }`;
}

async function fakeSubmitRequest(form) {
  await new Promise((resolve) => {
    setTimeout(resolve, 1200);
  });

  if (form.email.toLowerCase().includes('fail-demo')) {
    throw new Error('Демо-отправка вернула ошибку. Попробуйте снова.');
  }
}

export function RequestModal({ isOpen, company, conferenceDates, onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(getInitialForm(company));
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitState, setSubmitState] = useState('idle');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setStep(1);
    setTouched({});
    setSubmitAttempted(false);
    setSubmitState('idle');
    setSubmitError('');
    setIsSubmitting(false);
    setForm(getInitialForm(company));
  }, [company, isOpen]);

  if (!isOpen || !company) {
    return null;
  }

  const errors = validateForm(form, conferenceDates);
  const stepOneFields = ['initiatorName', 'phone', 'email', 'consent'];
  const stepTwoFields = ['companyName', 'date', 'time', 'topic', 'request'];
  const stepOneHasErrors = stepOneFields.some((field) => errors[field]);
  const hasFormErrors = Object.keys(errors).length > 0;

  const showError = (field) => (touched[field] || submitAttempted ? errors[field] : '');

  const markTouched = (fields) => {
    const nextTouched = {};

    fields.forEach((field) => {
      nextTouched[field] = true;
    });

    setTouched((current) => ({
      ...current,
      ...nextTouched,
    }));
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;

    setForm((current) => ({
      ...current,
      [name]: name === 'phone' ? normalizePhone(nextValue) : nextValue,
    }));
  };

  const handleNext = () => {
    markTouched(stepOneFields);

    if (!stepOneHasErrors) {
      setStep(2);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitAttempted(true);
    markTouched([...stepOneFields, ...stepTwoFields]);

    if (hasFormErrors) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await fakeSubmitRequest(form);
      setSubmitState('success');
    } catch (error) {
      setSubmitState('error');
      setSubmitError(error instanceof Error ? error.message : 'Не удалось отправить заявку.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-white/75 bg-slate-50 shadow-panel"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-700"
          aria-label="Закрыть окно"
        >
          ×
        </button>

        <div className="border-b border-slate-200 bg-gradient-to-r from-sky-500 via-sky-600 to-cyan-500 p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">Запись на встречу</p>
          <h3 id="request-modal-title" className="mt-3 max-w-2xl font-display text-2xl font-bold sm:text-3xl">
            {submitState === 'success' ? 'Заявка принята' : `Встреча с компанией «${company.name}»`}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">
            {submitState === 'success'
              ? 'В демо-версии заявка сохраняется на клиенте. На следующем этапе сюда подключаются CRM Tilda и email-уведомления.'
              : 'Форма разбита на 2 шага, компания подставляется автоматически, а время ограничено днями конференции.'}
          </p>
        </div>

        {submitState === 'success' ? (
          <div className="p-6 sm:p-8">
            <div className="rounded-[28px] border border-emerald-100 bg-emerald-50/80 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-2xl text-white">
                ✓
              </div>
              <h4 className="mt-5 font-display text-2xl font-bold text-brand-ink">Представитель скоро свяжется с вами</h4>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Компания: <span className="font-semibold text-slate-800">{form.companyName}</span>
                <br />
                Контакт: <span className="font-semibold text-slate-800">{form.initiatorName}</span>
                <br />
                Окно встречи:{' '}
                <span className="font-semibold text-slate-800">
                  {conferenceDates.find((date) => date.value === form.date)?.label}, {form.time}
                </span>
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setTouched({});
                  setSubmitAttempted(false);
                  setSubmitState('idle');
                  setForm(getInitialForm(company));
                }}
                className="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:border-sky-300 hover:text-brand-blue"
              >
                Заполнить заново
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-brand-blue px-5 py-3 text-sm font-bold text-white hover:bg-sky-600"
              >
                Закрыть
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              {[1, 2].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold ${
                      step === stepNumber
                        ? 'border-brand-blue bg-brand-blue text-white'
                        : 'border-slate-200 bg-white text-slate-400'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  <span className="text-sm font-semibold text-slate-500">
                    {stepNumber === 1 ? 'Контакты инициатора' : 'Параметры встречи'}
                  </span>
                </div>
              ))}
            </div>

            {submitState === 'error' && submitError ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {submitError}
              </div>
            ) : null}

            {step === 1 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-600">Компания-участник</span>
                  <input
                    type="text"
                    name="companyName"
                    value={form.companyName}
                    readOnly
                    className={`${fieldClasses(false)} cursor-not-allowed bg-slate-100/90 text-slate-500`}
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-600">ФИО инициатора</span>
                  <input
                    type="text"
                    name="initiatorName"
                    value={form.initiatorName}
                    onChange={handleChange}
                    onBlur={() => markTouched(['initiatorName'])}
                    placeholder="Например, Анна Смирнова"
                    className={fieldClasses(Boolean(showError('initiatorName')))}
                  />
                  {showError('initiatorName') ? (
                    <p className="mt-2 text-sm font-medium text-rose-600">{showError('initiatorName')}</p>
                  ) : null}
                </label>

                <label>
                  <span className="text-sm font-semibold text-slate-600">Телефон</span>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={() => markTouched(['phone'])}
                    placeholder="+7 (___) ___-__-__"
                    className={fieldClasses(Boolean(showError('phone')))}
                  />
                  {showError('phone') ? (
                    <p className="mt-2 text-sm font-medium text-rose-600">{showError('phone')}</p>
                  ) : null}
                </label>

                <label>
                  <span className="text-sm font-semibold text-slate-600">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={() => markTouched(['email'])}
                    placeholder="name@company.ru"
                    className={fieldClasses(Boolean(showError('email')))}
                  />
                  {showError('email') ? (
                    <p className="mt-2 text-sm font-medium text-rose-600">{showError('email')}</p>
                  ) : null}
                </label>

                <label className="sm:col-span-2">
                  <span className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={form.consent}
                      onChange={handleChange}
                      onBlur={() => markTouched(['consent'])}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-blue focus:ring-sky-400"
                    />
                    <span className="text-sm leading-6 text-slate-600">
                      Даю согласие на обработку персональных данных в рамках 152-ФЗ для связи по заявке на встречу.
                    </span>
                  </span>
                  {showError('consent') ? (
                    <p className="mt-2 text-sm font-medium text-rose-600">{showError('consent')}</p>
                  ) : null}
                </label>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-600">Компания-участник</span>
                  <input
                    type="text"
                    name="companyName"
                    value={form.companyName}
                    readOnly
                    className={`${fieldClasses(false)} cursor-not-allowed bg-slate-100/90 text-slate-500`}
                  />
                  {showError('companyName') ? (
                    <p className="mt-2 text-sm font-medium text-rose-600">{showError('companyName')}</p>
                  ) : null}
                </label>

                <label>
                  <span className="text-sm font-semibold text-slate-600">Дата встречи</span>
                  <select
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    onBlur={() => markTouched(['date'])}
                    className={fieldClasses(Boolean(showError('date')))}
                  >
                    <option value="">Выберите день конференции</option>
                    {conferenceDates.map((date) => (
                      <option key={date.value} value={date.value}>
                        {date.label}
                      </option>
                    ))}
                  </select>
                  {showError('date') ? (
                    <p className="mt-2 text-sm font-medium text-rose-600">{showError('date')}</p>
                  ) : null}
                </label>

                <label>
                  <span className="text-sm font-semibold text-slate-600">Время встречи</span>
                  <select
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    onBlur={() => markTouched(['time'])}
                    className={fieldClasses(Boolean(showError('time')))}
                  >
                    <option value="">Доступные окна: 10:00-17:00</option>
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {showError('time') ? (
                    <p className="mt-2 text-sm font-medium text-rose-600">{showError('time')}</p>
                  ) : null}
                </label>

                <label className="sm:col-span-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-600">Тема встречи</span>
                    <span className="text-xs font-semibold text-slate-400">{form.topic.length}/255</span>
                  </div>
                  <input
                    type="text"
                    name="topic"
                    value={form.topic}
                    onChange={handleChange}
                    onBlur={() => markTouched(['topic'])}
                    placeholder="Например, совместный запуск линейки или поставки упаковки"
                    className={fieldClasses(Boolean(showError('topic')))}
                  />
                  {showError('topic') ? (
                    <p className="mt-2 text-sm font-medium text-rose-600">{showError('topic')}</p>
                  ) : null}
                </label>

                <label className="sm:col-span-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-600">Специфика компании / запрос</span>
                    <span className="text-xs font-semibold text-slate-400">{form.request.length}/1000</span>
                  </div>
                  <textarea
                    name="request"
                    value={form.request}
                    onChange={handleChange}
                    onBlur={() => markTouched(['request'])}
                    rows="5"
                    placeholder="Опишите задачу, интересующие SKU, объемы, формат сотрудничества или ожидания от встречи."
                    className={fieldClasses(Boolean(showError('request')))}
                  />
                  {showError('request') ? (
                    <p className="mt-2 text-sm font-medium text-rose-600">{showError('request')}</p>
                  ) : null}
                </label>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-6 text-slate-500">
                Демо-режим: интеграция с CRM, email-копией и reCAPTCHA пока не подключена, но UI и валидация уже готовы.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                {step === 2 ? (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:border-sky-300 hover:text-brand-blue"
                  >
                    Назад
                  </button>
                ) : null}

                {step === 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full bg-brand-blue px-5 py-3 text-sm font-bold text-white hover:bg-sky-600"
                  >
                    Продолжить
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-brand-blue px-5 py-3 text-sm font-bold text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {isSubmitting ? 'Отправляем...' : 'Назначить встречу'}
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
