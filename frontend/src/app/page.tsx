import { Button } from "@/components/ui/button";
import UserButton from "@/features/auth/user-button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex gap-4">
      <UserButton></UserButton>
    </div>
  );
}
