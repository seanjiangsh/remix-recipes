import { z } from "zod";

type FieldErrors = Record<string, string>;

export const validateForm = <T>(
  formData: FormData,
  schema: z.Schema<T>,
  successFn: (data: T) => unknown,
  failedFn: (errors: FieldErrors) => unknown
) => {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors = parsed.error.issues.reduce(
      (p, c) => ({ ...p, [c.path.join(".")]: c.message }),
      {}
    );
    return failedFn(errors);
  }
  return successFn(parsed.data);
};
