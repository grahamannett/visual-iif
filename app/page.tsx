import CsvProcessor from "@/components/CsvProcessor";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
      <main className="w-full max-w-4xl flex flex-col items-center gap-8">
        <CsvProcessor />
      </main>
    </div>
  );
}
