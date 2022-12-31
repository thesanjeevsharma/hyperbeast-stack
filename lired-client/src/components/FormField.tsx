import React from "react";
import { ErrorMessage, useField } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

const FormField: React.FC<Props> = ({ name, size: _, label, ...props }) => {
  const [field, { error }] = useField(name);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input {...field} {...props} id={name} name={name} />
      {!!error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default FormField;
