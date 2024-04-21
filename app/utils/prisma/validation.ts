import { z } from "zod";

export type FieldErrors = { [key: string]: string };
export type FormFields = {
  [key: string]: FormDataEntryValue | Array<FormDataEntryValue>;
};

// * Convert FormData to Object,
const objectify = (formData: FormData) => {
  const entries = Array.from(formData.entries());
  const formFields = entries.reduce<FormFields>((p, [key, value]) => {
    const isArrayField = key.endsWith("[]");
    const fieldName = isArrayField ? key.slice(0, -2) : key;
    return isArrayField
      ? { ...p, [fieldName]: formData.getAll(key) }
      : { ...p, [fieldName]: value };
  }, {});
  return formFields;
};

export const validateForm = <T, R, E>(
  formData: FormData,
  schema: z.Schema<T>,
  successFn: (data: T) => R,
  failedFn: (errors: FieldErrors) => E
) => {
  const fields = objectify(formData);
  const parsed = schema.safeParse(fields);
  if (!parsed.success) {
    const errors = parsed.error.issues.reduce(
      (p, c) => ({ ...p, [c.path.join(".")]: c.message }),
      {}
    );
    return failedFn(errors);
  }
  return successFn(parsed.data);
};
