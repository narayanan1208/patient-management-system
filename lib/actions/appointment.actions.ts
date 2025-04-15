"use server";

import { revalidatePath } from "next/cache";
import { ID } from "node-appwrite";

import {
  NEXT_PUBLIC_DATABASE_ID,
  NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID,
  databases,
} from "../appwrite.config";
import { parseStringify } from "../utils";

//  CREATE APPOINTMENT
export const createAppointment = async (
  appointment: CreateAppointmentParams
) => {
  try {
    const newAppointment = await databases.createDocument(
      NEXT_PUBLIC_DATABASE_ID!,
      NEXT_PUBLIC_APPOINTMENT_COLLECTION_ID!,
      ID.unique(),
      appointment
    );

    revalidatePath("/admin");
    return parseStringify(newAppointment);
  } catch (error) {
    console.error("An error occurred while creating a new appointment:", error);
  }
};
