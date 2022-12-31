import React from "react";
import { Formik, Form } from "formik";
import { Button, Spacer } from "@chakra-ui/react";

import Wrapper from "../components/Wrapper";
import FormField from "../components/FormField";

type Props = {};

const Register: React.FC<Props> = () => {
  const initialValues = {
    username: "",
    password: "",
  };

  return (
    <Wrapper>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => console.log(values)}
      >
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
