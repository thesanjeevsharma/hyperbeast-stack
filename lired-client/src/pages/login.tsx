import React from "react";
import { Formik, Form } from "formik";
import { Button, Spacer } from "@chakra-ui/react";
import { useRouter } from "next/router";

import Wrapper from "../components/Wrapper";
import FormField from "../components/FormField";
import { useLoginMutation } from "../gql/graphql";
import { getErrorMap } from "../utils/getErrorMap";

type Props = {};

const Login: React.FC<Props> = () => {
  const router = useRouter();
  const [, loginMutation] = useLoginMutation();

  const initialValues = {
    username: "",
    password: "",
  };

  const handleSubmit = async (values, { setErrors }) => {
    const response = await loginMutation({ credentials: values });

    if (response.data.login.errors) {
      setErrors(getErrorMap(response.data.login.errors));
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
            <Button type="submit">Login</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
