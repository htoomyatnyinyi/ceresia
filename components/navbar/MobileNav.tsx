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

const MobileNav = () => {
  const pathname = usePathname();
  const links = [
    { name: "home", path: "/" },
    { name: "shop", path: "/products" },
    { name: "signin", path: "/signin" },
    { name: "signup", path: "/signup" },
    { name: "cart", path: "/cart" },
    { name: "acount", path: "/account" },
    { name: "order", path: "/account/order" },
  ];
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
            {links.map((link, index) => (
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
