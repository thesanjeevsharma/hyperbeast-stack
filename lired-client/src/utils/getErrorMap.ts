import { FieldError } from "../gql/graphql";

export const getErrorMap = (errors: FieldError[]): Record<string, string> => {
  const errorMap = {};

  errors.map(({ field, message }) => {
    errorMap[field] = message;
  });

  return errorMap;
};
