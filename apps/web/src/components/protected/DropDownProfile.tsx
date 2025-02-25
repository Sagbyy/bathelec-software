import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Icon } from '@iconify/react/dist/iconify.js';
import Link from 'next/link';

interface NavbarProps {
  logout: () => void;
  username: string;
}

export function DropdownMenuProfile({ logout, username }: NavbarProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="ml-auto lg:ml-4">
        <div className="flex cursor-pointer items-center gap-2">
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${username}`}
            />
            <AvatarFallback>{username}</AvatarFallback>
          </Avatar>
          <Icon
            icon="akar-icons:chevron-down"
            className="h-3 w-3 text-gray-500"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-2 w-56">
        <DropdownMenuLabel>{username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/dashboard/profile">
          <DropdownMenuItem>
            <User />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem>
          <LogOut />
          <span onClick={logout}>Se déconnecter</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
