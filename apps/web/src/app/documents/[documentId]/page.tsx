import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { apiRequest, type DocumentDto } from "@/lib/api";
import { Document } from "./document";

interface DocumentIdPageProps {
  params: Promise<{ documentId: string }>;
}

export async function generateMetadata({ params }: DocumentIdPageProps) {
  const { documentId } = await params;
  const session = await auth();
  if (!session) return { title: "Document" };

  try {
    const document = await apiRequest<DocumentDto>(`/documents/${documentId}`, {
      token: session.accessToken,
    });

    return { title: document.title };
  } catch {
    return { title: "Document" };
  }
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const { documentId } = await params;
  const session = await auth();

  // The middleware guarantees a session; this narrows the type.
  if (!session) notFound();

  let document: DocumentDto;
  try {
    document = await apiRequest<DocumentDto>(`/documents/${documentId}`, {
      token: session.accessToken,
    });
  } catch {
    notFound();
  }

  return <Document document={document} />;
};

export default DocumentIdPage;
