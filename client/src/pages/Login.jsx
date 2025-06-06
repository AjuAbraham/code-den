import AuthUI from "../components/AuthUI";
import LoginForm from "../forms/LoginForm";
const Login = () => {
  return (
    <div className="min-h-screen w-screen bg-base-100 flex items-center justify-center p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl w-full">
        <div className="flex items-center justify-center h-full">
          <AuthUI
            title="Welcome Back to Code Den!!"
            subtitle="Chai Leao!! Code Apko Hi Karna He!!!"
          />
        </div>
        <div className="flex items-start mt-16 justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
