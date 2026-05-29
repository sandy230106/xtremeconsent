export type ConsentFormData =
  Record<string, unknown> & {
    id: number;
  };

let nextId = 1;

const consentForms: ConsentFormData[] = [];

export function getConsentForms() {
  return consentForms;
}

export function addConsentForm(
  form: Record<string, unknown>
) {
  const consentForm = {
    ...form,
    id: nextId,
    created_at:
      new Date().toISOString(),
  };

  nextId += 1;

  consentForms.push(
    consentForm
  );

  return consentForm;
}

export function updateConsentForm(
  form: ConsentFormData
) {
  const index =
    consentForms.findIndex(
      (consentForm) =>
        consentForm.id === form.id
    );

  if (index === -1)
    return null;

  consentForms[index] = {
    ...consentForms[index],
    ...form,
  };

  return consentForms[index];
}

export function deleteConsentForm(
  id: number
) {
  const index =
    consentForms.findIndex(
      (consentForm) =>
        consentForm.id === id
    );

  if (index === -1)
    return false;

  consentForms.splice(
    index,
    1
  );

  return true;
}
