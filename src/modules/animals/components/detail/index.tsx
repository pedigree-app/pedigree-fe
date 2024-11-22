import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/common/components/ui/breadcrumb";
import MainLayout from "@/common/layouts/MainLayout";
import { Link } from "@tanstack/react-router";
import { Button } from "@/common/components/ui/button";
import { TbPencil, TbTrash } from "react-icons/tb";
import { MdOutlineOpenInNew } from "react-icons/md";
import { ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";
import AchievementTable from "./AchievementTable";
import { BsGenderMale, BsThreeDots } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import type { FC } from "react";
import { Badge } from "@/common/components/ui/badge";
import dayjs from "dayjs";

type MateType = {
  id: string;
  code: string;
  name: string;
  matedAt: string;
};

const mates: MateType[] = [
  {
    id: "m5gr84i9",
    name: "Jane",
    code: "AAA-003",
    matedAt: "2022-01-01",
  },
  {
    id: "a5gr84s9",
    name: "Mary",
    code: "AAA-004",
    matedAt: "2022-01-01",
  },
];

const AnimalDetail = () => {
  return (
    <MainLayout>
      <div className="-mt-4 w-[calc(100%+48px)] ml-[-24px] bg-teal-600 px-6 rounded-b-3xl py-4 pb-12">
        <div className="flex items-center justify-between text-white">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">
                  <BreadcrumbLink asChild>
                    <Link to="/animals">Animals</Link>
                  </BreadcrumbLink>
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">AAA-001</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex gap-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="opacity-50 hover:opacity-100"
            >
              <TbTrash className="size-2" />
              Delete
            </Button>

            <div className="border border-white/0 hover:border-white/100 rounded-lg opacity-50 hover:opacity-100">
              <Button variant="ghost" size="sm">
                <ChevronLeft />
              </Button>
              <Button variant="ghost" size="sm">
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 translate-y-[-50px]">
        <div className="grid grid-cols-[1fr_350px] gap-x-4">
          <div className="space-y-3">
            {/* Animal Detail */}
            <div className="justify-between py-4 px-3 rounded-lg border border-neutral-200 bg-white">
              <div className="mb-3 flex justify-between">
                Details
                <Button variant="ghost" size="sm">
                  <TbPencil />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-x-2 gap-y-2">
                <div>
                  <div className="text-neutral-500 text-xs">Code</div>
                  <div>AAA-001</div>
                </div>
                <div className="col-span-2">
                  <div className="text-neutral-500 text-xs">Name</div>
                  <div className="space-x-1">
                    <span>Heli</span>
                    <Badge variant="secondary" className="gap-x-1 inline-flex">
                      <BsGenderMale />
                      Male
                    </Badge>
                    <Badge variant="secondary" className="gap-x-1 inline-flex">
                      Dog
                    </Badge>
                  </div>
                </div>

                <div>
                  <div className="text-neutral-500 text-xs">Date of Birth</div>
                  <div className="space-x-1">
                    <span>20 Jan 2023</span>
                    <Badge variant="secondary">5 Years old</Badge>
                  </div>
                </div>

                <div>
                  <div className="text-neutral-500 text-xs">Died at</div>
                  <div>Unknown</div>
                </div>
              </div>
            </div>

            {/* Achievement section */}
            <section className="py-4 px-3 rounded-lg border border-neutral-200 bg-white">
              <div className="mb-3 flex justify-between items-center">
                Achievements
                <Button size="sm" variant="ghost">
                  <PlusIcon />
                </Button>
              </div>
              <div>
                <AchievementTable />
              </div>
            </section>
          </div>
          <div className="space-y-3">
            {/* Parent section */}
            <section className="py-4 px-3 rounded-lg border border-neutral-200 bg-white">
              <div className="mb-3 flex items-center justify-between">
                Parent
                <Button variant="ghost" size="sm">
                  <TbPencil />
                </Button>
              </div>

              <div className="bg-slate-100 px-3 py-2 rounded mb-2">
                <div className="text-neutral-500 text-xs mb-1 flex items-center justify-between">
                  Father
                  <Link
                    to="/animals/$animalId"
                    params={{
                      animalId: "xxx",
                    }}
                    target="_blank"
                  >
                    <MdOutlineOpenInNew />
                  </Link>
                </div>

                <div className="flex justify-between">
                  <span>Helium</span>
                  <span>AA0-001</span>
                </div>
              </div>

              <div className="bg-slate-100 px-3 py-2 rounded">
                <div className="text-neutral-500 text-xs mb-1 flex items-center justify-between">
                  Mother
                  <Link
                    to="/animals/$animalId"
                    params={{
                      animalId: "xxx",
                    }}
                    target="_blank"
                  >
                    <MdOutlineOpenInNew />
                  </Link>
                </div>

                <div className="flex justify-between">
                  <span>Janet</span>
                  <span>AA0-002</span>
                </div>
              </div>
            </section>

            {/* Mate section */}
            <section className="py-4 px-3 rounded-lg border border-neutral-200 bg-white">
              <div className="mb-3 flex items-center justify-between">
                Mate
                <Button variant="ghost" size="sm">
                  <PlusIcon />
                </Button>
              </div>

              <div className="space-y-2">
                {mates.map((mate) => (
                  <Mate key={mate.id} mate={mate} />
                ))}
              </div>
            </section>

            {/* Note section */}
            <section className="py-4 px-3 rounded-lg border border-neutral-200 bg-white">
              <div className="mb-3 flex items-center justify-between">
                Note
                <Button variant="ghost" size="sm">
                  <TbPencil />
                </Button>
              </div>

              <div className="bg-slate-100 px-3 py-2 rounded">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consequatur, voluptatibus.
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const Mate: FC<{
  mate: MateType;
}> = ({ mate }) => {
  return (
    <div className="bg-slate-100 px-3 py-2 rounded">
      <div className="text-neutral-500 text-xs mb-1 flex items-center justify-between">
        Name
        <DropdownMenu>
          <DropdownMenuTrigger>
            <BsThreeDots />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Remove</DropdownMenuItem>
            <DropdownMenuItem>Update</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div>
        <div className="flex justify-between">
          <span>{mate.name}</span>
          <span>{mate.code}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-xs mt-1 text-neutral-400">
            Mated at: <span>{dayjs(mate.matedAt).format("DD MMMM YYYY")}</span>
          </div>
          <div className="text-xs mt-1 text-neutral-400">Children: 3</div>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetail;
