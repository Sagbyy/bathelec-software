'use client';

import { useParams } from 'next/navigation';

export default function UserDetailsPage() {
  const { userId } = useParams();

  return <div>Edit User {userId}</div>;
}
