"use server";

import { ID, Query } from "node-appwrite";
import { users, databases } from "../appwrite.config";
import { parseStringify } from "../utils";
import {
  NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_DATABASE_ID,
  NEXT_PUBLIC_PATIENT_COLLECTION_ID,
} from "../appwrite.config";

export const createUser = async (user: CreateUserParams) => {
  try {
    // Create new user -> https://appwrite.io/docs/references/1.5.x/server-nodejs/users#create
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );

    return parseStringify(newuser);
  } catch (error: any) {
    // Check existing user
    if (error && error?.code === 409) {
      const existingUser = await users.list([
        Query.equal("email", [user.email]),
      ]);

      return existingUser.users[0];
    }
    console.error("An error occurred while creating a new user:", error);
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);
    return parseStringify(user);
  } catch (error) {
    console.log(error);
  }
};

export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      NEXT_PUBLIC_DATABASE_ID!,
      NEXT_PUBLIC_PATIENT_COLLECTION_ID!,
      [Query.equal("userid", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};

// export const createUser = async (user: CreateUserParams) => {
//   const response = await fetch(`/api/create-user`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(user),
//   });

//   if (!response.ok) {
//     throw new Error("User creation failed.");
//   }

//   return await response.json();
// };

// export const getUser = async (userId: string) => {
//   console.log(`${NEXT_PUBLIC_SITE_URL}/api/get-user`);
//   const response = await fetch(`${NEXT_PUBLIC_SITE_URL}/api/get-user`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ userId }),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to fetch user");
//   }

//   return await response.json();
// };
