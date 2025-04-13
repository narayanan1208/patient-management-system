import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import {
  BUCKET_ID,
  ENDPOINT,
  NEXT_PUBLIC_PROJECT_ID,
  NEXT_PUBLIC_DATABASE_ID,
  NEXT_PUBLIC_PATIENT_COLLECTION_ID,
  storage,
  databases,
} from "@/lib/appwrite.config";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const blobFile = formData.get("blobFile") as Blob | null;
    const fileName = formData.get("fileName") as string | null;

    let file;
    if (blobFile && fileName) {
      const fileObject = new File([await blobFile.arrayBuffer()], fileName);
      file = await storage.createFile(BUCKET_ID!, ID.unique(), fileObject);
      console.log("Uploaded file:", file);
    }

    if (!file?.$id) {
      return NextResponse.json(
        { error: "File upload failed, cannot register patient." },
        { status: 400 }
      );
    }

    // Build patient data
    const patient = {
      userid: formData.get("userId"),
      name: formData.get("name"),
      email: formData.get("email"),
      birthDate: formData.get("birthDate"),
      gender: formData.get("gender"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      privacyConsent: formData.get("privacyConsent") === "true",
      identificationDocumentId: file?.$id ?? null,
      identificationDocumentUrl: file?.$id
        ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view?project=${NEXT_PUBLIC_PROJECT_ID}`
        : null,
    };

    const createdPatient = await databases.createDocument(
      NEXT_PUBLIC_DATABASE_ID!,
      NEXT_PUBLIC_PATIENT_COLLECTION_ID!,
      ID.unique(),
      patient
    );

    return NextResponse.json(createdPatient, { status: 200 });
  } catch (error: any) {
    console.error("API Error - register-patient:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
