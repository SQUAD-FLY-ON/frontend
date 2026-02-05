import PrivacyPolicy from "@/components/signup/PrivacyPolicy";
import SignupForm from "@/components/signup/SignupForm";
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
