import { ProfileView } from "./profile-view";

export function generateStaticParams() {
  return [{ "public-id": "cmp-42" }];
}

export async function generateMetadata({ params }: { params: Promise<{ "public-id": string }> }) {
  const { "public-id": publicId } = await params;
  return { title: `Nest ${publicId}` };
}

export default async function ProfilePage({ params }: { params: Promise<{ "public-id": string }> }) {
  const { "public-id": publicId } = await params;
  return <ProfileView publicId={publicId} />;
}
