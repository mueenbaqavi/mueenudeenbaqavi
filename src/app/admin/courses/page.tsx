import Link from "next/link";
import { Edit, Plus, Trash2 } from "lucide-react";
import { deleteCourseAction } from "@/app/admin/_actions/content-actions";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listAdminCourses } from "@/lib/admin-content-repository";
import { createMetadata } from "@/lib/site";
import { ContentStatusBadge } from "@/components/admin/content-status-badge";

export const metadata = createMetadata({ title: "Manage Courses", path: "/admin/courses" });

export default async function AdminCoursesPage() {
  const courses = await listAdminCourses();

  return (
    <>
      <PageHero title="Manage Courses" description="Add, edit, and organize courses available on the website." />
      <section className="container grid gap-6 py-10">
        <div className="flex justify-end">
          <Link href="/admin/courses/new">
            <Button><Plus className="mr-2 size-4" /> Add Course</Button>
          </Link>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Instructor</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      <EmptyState />
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <Link href={`/courses/${course.slug}`} className="hover:underline">
                          {course.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <ContentStatusBadge status={course.status} />
                      </td>
                      <td className="px-4 py-3">
                        {course.instructor}
                      </td>
                      <td className="px-4 py-3">
                        {course.duration}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/courses/${course.id}/edit`}>
                            <Button variant="ghost" size="icon" title="Edit Course">
                              <Edit className="size-4" />
                            </Button>
                          </Link>
                          <form action={deleteCourseAction} className="inline-block">
                            <input type="hidden" name="id" value={course.id} />
                            <input type="hidden" name="slug" value={course.slug} />
                            <Button variant="ghost" size="icon" type="submit" className="text-destructive hover:bg-destructive/10" title="Delete Course">
                              <Trash2 className="size-4" />
                            </Button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </>
  );
}
