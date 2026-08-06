import EditStudentForm from "./EditStudentForm";

export default async function EditStudentPage({
  params,
}: PageProps<"/students/[id]/edit">) {
  const { id } = await params;
  return <EditStudentForm id={id} />;
}
