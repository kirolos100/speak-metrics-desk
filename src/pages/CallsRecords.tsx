import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CallRecordsTable from "@/components/CallRecordsTable";

const CallsRecords = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CallRecordsTable />
      </main>
      
      <Footer />
    </div>
  );
};

export default CallsRecords;