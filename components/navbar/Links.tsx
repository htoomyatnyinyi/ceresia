// src/components/Nav/Links.jsx or similar path
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../theme/ModeToggle";
import SignOutForm from "@/app/(auth)/signout/form"; // Make sure this path is correct

// Define link sets
const COMMON_LINKS = [
  { name: "home", path: "/" },
  { name: "shop", path: "/products" },
  { name: "cart", path: "/cart" },
];

const SIGN_IN_OUT_LINKS = [
  { name: "signin", path: "/signin" },
  { name: "signup", path: "/signup" },
];

const LOGGED_IN_LINKS = [
  { name: "account", path: "/account" },
  { name: "order", path: "/account/order" },
];

// Define the component with a clear type for the role prop
const Links = ({
  role,
  userId,
}: {
  role?: "USER" | "EDITOR" | null;
  userId: string | undefined;
}) => {
  const pathname = usePathname();
  console.log(role, userId);

  // 1. Start with common links
  let linksToShow = [...COMMON_LINKS];

  // 2. Add role-specific/logged-in links
  if (role) {
    // User is logged in (role is "USER" or "EMPLOYER")
    linksToShow = [...linksToShow, ...LOGGED_IN_LINKS];

    // You could add role-specific links here if you had them
    // if (role === "USER") { /* Add USER specific links */ }
    // if (role === "EMPLOYER") { /* Add EMPLOYER specific links */ }
  } else {
    // User is NOT logged in
    linksToShow = [...linksToShow, ...SIGN_IN_OUT_LINKS];
  }

  const LinkItem = ({ link }: { link: { name: string; path: string } }) => (
    <Link
      href={link.path}
      className={`${
        pathname === link.path
          ? "border-b-2 font-medium border-sky-500 capitalize text-sky-500"
          : "hover:text-red-500 capitalize"
      }`}
    >
      {link.name}
    </Link>
  );

  return (
    <div className="flex items-center gap-8">
      {/* 3. Map over the final, combined array */}
      {linksToShow.map((link, index) => (
        <div key={index}>
          <LinkItem link={link} />
        </div>
      ))}
      <ModeToggle />

      {/* 4. Conditionally show SignOut button if user is logged in */}
      {role && <SignOutForm userId={userId} />}
    </div>
  );
};

export default Links;

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { ModeToggle } from "../theme/ModeToggle";

// const Links = () => {
//   const pathname = usePathname();

//   const links = [
//     { name: "home", path: "/" },
//     { name: "shop", path: "/products" },
//     { name: "signin", path: "/signin" },
//     { name: "signup", path: "/signup" },
//     { name: "cart", path: "/cart" },
//     { name: "acount", path: "/account" },
//     { name: "order", path: "/account/order" },
//   ];

//   return (
//     <div className="gap-8 flex items-center ">
//       {links.map((link, index) => (
//         <Link
//           key={index}
//           href={link.path}
//           className={`${
//             pathname === link.path
//               ? "border-b-2 font-medium border-sky-500 capitalize text-sky-500"
//               : "hover:text-red-500 "
//           }`}
//         >
//           {link.name}
//         </Link>
//       ))}
//       <ModeToggle />
//     </div>
//   );
// };

// export default Links;
// // "use client";

// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // import { ModeToggle } from "../theme/ModeToggle";
// // import SignOutForm from "@/app/(auth)/signout/form";

// // const COMMON_LINKS = [
// //   { name: "home", path: "/" },
// //   { name: "signin", path: "/signin" },
// //   { name: "signup", path: "/signup" },
// // ];

// // const USER_LINKS = [
// //   { name: "jobs", path: "/jobs" },
// //   { name: "User Profile", path: "/user/profile" },
// //   { name: "User Resume", path: "/user/resume" },
// //   { name: "User Dashboard", path: "/user/dashboard" },
// // ];

// // const EMPLOYER_LINKS = [
// //   { name: "Employer Profile", path: "/employer/profile" },
// //   { name: "Employer Jobs", path: "/employer/jobs" },
// //   { name: "Employer Dashboard", path: "/employer/dashboard" },
// //   { name: "jobs", path: "/jobs" },
// // ];

// // // Define the component with a clear type for the role prop
// // const Links = ({
// //   role,
// //   userId,
// // }: {
// //   role?: "USER" | "EMPLOYER" | null;
// //   userId: string | undefined;
// // }) => {
// //   const pathname = usePathname();

// //   // 1. Determine the set of links based on the role
// //   const roleSpecificLinks =
// //     role === "USER" ? USER_LINKS : role === "EMPLOYER" ? EMPLOYER_LINKS : [];

// //   // 2. Filter COMMON_LINKS based on whether a role is present (i.e., USER is logged in)
// //   const filteredCommonLinks = COMMON_LINKS.filter((link) => {
// //     // If a role is present, hide signin and signup links
// //     if (role && (link.path === "/signin" || link.path === "/signup")) {
// //       return false;
// //     }
// //     return true;
// //   });

// //   // 3. Combine the two sets of links
// //   const linksToShow = [...filteredCommonLinks, ...roleSpecificLinks];

// //   const LinkItem = ({ link }: { link: { name: string; path: string } }) => (
// //     <Link
// //       href={link.path}
// //       className={`${
// //         pathname === link.path
// //           ? "border-b-2 font-medium border-sky-500 capitalize text-sky-500"
// //           : "hover:text-sky-500 capitalize"
// //       }`}
// //     >
// //       {link.name}
// //     </Link>
// //   );

// //   return (
// //     <div className="flex items-center gap-8">
// //       {/* 4. Map over the final, combined array */}
// //       {linksToShow.map((link, index) => (
// //         <div key={index}>
// //           <LinkItem link={link} />
// //         </div>
// //       ))}
// //       <ModeToggle />
// //       <SignOutForm userId={userId} />
// //     </div>
// //   );
// // };

// // export default Links;
