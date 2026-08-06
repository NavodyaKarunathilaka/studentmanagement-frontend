import EditCourseForm from "./EditCourseForm";

export default async function EditCoursePage({
  params,
}: PageProps<"/courses/[id]/edit">) {
  const { id } = await params;
  return <EditCourseForm id={id} />;
}
