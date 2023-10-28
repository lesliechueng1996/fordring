import Link from 'next/link';
import routes from '@/routes';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ThemeButton from './ThemeButton';

const NAV_ITEM_STYLE =
  'cursor-pointer rounded-lg px-3 py-2 hover:bg-background transition-colors duration-500';

const TOOL_ITEM_STYLE =
  'cursor-pointer hover:text-slate-300 transition-colors duration-500';

function AppHeader() {
  return (
    <header className="h-24 pt-4 flex items-center gap-10 font-bold text-label justify-between">
      <Link href="/" className="shrink-0 cursor-pointer text-center">
        <h1 className="text-3xl">LESLIE</h1>
        <h2 className="text-xs">Leslie Cheung</h2>
      </Link>
      <nav className="hidden lg:flex items-center gap-3 grow shrink-0">
        {routes.map((route) => (
          <Link href={route.path} key={route.path} className={NAV_ITEM_STYLE}>
            {route.label}
          </Link>
        ))}
      </nav>
      <div className="shrink-0 flex items-center gap-5">
        <div className={TOOL_ITEM_STYLE}>
          <MagnifyingGlassIcon className="w-6 h-6" />
        </div>
        <div className={TOOL_ITEM_STYLE}>
          <ThemeButton />
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
