import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex flex-1 flex-col">
        <Hero />
      </main>
    </div>
  );
}
