import React from "react";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAccount } from "@/services/account";
import { useErrorManager } from "@/hooks/useErrorManager";
import { toast } from "sonner";

const AddAccountModal = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) => {
  const handleError = useErrorManager();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['/accounts'],
    mutationFn: addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/accounts'] });
      toast.success("Account added");
      setIsOpen(false);
    },
    onError: () => {
      toast.error("Error adding account");
      // Remove optimistic todo from the todos list
    },
  })

  const handleSubmitAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formdata = new FormData(form);
    const name = formdata.get('name') as string;

    mutation.mutate({
      name, handleError
    });
    form.reset();
  }


  const AddAccountModalBody = () => {
    return (
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Name
          </Label>
          <Input id="name" name='name' className="col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Add account</DialogTitle>
          {/*<DialogDescription>
            Make changes to your profile here. Click save
          </DialogDescription>*/}
        </DialogHeader>
        <form onSubmit={handleSubmitAccount}>
          {AddAccountModalBody()}
          <DialogFooter>
            <Button type='submit'>Add!!</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddAccountModal;