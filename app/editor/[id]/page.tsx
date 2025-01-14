// app/editor/[id]/page.tsx
import { PrismaClient } from "@prisma/client";
import EditorDetail from "./EditorDetail";

const prisma = new PrismaClient();

async function getEditorData(id: number) {
  await prisma.$connect();
  const editor = await prisma.editor.findUnique({
    where: { id: id },
    include: { user: true },
  });
  console.log(editor);
  await prisma.$disconnect();
  return editor;
}

export default async function EditorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const editorId = parseInt(params.id);
  const editor = await getEditorData(editorId);

  if (!editor) {
    return <div>Editor not found</div>;
  }

  return <EditorDetail editor={editor} />;
}
