interface FieldError {
  key: string;
  message: string;
}

export type ErrorResponse = FieldError[];
