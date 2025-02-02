import { Button } from "./ui/button";
import { useSignOut, useUser } from "@/lib/auth";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Link } from "wouter";
import { Clock, History } from "lucide-react";

export function NavHeader() {
  const { data: user } = useUser();
  const signOut = useSignOut();

  if (!user) return null;

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-semibold text-primary flex items-center gap-2">
            <Clock className="h-6 w-6" />
            FastTracker
          </Link>
          
          <nav className="flex gap-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/history" className="text-muted-foreground hover:text-foreground">
              <span className="flex items-center gap-1">
                <History className="h-4 w-4" />
                History
              </span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Avatar>
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <Button variant="ghost" onClick={() => signOut.mutate()}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
