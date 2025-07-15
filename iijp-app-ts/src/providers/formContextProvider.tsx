import { useState } from "react";
import { FormContext, type FormContextType } from "../context";
import type { ContextProviderProps } from "../types";

export const FormProvider = ({ children }: ContextProviderProps) => {
  const [formState, setFormState] = useState<boolean>(false);
  const valor: FormContextType = { formState, setFormState };
  return <FormContext.Provider value={valor}>{children}</FormContext.Provider>;
};
