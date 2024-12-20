import MainLayout from "@/common/layouts/MainLayout";
import AnimalsTable from "./AnimalsTable";
import { Input } from "@/common/components/ui/input";
import { Checkbox } from "@/common/components/ui/checkbox";
import { Route } from "@/routes/animals/index";
import { useNavigate } from "@tanstack/react-router";
import { Label } from "@/common/components/ui/label";
import { useDebounceCallback } from "usehooks-ts";
import AddAnimalDialog from "./AddAnimalDialog";

const Animals = () => {
  const { gender, search } = Route.useSearch();
  const navigate = useNavigate({ from: "/animals" });

  const debouncedSetSearch = useDebounceCallback((value: string) => {
    navigate({
      search: (prev) => {
        return {
          ...prev,
          search: value || undefined,
        };
      },
    });
  }, 500);

  return (
    <MainLayout>
      <div className="relative">
        <div className="mr-[280px]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="mt-4 text-3xl">Animals</h1>
            <AddAnimalDialog />
          </div>
          <AnimalsTable />
        </div>
        <div className="bg-white absolute top-0 right-0 border w-[250px] px-2 rounded py-2">
          <Input
            name="search"
            type="text"
            placeholder="Search"
            className="w-full"
            defaultValue={search}
            onInput={(e) => {
              debouncedSetSearch(e.currentTarget.value || "");
            }}
          />

          <div className="my-3 border-t" />

          <div className="grid grid-cols-2 gap-2">
            {(["MALE", "FEMALE"] as const).map((currentGender) => (
              <div key={currentGender}>
                <Checkbox
                  value={currentGender}
                  id={`cb-gender-${currentGender}`}
                  className="peer sr-only"
                  checked={!!gender?.length && gender?.includes(currentGender)}
                  onCheckedChange={(checked) => {
                    navigate({
                      search: (prev) => {
                        const newGender = checked
                          ? [...(prev.gender ?? []), currentGender]
                          : (prev.gender ?? []).filter(
                              (g) => g !== currentGender,
                            );

                        return {
                          ...prev,
                          gender: newGender.length ? newGender : undefined,
                        };
                      },
                    });
                  }}
                />
                <Label
                  htmlFor={`cb-gender-${currentGender}`}
                  className="capitalize text-xs flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  {currentGender}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Animals;
