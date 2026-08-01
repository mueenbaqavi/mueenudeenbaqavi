import Link from "next/link";
import { PlayCircle, Plus, Trash2, Edit } from "lucide-react";
import { deleteClassSubjectAction } from "@/app/admin/_actions/content-actions";
import { PageHero } from "@/components/sections/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listAdminClassSubjects } from "@/lib/admin-content-repository";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({ title: "Manage Classes", path: "/admin/classes" });

export default async function AdminClassesPage() {
  const classes = await listAdminClassSubjects();

  return (
    <>
      <PageHero title="Manage Classes" description="Add YouTube Playlists to display classes on the website." />
      <section className="container grid gap-6 py-10">
        <div className="flex justify-end">
          <Link href="/admin/classes/new">
            <Button><Plus className="mr-2 size-4" /> Add Class Playlist</Button>
          </Link>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Playlist Link</th>
                  <th className="px-4 py-3 font-medium">Videos</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {classes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      <EmptyState />
                    </td>
                  </tr>
                ) : (
                  classes.map((cls) => (
                    <tr key={cls.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <Link href={`/classes/${cls.slug}`} className="hover:underline">
                          {cls.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <a href={cls.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                          <PlayCircle className="size-4" /> YouTube
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <Badge>{cls.classesCount} classes</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/classes/${cls.id}/edit`}>
                            <Button variant="ghost" size="icon" title="Edit Class">
                              <Edit className="size-4" />
                            </Button>
                          </Link>
                          <form action={deleteClassSubjectAction} className="inline-block">
                            <input type="hidden" name="id" value={cls.id} />
                            <Button variant="ghost" size="icon" type="submit" className="text-destructive hover:bg-destructive/10" title="Delete Class">
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
