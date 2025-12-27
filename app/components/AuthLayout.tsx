// import React from "react";
// import AnimationSection from "../(auth)/login/AnimationSection"
// interface AuthLayoutProps {
//   children: React.ReactNode;
// }

// const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
//   return (
//     <div className="flex min-h-screen">
//       <div className="overflow-hidden  md:flex w-1/2 bg-[#11224E] items-center justify-center p-8">
//         <AnimationSection />
//       </div>

//       {/* Right Side - Form */}
//       <div className="flex flex-1 items-center justify-center w-full p-8">
//         <div className="w-full max-w-md">{children}</div>
//       </div>
//     </div>
//   );
// };

// export default AuthLayout;

import React from "react";
import AnimationSection from "../(auth)/register/AnimationSection";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Left Side Animation */}
      <div className="hidden md:flex w-1/2 bg-[#11224E] items-center justify-center  overflow-hidden">
      
        <AnimationSection />
      </div>

      {/* Right Side - Form */}
      <div className="flex flex-1  w-full ">
        <div className="w-full ">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
