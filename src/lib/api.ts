export type UploadResult = {
  status: string;
  processed: Array<{
    file: string;
    transcription_blob: string;
    analysis_blob: string;
  }>;
};

export type CallListItem = {
  audio_name: string;
  call_id: string;
  uploaded_at?: string | null;
  analysis?: any;
};

export type CallDetail = {
  call_id: string;
  audio_url?: string | null;
  transcript?: string | null;
  analysis?: any;
};

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

export const apiUpload = async (files: File[]): Promise<{
  status: string;
  processed: Array<{
    file: string;
    transcription_blob?: string;
    analysis_blob?: string;
    search_indexed?: boolean;
    error?: string;
  }>;
}> => {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  
  const response = await fetch('/api/upload-complete', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }
  
  return response.json();
};

export const apiUploadSingle = async (file: File): Promise<{
  status: string;
  processed: Array<{
    file: string;
    transcription_blob?: string;
    analysis_blob?: string;
    search_indexed?: boolean;
    error?: string;
  }>;
}> => {
  const formData = new FormData();
  formData.append('files', file);

  const response = await fetch('/api/upload-complete', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
};

export async function apiListCalls(): Promise<CallListItem[]> {
  const res = await fetch(`${API_BASE}/calls`);
  if (!res.ok) throw new Error(`List failed: ${res.status}`);
  return res.json();
}

export async function apiGetCall(callId: string): Promise<CallDetail> {
  const res = await fetch(`${API_BASE}/calls/${encodeURIComponent(callId)}`);
  if (!res.ok) throw new Error(`Get failed: ${res.status}`);
  return res.json();
}

export async function apiSummary(): Promise<any> {
  const res = await fetch(`${API_BASE}/dashboard/summary`);
  if (!res.ok) throw new Error(`Summary failed: ${res.status}`);
  return res.json();
}

export const apiChat = async (text: string, messages: Array<{ role: "ai" | "user"; text: string }>) => {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: text,
      history: messages,
    }),
  });
  if (!res.ok) {
    throw new Error(`Chat failed: ${res.status}`);
  }
  return res.json();
};

export const apiReindexAllCalls = async (): Promise<{
  status: string;
  message: string;
  indexed_count: number;
  total_calls: number;
  previous_count?: number;
  new_count?: number;
}> => {
  const response = await fetch(`${API_BASE}/reindex-all-calls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Re-indexing failed: ${response.statusText}`);
  }
  
  return response.json();
};


