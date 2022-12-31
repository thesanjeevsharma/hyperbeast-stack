import React from "react";
import { Formik, Form } from "formik";
import { Button, Spacer } from "@chakra-ui/react";
import { useRouter } from "next/router";

import Wrapper from "../components/Wrapper";
import FormField from "../components/FormField";
import { useRegisterMutation } from "../gql/graphql";
import { getErrorMap } from "../utils/getErrorMap";

type Props = {};

const Register: React.FC<Props> = () => {
  const router = useRouter();
  const [, registerMutation] = useRegisterMutation();

  const initialValues = {
    username: "",
    password: "",
  };

  const handleSubmit = async (values, { setErrors }) => {
    const response = await registerMutation({ credentials: values });

    if (response.data.register.errors) {
      setErrors(getErrorMap(response.data.register.errors));
    } else {
      router.push("/");
    }
  };

  return (
    <Wrapper>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {() => (
          <Form>
            <FormField label="Username" name="username" />
            <Spacer h={4} />
            <FormField type="password" label="Password" name="password" />
            <Spacer h={4} />
            <Button type="submit">Submit</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
