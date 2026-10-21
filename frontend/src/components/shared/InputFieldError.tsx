import { FieldDescription } from "@/components/ui/field";
import {
  getInputFieldError,
  type IInputErrorState,
} from "@/lib/getInputFieldError";
import type { AuthActionState } from "@/types/auth.type";

interface InputFieldErrorProps {
  field: string;
  state: IInputErrorState | AuthActionState | null;
}

const InputFieldError = ({ field, state }: InputFieldErrorProps) => {
  const error = state ? getInputFieldError(field, state) : null;

  if (!error) return null;

  return <FieldDescription className="text-red-600">{error}</FieldDescription>;
};

export default InputFieldError;