import Link from 'next/link';
import { MapIcon, HomeIcon, BuildingIcon, ArrowRightIcon, FileTextIcon } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex flex-col">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-8 mt-4">
          Dreamy Haven Explorer
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <Link
            href="/property-map"
            className="group rounded-lg border border-transparent px-5 py-4 bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            <h2 className="mb-3 text-2xl font-semibold flex items-center gap-2">
              <MapIcon className="h-6 w-6 text-electric" />
              Interactive Map
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-80">
              Explore properties with our interactive 3D map with satellite view and area insights.
            </p>
            <div className="mt-4 flex items-center text-electric text-sm">
              Explore now 
              <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/neighborhoods"
            className="group rounded-lg border border-transparent px-5 py-4 bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            <h2 className="mb-3 text-2xl font-semibold flex items-center gap-2">
              <BuildingIcon className="h-6 w-6 text-electric" />
              Neighborhoods
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-80">
              Discover trending neighborhoods with detailed analytics and lifestyle scores.
            </p>
            <div className="mt-4 flex items-center text-electric text-sm">
              Browse neighborhoods
              <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/properties"
            className="group rounded-lg border border-transparent px-5 py-4 bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            <h2 className="mb-3 text-2xl font-semibold flex items-center gap-2">
              <HomeIcon className="h-6 w-6 text-electric" />
              Properties
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-80">
              Browse our curated selection of premium properties in top locations.
            </p>
            <div className="mt-4 flex items-center text-electric text-sm">
              View properties
              <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
          
          <Link
            href="/rental-agreement"
            className="group rounded-lg border border-transparent px-5 py-4 bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            <h2 className="mb-3 text-2xl font-semibold flex items-center gap-2">
              <FileTextIcon className="h-6 w-6 text-electric" />
              Rental Agreement
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-80">
              Generate, sign, and analyze rental agreements with our AI-powered tools.
            </p>
            <div className="mt-4 flex items-center text-electric text-sm">
              Create agreement
              <ArrowRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
} 