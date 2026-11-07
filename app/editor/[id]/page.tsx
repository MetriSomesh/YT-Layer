// app/editor/[id]/page.tsx
import { prisma } from "@/app/lib/prisma";
import EditorDetail from "./EditorDetail";


async function getEditorData(id: number) {
  const editor = await prisma.editor.findUnique({
    where: { id: id },
    include: { user: true },
  });
  console.log(editor);
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
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground">
        <p className="font-label text-xs tracking-[0.3em] text-muted-foreground">
          EDITOR NOT FOUND
        </p>
        <p className="font-display mt-4 text-3xl font-bold tracking-tight">
          No editor here.
        </p>
      </div>
    );
  }

  return <EditorDetail editor={editor} />;
}
