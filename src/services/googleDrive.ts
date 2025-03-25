export class GoogleDriveService {
  private static instance: GoogleDriveService;
  private accessToken: string;

  private constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  public static getInstance(accessToken: string): GoogleDriveService {
    if (!GoogleDriveService.instance || GoogleDriveService.instance.accessToken !== accessToken) {
      GoogleDriveService.instance = new GoogleDriveService(accessToken);
    }
    return GoogleDriveService.instance;
  }

  async saveLetter(title: string, content: string): Promise<string> {
    const metadata = {
      name: title,
      mimeType: 'application/vnd.google-apps.document',
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([content], { type: 'text/html' }));

    try {
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to save letter: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error saving to Google Drive:', error);
      throw error;
    }
  }

  async getLetters(): Promise<any[]> {
    try {
      const response = await fetch(
        'https://www.googleapis.com/drive/v3/files?q=mimeType%3D%27application/vnd.google-apps.document%27&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc',
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to fetch letters: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error('Error fetching letters:', error);
      throw error;
    }
  }

  async getLetter(fileId: string): Promise<string> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/html`,
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to fetch letter: ${errorData.error?.message || response.statusText}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Error fetching letter:', error);
      throw error;
    }
  }
}