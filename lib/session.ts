import "server-only";

import { SignJWT, jwtVerify } from "jose"; // Using 'jose' is modern and recommended over 'jsonwebtoken'
import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
import prisma from "./prisma";
import { success } from "zod";

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
    // select: { id: true },
    select: { id: true, role: true },
  });

  if (!user) {
    // throw new Error("User not found");
    return { success: false, message: "User not found" };
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

// original code
// export const verifySession = async () => {
//   const cookieStore = await cookies();
//   const session = cookieStore.get("session")?.value;
//   // console.log(cookieStore, " at verify session", session, "data");

//   if (!session) {
//     cookieStore.delete("session");
//     return { success: false, message: "No session found" };
//   }
//   // console.log(session, "session token");

//   const dsession = await decrypt(session);
//   // console.log(dsession);

//   const user = await prisma.user.findUnique({
//     where: { id: dsession.userId },
//     // select: { id: true }, // ecommerce code
//     // select: { id: true, verified: true }, // original code
//     select: { id: true, verified: true, role: true }, // update code
//   });

//   if (!user) {
//     // redirect("/signin");
//     return { success: false, message: "User not found" };
//   }

//   // // Uncomment This to prevent looping verifyemail
//   // if (!user.verified) {
//   //   redirect("/verifyemail");
//   // }

//   // console.log(user, "d");

//   // id to userId changed
//   // return { userId: user.id }; // original code
//   // return { userId: user.id, role: user.role }; // updaet code
//   return { success: true, userId: user.id, role: user.role }; // updaet code
// };
export const verifySession = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  // 1. No session cookie
  if (!session) {
    // cookieStore.delete("session");
    return { success: false, message: "No session found" };
  }

  // 2. Try to decrypt
  let dsession = null;

  try {
    dsession = await decrypt(session);
  } catch (err) {
    // Decryption failed = invalid or tampered token
    // cookieStore.delete("session");
    return { success: false, message: "Invalid session token" };
  }

  // 3. dsession missing or malformed
  if (!dsession || !dsession.userId) {
    // cookieStore.delete("session");
    return { success: false, message: "Invalid session data" };
  }

  // 4. Look up user
  const user = await prisma.user.findUnique({
    where: { id: dsession.userId },
    select: { id: true, verified: true, role: true },
  });

  // 5. Missing user
  if (!user) {
    // cookieStore.delete("session");
    return { success: false, message: "User not found" };
  }

  // 6. Success
  return {
    success: true,
    userId: user.id,
    role: user.role,
  };
};

/*
export const verifySession = async () => {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    // Case 1: No session cookie found.
    return { success: false, message: "No session found" };
  }

  // console.log(session, "session token");

  const dsession = await decrypt(session);

  // 👇 CRITICAL FIX: Check if the token was successfully decrypted
  if (!dsession || !dsession.userId) {
    console.error(
      "Session decryption failed or userId missing. Token might be expired or invalid."
    );
    // Optionally clear the invalid cookie:
    cookieStore.delete("session");
    return { success: false, message: "Invalid or expired session token" };
  }

  // dsession is guaranteed to be a valid object with userId here
  const user = await prisma.user.findUnique({
    // Access dsession.userId without optional chaining, as it's checked above
    where: { id: dsession.userId },
    select: { id: true }, // or include other fields like verified, role
  });

  if (!user) {
    // Case 3: User ID was in the token, but no user exists in the database.
    // Clean up the stale session
    // cookieStore.delete("session");
    return { success: false, message: "User not found" };
  }

  // Session is valid
  return { success: true, userId: user.id };
  // return { success: true, userId: user.id, role: user.role }; // if role is selected
};
*/

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  console.log("delete session is activated");
  // redirect("/signin"); // i check this route is not working
}
