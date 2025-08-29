import PrivacyPolicy from "@/conponents/signup/PrivacyPolicy";
import SignupForm from "@/conponents/signup/SignupForm";
import { useState } from "react";


export default function Signup() {
  const [agree, setAgree] = useState(false);

  return (<>
    {agree ?
      <SignupForm /> :
      <PrivacyPolicy setAgree={setAgree} />
    }
  </>)
}
