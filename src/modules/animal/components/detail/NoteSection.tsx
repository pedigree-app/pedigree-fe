import { Button } from "@/modules/common/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/modules/common/components/ui/form";
import { Textarea } from "@/modules/common/components/ui/textarea";
import { generateServiceErrorMessage } from "@/modules/common/lib/utils";
import useUpdateAnimalMutation from "@/modules/animal/hooks/mutations/useUpdateAnimalMutation";
import type { Animal } from "@/modules/animal/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const NoteView = ({ animal }: { animal: Animal | undefined }) => {
  return (
    <div className="bg-slate-100 px-3 py-2 rounded">
      {animal?.note || "No note"}
    </div>
  );
};

const formSchema = z.object({
  note: z.string(),
});

const NoteForm: FC<{
  animal: Animal | undefined;
  setEditing: (editing: boolean) => void;
}> = ({ animal, setEditing }) => {
  const { mutateAsync, isPending } = useUpdateAnimalMutation({
    options: {},
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: animal?.note || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!animal) throw new Error("Animal not found");

      await mutateAsync({
        id: animal?.id,
        note: values.note,
      });

      setEditing(false);

      toast.success("Parent updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update parent", {
        description: generateServiceErrorMessage(error),
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Add note..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-4" disabled={isPending}>
          Save
        </Button>
      </form>
    </Form>
  );
};

const NoteSection: FC<{
  animal: Animal | undefined;
}> = ({ animal }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="py-4 px-3 rounded-lg border border-neutral-200 bg-white">
      <h2 className="mb-3 flex items-center justify-between">
        Note
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <PencilIcon />
          </Button>
        )}
      </h2>

      {isEditing ? (
        <NoteForm animal={animal} setEditing={setIsEditing} />
      ) : (
        <NoteView animal={animal} />
      )}
    </section>
  );
};

export default NoteSection;
