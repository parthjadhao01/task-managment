import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex gap-4">
      <Button variant="primary">
        Default12
      </Button>
      <Button variant="destructive">
        Destructive
      </Button>
      <Button variant="outline">
        Outline
      </Button>
      <Button variant="secondary">
        Secondary
      </Button>
      <Button variant="ghost">
        Ghost
      </Button>
      <Button variant="muted">
        muted
      </Button>
      <Button variant="teritary">
        teritrary
      </Button>
    </div>
  );
}
