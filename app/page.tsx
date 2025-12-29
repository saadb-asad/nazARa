import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-50">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        NazARa
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        The Future of Dining. Scan. View. Taste.
      </p>

      <div className="flex gap-4">
        <Link href="/admin/login">
          <Button variant="default">Admin Login</Button>
        </Link>
        <Link href="/admin/dashboard">
          <Button variant="outline">Dashboard</Button>
        </Link>
      </div>

      <div className="mt-12 p-6 border rounded-xl bg-white max-w-sm">
        <p className="text-sm text-gray-500 mb-2">Scan a QR code to view a menu item.</p>
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-4xl">📱</span>
        </div>
      </div>
    </div>
  );
}
