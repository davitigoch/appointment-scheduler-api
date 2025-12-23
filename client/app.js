const statusEl = document.getElementById('status');
const apiBaseInput = document.getElementById('apiBase');
const saveApiBaseBtn = document.getElementById('saveApiBase');
const refreshAllBtn = document.getElementById('refreshAll');
const reloadServicesBtn = document.getElementById('reloadServices');
const reloadSlotsBtn = document.getElementById('reloadSlots');
const reloadAppointmentsBtn = document.getElementById('reloadAppointments');

const serviceForm = document.getElementById('serviceForm');
const slotForm = document.getElementById('slotForm');
const appointmentForm = document.getElementById('appointmentForm');

const servicesListEl = document.getElementById('servicesList');
const slotsListEl = document.getElementById('slotsList');
const appointmentsListEl = document.getElementById('appointmentsList');

const slotServiceSelect = document.getElementById('slotServiceSelect');
const appointmentServiceSelect = document.getElementById('appointmentServiceSelect');
const appointmentSlotSelect = document.getElementById('appointmentSlotSelect');

const STORAGE_KEY = 'scheduler-api-base';

const state = {
  services: [],
  slots: [],
  appointments: []
};

const setStatus = (text, tone = 'info') => {
  statusEl.textContent = text;
  statusEl.dataset.tone = tone;
};

const getBaseUrl = () => apiBaseInput.value.trim().replace(/\/$/, '');

const saveBaseUrl = () => {
  localStorage.setItem(STORAGE_KEY, getBaseUrl());
  setStatus('API base saved.', 'success');
};

const loadBaseUrl = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) apiBaseInput.value = saved;
};

const api = async (path, options = {}) => {
  const url = `${getBaseUrl()}${path}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options
  };
  setStatus(`Requesting ${path} ...`, 'info');
  const res = await fetch(url, config);
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload.message || `Request failed: ${res.status}`);
  }
  setStatus(payload.message || 'Success', 'success');
  return payload.data ?? payload;
};

const asId = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value._id) return value._id;
  return '';
};

const renderServices = () => {
  if (!state.services.length) {
    servicesListEl.innerHTML = '<p class="empty">No services yet.</p>';
    return;
  }
  servicesListEl.innerHTML = state.services
    .map((svc) => {
      const price = svc.price != null ? `$${Number(svc.price).toFixed(2)}` : 'n/a';
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <strong>${svc.name}</strong>
              <p class="meta">${svc.description || 'No description'}</p>
            </div>
            <span class="badge">${price} • ${svc.durationMinutes}m</span>
          </div>
          <p class="meta">ID: ${asId(svc)}</p>
        </div>
      `;
    })
    .join('');
};

