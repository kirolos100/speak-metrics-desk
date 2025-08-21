import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Cloud, HardDriveIcon } from "lucide-react";

const UploadRecords = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Upload Record</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* File Upload Section */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Input
                  type="file"
                  accept=".mp3,.mp4,.wav"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="text-gray-400">
                    <HardDriveIcon className="w-12 h-12 mx-auto mb-2" />
                  </div>
                  <span className="text-lg text-gray-600">Choose File</span>
                  <span className="text-gray-400">No file chosen</span>
                </label>
              </div>
              
              <p className="text-sm text-gray-500">
                Format: mp3, mp4 or WAV
              </p>
              
              <Button className="w-full bg-primary hover:bg-primary/90">
                Process
              </Button>
            </div>

            {/* Cloud Storage Options */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-analytics-blue">
                  <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                    <div className="w-16 h-16 bg-analytics-blue rounded-lg flex items-center justify-center">
                      <div className="text-white text-2xl font-bold">
                        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">Azure Blob</h3>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-analytics-blue">
                  <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
                    <div className="w-16 h-16 bg-analytics-blue rounded-lg flex items-center justify-center">
                      <Cloud className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">Microsoft OneDrive</h3>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadRecords;