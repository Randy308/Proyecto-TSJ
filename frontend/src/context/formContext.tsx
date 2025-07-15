// CounterContext.tsx
import React, { createContext, useContext } from 'react';

// 1. Tipo del contexto
export interface FormContextType  {
  formState: boolean;
  setFormState: React.Dispatch<React.SetStateAction<boolean>>;
};

// 2. Crear contexto con valor inicial null y tipo definido
export const FormContext = createContext<FormContextType | undefined>(undefined);

// 3. Hook personalizado para usar el contexto
export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm debe usarse dentro de FormProvider');
  }
  return context;
};


