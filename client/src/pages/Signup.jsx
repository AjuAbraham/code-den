
import SignUpForm from "../forms/SignUpForm";
import AuthUI from "../components/AuthUI";
const Signup = () => {
  return (
    <div className="min-h-screen w-screen bg-base-100 flex items-center justify-center p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl w-full">
        <div className="flex items-center justify-center h-full">
          <AuthUI
            title="Join the Code Den!!"
            subtitle="Sign up to unlock a world of coding challenges and solutions."
          />
        </div>
        <div className="flex items-start mt-16 justify-center">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default Signup;
