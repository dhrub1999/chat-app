import Button from "@/components/ui/Button";
import { db } from "@/lib/db";

export default async function Home() {
  return (
    <div className="h-full w-full grid place-content-center">
      <Button variant={"ghost"}>Click here</Button>
    </div>
  );
}
