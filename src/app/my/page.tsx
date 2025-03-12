"use client";

import { useState } from "react";
import { Copy, Check, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock data
const inviteCode = "INVITE123";
const inviteLink = `https://example.com/invite/${inviteCode}`;
const totalInvites = 25;

// Generate more mock data for pagination
const generateInviteRecords = () => {
  const statuses = ["active", "pending", "inactive"];
  const records = [];

  for (let i = 1; i <= 25; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 100));

    records.push({
      id: i,
      username: `user${i}`,
      joinTime: date.toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
    });
  }

  return records;
};

const allInviteRecords = generateInviteRecords();

export default function PersonalCenter() {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(allInviteRecords.length / itemsPerPage);

  // Get current page records
  const indexOfLastRecord = currentPage * itemsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - itemsPerPage;
  const currentRecords = allInviteRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );

  const copyToClipboard = (text: string, type: "code" | "link") => {
    navigator.clipboard.writeText(text);

    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      // If 5 or fewer pages, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);

      // Add ellipsis if current page is > 3
      if (currentPage > 3) {
        pageNumbers.push("ellipsis");
      }

      // Add pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if current page is < totalPages - 2
      if (currentPage < totalPages - 2) {
        pageNumbers.push("ellipsis");
      }

      // Always include last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // In a real app, this would generate and download the poster
  const downloadPoster = () => {
    // This would be implemented with canvas or html-to-image in a real app
    alert("Poster download functionality would be implemented here");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Personal Center</h1>

      <div className="mb-8 grid gap-8 md:grid-cols-2">
        {/* Invitation Code Card */}
        <Card>
          <CardHeader>
            <CardTitle>My Invitation Code</CardTitle>
            <CardDescription>
              Share this code with friends to invite them
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Invitation Code</div>
              <div className="flex items-center gap-2">
                <Input value={inviteCode} readOnly className="font-medium" />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(inviteCode, "code")}
                  className="flex items-center gap-2"
                >
                  {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                  Copy
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Invitation Link</div>
              <div className="flex items-center gap-2">
                <Input value={inviteLink} readOnly className="text-sm" />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(inviteLink, "link")}
                  className="flex items-center gap-2"
                >
                  {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex w-full items-center gap-2">
                  <Share2 size={16} />
                  Share Invitation Poster
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Invitation Poster</DialogTitle>
                  <DialogDescription>
                    Share this poster with your friends to invite them.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center">
                  <div className="mx-auto w-full max-w-sm rounded-lg bg-gradient-to-b from-primary/20 to-primary/10 p-6">
                    <div className="overflow-hidden rounded-lg bg-white shadow-lg">
                      {/* Poster Header */}
                      <div className="bg-primary p-4 text-center text-primary-foreground">
                        <h3 className="text-xl font-bold">Join Our Platform</h3>
                        <p className="text-sm opacity-90">
                          You've been invited!
                        </p>
                      </div>

                      {/* Poster Content */}
                      <div className="flex flex-col items-center gap-4 p-6">
                        {/* QR Code Placeholder */}
                        <div className="flex h-40 w-40 items-center justify-center border bg-muted">
                          <div className="text-center text-xs text-muted-foreground">
                            QR Code
                            <br />
                            (Scan to join)
                          </div>
                        </div>

                        {/* Invitation Code */}
                        <div className="text-center">
                          <p className="mb-1 text-sm text-muted-foreground">
                            Invitation Code
                          </p>
                          <div className="rounded-md bg-muted px-4 py-2 text-2xl font-bold tracking-wider">
                            {inviteCode}
                          </div>
                        </div>

                        {/* Instructions */}
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                          Visit <span className="font-medium">example.com</span>{" "}
                          and enter this code to join.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={downloadPoster}
                    className="mt-4 flex items-center gap-2"
                  >
                    <Download size={16} />
                    Download Poster
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        {/* Invitation Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Invitation Statistics</CardTitle>
            <CardDescription>
              Overview of your invitation activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-center justify-center">
              <div className="text-center">
                <span className="text-5xl font-bold">{totalInvites}</span>
                <p className="mt-2 text-muted-foreground">Total Invitations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invitation Records Card */}
      <Card>
        <CardHeader>
          <CardTitle>Invitation Records</CardTitle>
          <CardDescription>History of people you've invited</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              Showing {indexOfFirstRecord + 1}-
              {Math.min(indexOfLastRecord, allInviteRecords.length)} of{" "}
              {allInviteRecords.length} records
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Join Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.username}
                  </TableCell>
                  <TableCell>
                    {new Date(record.joinTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.status === "active"
                          ? "default"
                          : record.status === "pending"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {getPageNumbers().map((page, index) =>
                page === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(Number(page))}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
}
