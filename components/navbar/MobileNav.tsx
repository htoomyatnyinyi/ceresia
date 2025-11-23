"use client";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";

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

const MobileNav = ({
  role,
  userId,
}: {
  role?: "USER" | "EDITOR" | null;
  userId: string | undefined;
}) => {
  const pathname = usePathname();

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

  // const links = [
  //   { name: "home", path: "/" },
  //   { name: "shop", path: "/products" },
  //   { name: "signin", path: "/signin" },
  //   { name: "signup", path: "/signup" },
  //   { name: "cart", path: "/cart" },
  //   { name: "acount", path: "/account" },
  //   { name: "order", path: "/account/order" },
  // ];
  return (
    <div className="flex justify-center items-center gap-4">
      <Sheet>
        <SheetTrigger asChild>
          <button aria-label="Open menu">
            <Menu className="h-6 w-6" /> {/* Standardized size */}
          </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>coffee_diary</SheetTitle>
          </SheetHeader>
          <SheetDescription>blah .. blah </SheetDescription>
          {/* Navigation Links Section */}
          <div className="flex flex-col gap-6 text-xl items-start">
            {linksToShow.map((link, index) => (
              <div key={index} className="w-full">
                <Link
                  href={link.path}
                  // Styling the active link
                  className={`
                    block py-2 w-full text-left capitalize transition-colors
                    ${
                      pathname === link.path
                        ? "text-sky-500 font-semibold border-b-2 border-sky-500"
                        : "hover:text-sky-500"
                    }
                  `}
                >
                  {link.name}
                </Link>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