const renderSlots = () => {
  if (!state.slots.length) {
    slotsListEl.innerHTML = '<p class="empty">No time slots yet.</p>';
    return;
  }
  slotsListEl.innerHTML = state.slots
    .map((slot) => {
      const service = state.services.find((s) => asId(s) === asId(slot.serviceId));
      const label = service ? service.name : 'Unknown service';
      const booked = slot.isBooked;
      const badgeClass = booked ? 'badge danger' : 'badge success';
      const badgeText = booked ? 'Booked' : 'Available';
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <strong>${slot.date} • ${slot.startTime} - ${slot.endTime}</strong>
              <p class="meta">${label}</p>
            </div>
            <span class="${badgeClass}">${badgeText}</span>
          </div>
          <p class="meta">ID: ${asId(slot)}</p>
        </div>
      `;
    })
    .join('');
};

const renderAppointments = () => {
  if (!state.appointments.length) {
    appointmentsListEl.innerHTML = '<p class="empty">No appointments yet.</p>';
    return;
  }
  appointmentsListEl.innerHTML = state.appointments
    .map((appt) => {
      const service = appt.serviceId?.name || 'Service';
      const slotLabel = appt.timeSlotId
        ? `${appt.timeSlotId.date} ${appt.timeSlotId.startTime} - ${appt.timeSlotId.endTime}`
        : 'Slot';
      return `
        <div class="card">
          <div class="card-header">
            <div>
              <strong>${appt.customerName}</strong>
              <p class="meta">${appt.customerEmail}</p>
            </div>
            <span class="badge">${appt.status}</span>
          </div>
          <p class="meta">${service} • ${slotLabel}</p>
        </div>
      `;
    })
    .join('');
};

const refreshServices = async () => {
  state.services = await api('/services');
  fillServiceSelects();
  renderServices();
};

const refreshSlots = async () => {
  state.slots = await api('/timeslots');
  renderSlots();
  fillAppointmentSlots();
};

const refreshAppointments = async () => {
  state.appointments = await api('/appointments');
  renderAppointments();
};

const loadAll = async () => {
  await Promise.all([refreshServices(), refreshSlots(), refreshAppointments()]);
};

const fillServiceSelects = () => {
  const opts = state.services
    .map((svc) => `<option value="${asId(svc)}">${svc.name}</option>`)
    .join('');
  slotServiceSelect.innerHTML = `<option value="">Select a service</option>${opts}`;
  appointmentServiceSelect.innerHTML = `<option value="">Select a service</option>${opts}`;
};

const fillAppointmentSlots = () => {
  const serviceFilter = appointmentServiceSelect.value;
  const slots = state.slots.filter((slot) => {
    const slotServiceId = asId(slot.serviceId);
    const matchesService = !serviceFilter || slotServiceId === serviceFilter;
    return matchesService && !slot.isBooked;
  });
  const opts = slots
    .map(
      (slot) =>
        `<option value="${asId(slot)}">${slot.date} • ${slot.startTime} - ${slot.endTime}</option>`
    )
    .join('');
  appointmentSlotSelect.innerHTML = `<option value="">Select a slot</option>${opts}`;
};

// Event wiring
saveApiBaseBtn.addEventListener('click', saveBaseUrl);
refreshAllBtn.addEventListener('click', () => loadAll().catch(handleError));
reloadServicesBtn.addEventListener('click', () => refreshServices().catch(handleError));
reloadSlotsBtn.addEventListener('click', () => refreshSlots().catch(handleError));
reloadAppointmentsBtn.addEventListener('click', () => refreshAppointments().catch(handleError));

appointmentServiceSelect.addEventListener('change', fillAppointmentSlots);

serviceForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = new FormData(serviceForm);
  const body = {
    name: form.get('name'),
    description: form.get('description'),
    durationMinutes: Number(form.get('durationMinutes')),
    price: Number(form.get('price'))
  };
  api('/services', { method: 'POST', body: JSON.stringify(body) })
    .then(() => {
      serviceForm.reset();
      return refreshServices();
    })
    .catch(handleError);
});

slotForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = new FormData(slotForm);
  const body = {
    serviceId: form.get('serviceId'),
    date: form.get('date'),
    startTime: form.get('startTime'),
    endTime: form.get('endTime')
  };
  api('/timeslots', { method: 'POST', body: JSON.stringify(body) })
    .then(() => {
      slotForm.reset();
      return refreshSlots();
    })
    .catch(handleError);
});

appointmentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = new FormData(appointmentForm);
  const body = {
    serviceId: form.get('serviceId'),
    timeSlotId: form.get('timeSlotId'),
    customerName: form.get('customerName'),
    customerEmail: form.get('customerEmail')
  };
  api('/appointments', { method: 'POST', body: JSON.stringify(body) })
    .then(() => {
      appointmentForm.reset();
      return Promise.all([refreshSlots(), refreshAppointments()]);
    })
    .catch(handleError);
});

const handleError = (err) => {
  console.error(err);
  setStatus(err.message || 'Something went wrong', 'error');
};

const init = async () => {
  loadBaseUrl();
  try {
    await loadAll();
  } catch (err) {
    handleError(err);
  }
};

init();
