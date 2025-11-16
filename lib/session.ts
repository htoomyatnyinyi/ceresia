import "server-only";

import { SignJWT, jwtVerify } from "jose"; // Using 'jose' is modern and recommended over 'jsonwebtoken'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "./prisma";

const secretKey = process.env.JWT_SECRET || "htoomyatnyinyi";
const key = new TextEncoder().encode(secretKey);

// // setup cookies
// const cookie = {
//   name: "session",
//   options: { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
//   duration: 24 * 60 * 60 * 1000,
// };

// Encryption
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1 day from now")
    .sign(key);
}

// Decryption
export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });

    // console.log(payload, "check payload at decrypt");
    return payload; // Contains { userId, role, iat, exp }
  } catch (error) {
    return null; // This will catch expired tokens or invalid signatures
  }
}

export async function createSession(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
    // select: { id: true, role: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Expires in 24 hours
  // const session = await encrypt({ userId: user.id, role: user.role, expires });
  const session = await encrypt({ userId, expires });

  //   const cookieStore = await cookies();
  //   cookieStore.set(cookie.name, session, { ...cookie.options, expires });

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
  // redirect("/dashboard"); // some suggest do not call redirect here
}

// export async function verifySession() {
//   const cookieStore = await cookies();
//   const cookie = cookieStore.get("session")?.value;
//   if (!cookie) {
//     return null;
//   }
//   // decrypt the cookies
//   const session = await decrypt(cookie);
//   //   return session ? { userId: session.userId } : redirect("/signin");
//   //   if (!session?.userId) {
//   //     redirect("/login");
//   //   }
//   //   return session ? { id: session.userId } : null;
//   //   return session ? { userId: session.userId } : null;
//   return session ? { id: session.userId } : null;
// }

export const verifySession = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  // console.log(cookieStore, " at verify session", session, "data");
  if (!session) {
    return { success: false, message: "No session found" };
  }
  const dsession = await decrypt(session);
  // console.log(dsession);

  const user = await prisma.user.findUnique({
    where: { id: dsession.userId },
    select: { id: true }, // ecommerce code
    // select: { id: true, verified: true }, // original code
    // select: { id: true, verified: true, role: true }, // update code
  });

  if (!user) {
    // redirect("/signin");
    return { success: false, message: "User not found" };
  }

  // // Uncomment This to prevent looping verifyemail
  // if (!user.verified) {
  //   redirect("/verifyemail");
  // }

  // console.log(user, "d");

  // id to userId changed
  return { userId: user.id }; // original code
  // return { userId: user.id, role: user.role }; // updaet code
};

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  // redirect("/signin"); // i check this route is not working
}
