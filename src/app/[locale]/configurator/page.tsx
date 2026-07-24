import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

/** Design studio removed — send visitors back to the homepage. */
export default async function ConfiguratorPage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}`);
}
