import { Badge } from "@/modules/common/components/ui/badge";

import { AnimalGender, type Animal } from "@/modules/animal/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/modules/common/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/modules/common/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/common/components/ui/select";
import useAnimalTypeListQuery from "@/modules/animal/hooks/queries/useAnimalTypeListQuery";
import { toast } from "sonner";
import { cn, generateServiceErrorMessage } from "@/modules/common/lib/utils";
import useUpdateAnimalMutation from "@/modules/animal/hooks/mutations/useUpdateAnimalMutation";
import { useState, type FC } from "react";
import dayjs from "dayjs";
import { Button } from "@/modules/common/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/common/components/ui/popover";
import { Calendar } from "@/modules/common/components/ui/calendar";
import { CalendarIcon, MarsIcon, PencilIcon, VenusIcon } from "lucide-react";
import { useEventListener } from "usehooks-ts";
import { PopoverClose } from "@radix-ui/react-popover";

const DetailsView: FC<{ animal: Animal | undefined }> = ({ animal }) => {
  const { data: animalTypeListData } = useAnimalTypeListQuery();

  return (
    <div className="grid grid-cols-3 gap-x-2 gap-y-2">
      <div>
        <div className="text-neutral-500 text-xs">Code</div>
        <div>{animal?.code || "-"}</div>
      </div>
      <div className="col-span-2">
        <div className="text-neutral-500 text-xs">Name</div>
        <div className="space-x-1">
          <span>{animal?.name || "{No name}"}</span>
          {animal?.gender === "MALE" && (
            <Badge variant="secondary" className="gap-x-1 inline-flex">
              <MarsIcon className="size-3" />
              Male
            </Badge>
          )}
          {animal?.gender === "FEMALE" && (
            <Badge variant="secondary" className="gap-x-1 inline-flex">
              <VenusIcon className="size-3" />
              Female
            </Badge>
          )}
          <Badge variant="secondary" className="gap-x-1 inline-flex">
            {animalTypeListData?.docs.find(
              (doc) => doc.code === animal?.animalTypeCode,
            )?.name ?? "-"}
          </Badge>
        </div>
      </div>

      <div>
        <div className="text-neutral-500 text-xs">Date of Birth</div>
        {animal?.dateOfBirth ? (
          <div className="space-x-1">
            <span>{dayjs(animal.dateOfBirth).format("D MMM YYYY")}</span>
            <Badge variant="secondary">
              {dayjs().diff(dayjs(animal.dateOfBirth), "year")} Years old
            </Badge>
          </div>
        ) : (
          <div>Unknown</div>
        )}
      </div>

      <div>
        <div className="text-neutral-500 text-xs">Died at</div>
        <div>
          {animal?.diedAt ? (
            dayjs(animal.diedAt).format("D MMM YYYY")
          ) : (
            <span>Alive</span>
          )}
        </div>
      </div>
    </div>
  );
};

const formSchema = z.object({
  animalTypeCode: z.string(),
  code: z.string(),
  name: z.string(),
  dateOfBirth: z.string().nullable(),
  diedAt: z.string().nullable(),
  gender: z.nativeEnum(AnimalGender),
});

const DetailsForm: FC<{
  animal: Animal | undefined;
  setEditing: (open: boolean) => void;
}> = ({ animal, setEditing }) => {
  const { data: animalTypeListData } = useAnimalTypeListQuery();

  const { mutateAsync, isPending } = useUpdateAnimalMutation({
    options: {},
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      animalTypeCode: animal?.animalTypeCode,
      name: animal?.name,
      code: animal?.code,
      dateOfBirth: animal?.dateOfBirth
        ? dayjs(animal?.dateOfBirth).format("YYYY-MM-DD")
        : null,
      diedAt: animal?.diedAt
        ? dayjs(animal?.diedAt).format("YYYY-MM-DD")
        : null,
      gender: animal?.gender || undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!animal) throw new Error("Animal not found");

      await mutateAsync({
        id: animal?.id,
        name: values.name,
        code: values.code,
        animalTypeCode: values.animalTypeCode,
        dateOfBirth: values.dateOfBirth,
        diedAt: values.diedAt,
        gender: values.gender,
      });

      setEditing(false);

      toast.success("Animal details updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update animal details", {
        description: generateServiceErrorMessage(error),
      });
    }
  };

  useEventListener("keydown", (event) => {
    if (
      event.target === document.body &&
      event.key === "Escape" &&
      !isPending
    ) {
      setEditing(false);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-x-2 gap-y-2">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder="Animal code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Animal name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="animalTypeCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Animal Type</FormLabel>
                <Select
                  disabled
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Animal type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {animalTypeListData?.docs.map((animalType) => (
                      <SelectItem key={animalType.code} value={animalType.code}>
                        {animalType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "flex w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon />
                        {field.value ? (
                          dayjs(field.value).format("DD MMM YYYY")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value ? dayjs(field.value).toDate() : undefined
                      }
                      onSelect={(day) => {
                        field.onChange(
                          day ? dayjs(day).format("YYYY-MM-DD") : null,
                        );
                      }}
                      initialFocus
                      components={{
                        DayContent: (props) => {
                          return (
                            <PopoverClose className="h-full w-full">
                              {props.date.getDate()}
                            </PopoverClose>
                          );
                        },
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="diedAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Died At</FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "flex w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon />
                        {field.value ? (
                          dayjs(field.value).format("DD MMM YYYY")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value ? dayjs(field.value).toDate() : undefined
                      }
                      onSelect={(day) => {
                        field.onChange(
                          day ? dayjs(day).format("YYYY-MM-DD") : null,
                        );
                      }}
                      initialFocus
                      components={{
                        DayContent: (props) => {
                          return (
                            <PopoverClose className="h-full w-full">
                              {props.date.getDate()}
                            </PopoverClose>
                          );
                        },
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(AnimalGender).map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="mt-4" disabled={isPending}>
          Save
        </Button>
        <Button
          variant="outline"
          className="mt-4 ml-2"
          onClick={() => setEditing(false)}
          disabled={isPending}
        >
          Cancel
        </Button>
      </form>
    </Form>
  );
};

const DetailsSection: FC<{ animal: Animal | undefined }> = ({ animal }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <section className="justify-between py-4 px-3 rounded-lg border border-neutral-200 bg-white">
      <h2 className="mb-3 flex items-center justify-between">
        Details
        {!isEditing && (
          <Button
            data-testid="edit-button"
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <PencilIcon />
          </Button>
        )}
      </h2>
      {isEditing ? (
        <DetailsForm animal={animal} setEditing={setIsEditing} />
      ) : (
        <DetailsView animal={animal} />
      )}
    </section>
  );
};

export default DetailsSection;
