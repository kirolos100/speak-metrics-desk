import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { HardDriveIcon, CheckCircle, Clock, AlertCircle, FileAudio, FileText, Brain } from "lucide-react";
import { apiUploadSingle } from "@/lib/api";

interface FileProgress {
  file: File;
  status: 'pending' | 'uploading' | 'transcribing' | 'analyzing' | 'indexing' | 'completed' | 'error';
  message: string;
  audioBlob?: string;
  transcriptionBlob?: string;
  analysisBlob?: string;
}

const UploadRecords = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileProgress, setFileProgress] = useState<FileProgress[]>([]);
  const [busy, setBusy] = useState(false);
  const [overallStatus, setOverallStatus] = useState<string | null>(null);

  const onChooseFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles(list);
    // Initialize progress for each file
    setFileProgress(list.map(file => ({
      file,
      status: 'pending',
      message: 'Ready to process'
    })));
  };

  const updateFileProgress = (fileName: string, updates: Partial<FileProgress>) => {
    setFileProgress(prev => prev.map(fp => 
      fp.file.name === fileName ? { ...fp, ...updates } : fp
    ));
  };

  const onUpload = async () => {
    try {
      setBusy(true);
      setOverallStatus("Starting processing...");
      
      // Show initial progress state for all files
      files.forEach(file => {
        updateFileProgress(file.name, { 
          status: 'uploading', 
          message: 'Starting processing...' 
        });
      });
      
      // Process files sequentially to enable mid-progress updates
      for (const file of files) {
        try {
          updateFileProgress(file.name, { status: 'uploading', message: 'Uploading...' });
          const result = await apiUploadSingle(file);
          const item = result.processed[0];
          if (!item) {
            updateFileProgress(file.name, { status: 'error', message: '❌ No response item returned' });
          } else if (item.error) {
            updateFileProgress(file.name, { status: 'error', message: `❌ Error: ${item.error}` });
          } else {
            updateFileProgress(file.name, { 
              status: 'completed', 
              message: `✅ Completed. Transcription: ${item.transcription_blob}, Analysis: ${item.analysis_blob}, Search indexed: ${item.search_indexed ? 'Yes' : 'No'}`
            });
          }
        } catch (err: any) {
          updateFileProgress(file.name, { status: 'error', message: `❌ Error: ${err?.message || 'Unknown error'}` });
        }
        // Update overall status after each file to reflect partial completion
        const doneCount = fileProgress.filter(fp => fp.status === 'completed' || fp.status === 'error').length + 1; // +1 accounts for just-finished file not yet in state
        setOverallStatus(`Processing files...`);
      }
      
      setOverallStatus("✅ All files processed! You can now view them in the Calls Records page.");
      
    } catch (e: any) {
      setOverallStatus(`❌ Failed to process files: ${e?.message || 'Unknown error'}`);
      // Mark all files as error
      files.forEach(file => {
        updateFileProgress(file.name, { 
          status: 'error', 
          message: `❌ Error: ${e?.message || 'Unknown error occurred'}` 
        });
      });
    } finally {
      setBusy(false);
    }
  };

  const getStatusIcon = (status: FileProgress['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'uploading': return <FileAudio className="w-4 h-4 text-blue-500" />;
      case 'transcribing': return <FileText className="w-4 h-4 text-yellow-500" />;
      case 'analyzing': return <Brain className="w-4 h-4 text-purple-500" />;
      case 'indexing': return <FileText className="w-4 h-4 text-green-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: FileProgress['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-700';
      case 'uploading': return 'bg-blue-100 text-blue-700';
      case 'transcribing': return 'bg-yellow-100 text-yellow-700';
      case 'analyzing': return 'bg-purple-100 text-purple-700';
      case 'indexing': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Upload & Process Audio Records</CardTitle>
            <p className="text-gray-600 mt-2">
              Upload multiple audio files to automatically transcribe, analyze with GenAI, and index for search.
              Each file will go through the complete pipeline: Upload → Transcribe → Analyze → Index.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Information Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">What happens during processing?</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• <strong>Upload:</strong> Audio files are uploaded to Azure Blob Storage</p>
                <p>• <strong>Transcribe:</strong> Each audio is transcribed using Azure Speech services (Speech Batch + Speech SDK)</p>
                <p>• <strong>Analyze:</strong> Transcripts are analyzed with GPT-4 using a specialized system prompt</p>
                <p>• <strong>Index:</strong> Analysis results are indexed in Azure AI Search for chat functionality</p>
                <p>• <strong>Search Index:</strong> The "marketing_sentiment_details" index is automatically updated</p>
              </div>
              <div className="mt-3 p-3 bg-blue-100 rounded border border-blue-300">
                <p className="text-xs text-blue-800">
                  <strong>Transcription:</strong> Uses Azure Speech services exclusively for high-quality audio-to-text conversion with speaker diarization support.
                </p>
                <p className="text-xs text-blue-800 mt-1">
                  <strong>Azure Speech:</strong> Configured with UAE North region and Speech Batch + Speech SDK for optimal transcription quality.
                </p>
                <p className="text-xs text-blue-800 mt-1">
                  <strong>System Prompt:</strong> Uses a specialized prompt that extracts customer sentiment (1-5 scale), main issues, resolutions, AHT metrics, 
                  and generates structured insights including Call Generated Insights with Customer Sentiment, Call Categorization, Resolution Status, and more.
                </p>
                <p className="text-xs text-blue-800 mt-1">
                  <strong>Output Location:</strong> Analysis JSON files are saved in the "llmanalysis/persona/" folder in Azure Blob Storage for easy access.
                </p>
                <p className="text-xs text-blue-800 mt-1">
                  <strong>After Processing:</strong> View your processed calls in the "Calls Records" page, and chat with your data in the "Chat with Calls" page.
                </p>
                
                {/* Expected JSON Output Format */}
                <details className="mt-3">
                  <summary className="text-xs font-medium text-blue-800 cursor-pointer hover:text-blue-900">
                    📋 Click to see expected JSON output format
                  </summary>
                  <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                    <pre className="text-xs text-blue-800 overflow-x-auto">
{`{
  "summary": "Summary of the conversation",
  "sentiment": {
    "score": 4,
    "explanation": "Customer was satisfied with resolution"
  },
  "main_issues": ["Issue 1", "Issue 2"],
  "resolution": "What agent did",
  "additional_notes": "Extra info",
  "Average Handling Time (AHT)": {
    "score": 180,
    "explanation": "3 minutes estimated from transcript"
  },
  "resolved": {
    "score": true,
    "explanation": "Issue was resolved"
  },
  "disposition": {
    "score": "Resolved",
    "explanation": "Call ended successfully"
  },
  "Call Generated Insights": {
    "Customer Sentiment": "Positive",
    "Call Categorization": "Issue",
    "Resolution Status": "resolved",
    "Main Subject": "Technical problem",
    "Services": "Customer support",
    "Call Outcome": "Resolved",
    "Agent Attitude": "Professional",
    "Call Summary": "Brief summary",
    "Customer Service Metrics": {
      "FCR": true,
      "AHT": 180,
      "Talk time": 150,
      "Hold time": 30
    }
  }
}`}
                    </pre>
                  </div>
                </details>
              </div>
            </div>
            
            {/* File Upload Section */}
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Input
                  type="file"
                  accept=".mp3,.mp4,.wav,.m4a"
                  multiple
                  className="hidden"
                  id="file-upload"
                  onChange={onChooseFiles}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="text-gray-400">
                    <HardDriveIcon className="w-12 h-12 mx-auto mb-2" />
                  </div>
                  <span className="text-lg text-gray-600">Choose Audio Files</span>
                  <span className="text-gray-400">
                    {files.length ? `${files.length} file(s) selected` : "No files chosen"}
                  </span>
                </label>
              </div>
              
              <p className="text-sm text-gray-500">
                Supported formats: MP3, MP4, WAV, M4A. Files will be processed sequentially.
              </p>

              <Button 
                onClick={onUpload} 
                disabled={busy || files.length === 0} 
                className="w-full bg-primary hover:bg-primary/90"
              >
                {busy ? "Processing..." : "Start Processing Pipeline"}
              </Button>
              
              {overallStatus && (
                <div className={`p-3 rounded-lg ${
                  overallStatus.includes('✅') ? 'bg-green-100 text-green-800' : 
                  overallStatus.includes('❌') ? 'bg-red-100 text-red-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {overallStatus}
                      </div>
              )}
                    </div>
                  </CardContent>
                </Card>

        {/* File Progress Section */}
        {fileProgress.length > 0 && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Processing Progress</CardTitle>
              <p className="text-gray-600">Track the status of each file through the processing pipeline</p>
              
              {/* Overall Progress Bar */}
              {busy && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Overall Progress</span>
                    <span>
                      {fileProgress.filter(fp => fp.status === 'completed' || fp.status === 'error').length} / {fileProgress.length} files
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(fileProgress.filter(fp => fp.status === 'completed' || fp.status === 'error').length / fileProgress.length) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fileProgress.map((progress, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(progress.status)}
                        <span className="font-medium">{progress.file.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(progress.status)}`}>
                          {progress.status.charAt(0).toUpperCase() + progress.status.slice(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {progress.file.size > 1024 * 1024 
                          ? `${(progress.file.size / (1024 * 1024)).toFixed(1)} MB`
                          : `${(progress.file.size / 1024).toFixed(1)} KB`
                        }
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-7">{progress.message}</p>
                    
                    {/* Progress indicators for each step */}
                    <div className="mt-3 ml-7 flex space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        ['uploading', 'transcribing', 'analyzing', 'indexing', 'completed'].includes(progress.status) 
                          ? 'bg-green-500' : 'bg-gray-300'
                      }`} title="Upload" />
                      <div className={`w-3 h-3 rounded-full ${
                        ['transcribing', 'analyzing', 'indexing', 'completed'].includes(progress.status) 
                          ? 'bg-green-500' : 'bg-gray-300'
                      }`} title="Transcribe" />
                      <div className={`w-3 h-3 rounded-full ${
                        ['analyzing', 'indexing', 'completed'].includes(progress.status) 
                          ? 'bg-green-500' : 'bg-gray-300'
                      }`} title="Analyze" />
                      <div className={`w-3 h-3 rounded-full ${
                        ['indexing', 'completed'].includes(progress.status) 
                          ? 'bg-green-500' : 'bg-gray-300'
                      }`} title="Index" />
                    </div>
                  </div>
                ))}
                
                {/* Summary Section */}
                {!busy && fileProgress.length > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Processing Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {fileProgress.filter(fp => fp.status === 'completed').length}
                        </div>
                        <div className="text-gray-600">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {fileProgress.filter(fp => fp.status === 'error').length}
                        </div>
                        <div className="text-gray-600">Failed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">
                          {fileProgress.filter(fp => fp.status === 'pending').length}
                        </div>
                        <div className="text-gray-600">Pending</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round((fileProgress.filter(fp => fp.status === 'completed').length / fileProgress.length) * 100)}%
                        </div>
                        <div className="text-gray-600">Success Rate</div>
                    </div>
              </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadRecords;