
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { HumanizedText } from "@/types/user";
import { toast } from "sonner";
import { copyToClipboard } from "@/utils/clipboard";
import { Textarea } from "@/components/ui/textarea";

interface ProjectsListProps {
  projects: HumanizedText[];
}

const ProjectsList = ({ projects }: ProjectsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState<HumanizedText | null>(null);
  const itemsPerPage = 5;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric"
    });
  };

  // pagination
  const last = currentPage * itemsPerPage;
  const first = last - itemsPerPage;
  const pageItems = projects.slice(first, last);
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Projects</CardTitle>
          <CardDescription>
            View and manage all your AI humanizer projects.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Characters</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageItems.length > 0 ? (
                  pageItems.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.title}</TableCell>
                      <TableCell>
                        {formatDate(p.created_at)}
                        <div className="text-xs text-gray-500">
                          {formatTime(p.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </div>
                      </TableCell>
                      <TableCell>
                        {p.original_text.length.toLocaleString()}
                      </TableCell>
                      <TableCell>{p.credits_used}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelected(p)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      You haven't created any projects yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {projects.length > itemsPerPage && (
          <CardFooter className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <PaginationItem key={pg}>
                    <PaginationLink
                      isActive={pg === currentPage}
                      onClick={() => setCurrentPage(pg)}
                    >
                      {pg}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-lg font-semibold">Project Details</h3>
              <button
                onClick={() => setSelected(null)}
                className="text-2xl leading-none text-gray-600 hover:text-gray-900"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <div>
                <p className="font-medium mb-2">Input AI Text</p>
                <Textarea
                  className="h-48 resize-none"
                  readOnly
                  value={selected.original_text}
                />
              </div>
              <div>
                <p className="font-medium mb-2">Humanized Output</p>
                <Textarea
                  className="h-48 resize-none"
                  readOnly
                  value={selected.humanized_text}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 border-t px-6 py-4">
              <Button
                variant="outline"
                onClick={() => {
                  copyToClipboard(selected.humanized_text);
                  toast.success("Copied to clipboard!");
                }}
              >
                Copy Output
              </Button>
              <Button className="bg-gradient-purple-blue" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectsList;
