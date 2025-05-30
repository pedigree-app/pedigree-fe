import { Button } from "@/modules/common/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/common/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/modules/common/components/ui/command";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronsUpDown,
  MarsIcon,
  ShrinkIcon,
  Skull,
  VenusIcon,
} from "lucide-react";
import { Route } from "@/routes/pedigree";
import { cn } from "@/modules/common/lib/utils";
import { toPng } from "html-to-image";
import PedigreeTree from "./PedigreeTree";
import useInfiniteAnimalListQuery from "@/modules/animal/hooks/queries/useInfiniteAnimalListQuery";
import useAnimalListQuery from "@/modules/animal/hooks/queries/useAnimalListQuery";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import MainLayout from "@/modules/common/components/layouts/MainLayout";
import usePedigreeTreeQuery from "../../hooks/queries/usePedigreeTreeQuery";
import type { TreeNode } from "../../services/pedigree.type";

const Pedigree = () => {
  const { animalId } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch the current animal directly using id_eq
  const { data: currentAnimalData } = useAnimalListQuery({
    query: {
      id_eq: animalId,
    },
    options: {
      enabled: !!animalId,
    },
  });

  const currentAnimal = useMemo(
    () => currentAnimalData?.docs?.[0] || null,
    [currentAnimalData],
  );

  const {
    data: infiniteAnimalsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingAnimals,
  } = useInfiniteAnimalListQuery({
    query: {
      search: searchQuery || undefined,
    },
  });

  // Flatten the pages data for rendering the dropdown
  const animals = useMemo(() => {
    return infiniteAnimalsData?.pages.flatMap((page) => page.docs) || [];
  }, [infiniteAnimalsData]);

  // Handle search input
  const handleSearchInput = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const { data: pedigreeTreeData } = usePedigreeTreeQuery({
    query: {
      animal_id_eq: animalId!,
      level: 4,
    },
    options: {
      enabled: !!animalId,
    },
  });
  const [nodes, setNodes] = useState<(TreeNode | null)[]>([]);

  useEffect(() => {
    if (pedigreeTreeData) {
      setNodes(pedigreeTreeData.docs);
    }
  }, [pedigreeTreeData, animalId]);

  const ref = useRef<HTMLDivElement>(null);

  const onDownloadImage = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true, quality: 1 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `Pedigree Tree of ${currentAnimal?.name ?? "Animal"}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref, currentAnimal?.name]);

  return (
    <MainLayout>
      <div>
        <div className="flex items-center justify-between my-4">
          <h1 className="text-3xl">Pedigree Tree</h1>
        </div>
        <div className="flex flex-col h-[75vh] overflow-hidden border rounded-2xl px-4 bg-neutral-50 relative">
          <div className="text-sm border-b w-[calc(100%+32px)] ml-[-16px] px-4 flex items-center py-3">
            <span className="mr-2">Current Animal</span>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {animalId
                    ? currentAnimal?.name || "Loading..."
                    : "Select animal..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search animal..."
                    value={searchQuery}
                    onValueChange={handleSearchInput}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {isLoadingAnimals ? "Loading..." : "No animal found."}
                    </CommandEmpty>
                    <CommandGroup>
                      {animals.map((animal) => (
                        <CommandItem
                          key={animal.id}
                          value={animal.id}
                          onSelect={(currentValue) => {
                            navigate({
                              search: (prev) => {
                                return {
                                  ...prev,
                                  animalId:
                                    currentValue === animalId
                                      ? ""
                                      : currentValue,
                                };
                              },
                            });
                            setOpen(false);
                          }}
                          className="justify-between"
                        >
                          {animal.name}
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              animalId === animal.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>

                    {/* Add load more button at the bottom */}
                    {hasNextPage && (
                      <div className="py-2 px-1 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          className="w-full"
                        >
                          {isFetchingNextPage ? (
                            <div className="flex items-center">
                              Loading more...
                            </div>
                          ) : (
                            "Load more"
                          )}
                        </Button>
                      </div>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="h-full relative w-full overflow-hidden">
            <div className="absolute flex items-center text-xs top-4 right-2 bg-white px-3 py-2 rounded-xl shadow-lg z-50">
              <ShrinkIcon className="mr-2 size-3" />
              Drag and pinch to zoom
            </div>
            <div ref={ref} className="h-full w-full">
              {!!animalId && (
                <TransformWrapper
                  initialScale={1}
                  centerOnInit={true}
                  maxScale={99999}
                  minScale={0.1}
                >
                  {() => (
                    <TransformComponent
                      wrapperStyle={{
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <PedigreeTree nodes={nodes} setNodes={setNodes} />
                    </TransformComponent>
                  )}
                </TransformWrapper>
              )}
              {!animalId && (
                <div className="flex items-center justify-center h-full">
                  <span className="text-neutral-400">
                    Select an animal to view its pedigree tree
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t w-[calc(100%+32px)] ml-[-16px] px-4 flex items-center justify-between text-xs py-3">
            <div className="text-neutral-400">Pedigree</div>
            <div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 border px-3 py-2 bg-white rounded-2xl">
                  <div className="flex items-center">
                    Female
                    <VenusIcon className="text-yellow-600 size-4 ml-1" />
                  </div>
                  <div className="flex items-center">
                    Male <MarsIcon className="text-green-600 size-4 ml-1" />
                  </div>
                </div>
                <div className="flex items-center gap-2 border px-3 py-2 bg-white rounded-2xl">
                  <div className="flex items-center">
                    Dead
                    <Skull className="text-red-600 size-4 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            className="rounded-xl"
            variant="teal"
            onClick={onDownloadImage}
          >
            Download Image
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Pedigree;
