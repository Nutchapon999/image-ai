"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { CopyIcon, FileIcon, Loader, MoreHorizontal, Search, Trash, TriangleAlert } from "lucide-react";

import {
  Table,
  TableRow,
  TableBody,
  TableCell
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useDeleteProject } from "@/features/projects/api/use-delete-project";
import { useDuplicateProject } from "@/features/projects/api/use-duplicate-project";
import { useConfirm } from "@/hooks/use-confirm";

export const ProjectsSection = () => {
  const router = useRouter();

  const duplicateMutation = useDuplicateProject();
  const removeMutation = useDeleteProject();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this project."
  );

  const { 
    data,
    status,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage
  } = useGetProjects();

  const onCopy = (id: string) => {
    duplicateMutation.mutate({ id });
  }

  const onDelete = async (id: string) => {
    const ok = await confirm();

    if (ok) {
      removeMutation.mutate({ id });
    }
  }

  if (status === "pending") {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          Recent projects
        </h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <Loader className="size-6 text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          Recent projects
        </h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <TriangleAlert className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Failed to load projects
          </p>
        </div>
      </div>
    );
  }

  if (!data?.pages.length) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          Recent projects
        </h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <Search className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            No projects found
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog />
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          Recent projects
        </h3>
        <Table>
          <TableBody>
            {
              data.pages.map((group, i) => (
                <React.Fragment key={i}>
                  {
                    group.data.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell
                          onClick={() => router.push(`/editor/${project.id}`)}
                          className="font-medium flex items-center gap-x-2 cursor-pointer"
                        >
                          <FileIcon className="size-6" />
                          { project.name }
                        </TableCell>
                        <TableCell
                          onClick={() => router.push(`/editor/${project.id}`)}
                          className="hidden md:table-cell cursor-pointer"
                        >
                          { project.width } x { project.height } px
                        </TableCell>
                        <TableCell
                          onClick={() => router.push(`/editor/${project.id}`)}
                          className="hidden md:table-cell cursor-pointer"
                        >
                          { formatDistanceToNow(project.createdAt, { addSuffix: true }) }
                        </TableCell>
                        <TableCell className="flex items-center justify-end">
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                disabled={false}
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="size-4"/>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-60"
                            >
                              <DropdownMenuItem
                                disabled={duplicateMutation.isPending}
                                className="h-10 cursor-pointer"
                                onClick={() => onCopy(project.id)} 
                              >
                                <CopyIcon className="size-4 mr-2" />
                                Make a copy
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                disabled={removeMutation.isPending}
                                className="h-10 cursor-pointer"
                                onClick={() => onDelete(project.id)} 
                              >
                                <Trash className="size-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </React.Fragment>
              ))
            }
          </TableBody>
        </Table>
        {
          hasNextPage && (
            <div className="w-full flex items-center justify-center pt-4">
              <Button
                variant="ghost"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                Load more
              </Button>
            </div>
          )
        }
      </div>
    </>
  );
}