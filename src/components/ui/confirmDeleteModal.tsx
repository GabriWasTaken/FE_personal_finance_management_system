import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { DialogDescription } from "@radix-ui/react-dialog";

function ConfirmDeleteModal({ isOpen, setIsOpen, handleDelete }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void, handleDelete: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        <DialogDescription> This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.</DialogDescription>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDeleteModal;
