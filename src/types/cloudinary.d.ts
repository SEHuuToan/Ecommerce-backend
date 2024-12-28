declare module 'cloudinary' {
    export interface UploadResponse {
      public_id: string;
      version: number;
      width: number;
      height: number;
      format: string;
      resource_type: string;
      url: string;
      secure_url: string;
      signature: string;
      // Các trường khác nếu cần
    }
  
    export interface Resource {
      public_id: string;
      format: string;
      width: number;
      height: number;
      url: string;
      secure_url: string;
      // Các trường khác nếu cần
    }
  
    export interface SearchResult {
      resources: Resource[];
      next_cursor?: string;
      // Các trường khác nếu cần
    }
  
    export const v2: {
      uploader: {
        upload: (file: string | Buffer, options?: Record<string>) => Promise<UploadResponse>;
        destroy: (publicId: string, options?: Record<string>) => Promise<string>;
      };
      api: {
        resources: (options: Record<string>) => Promise<Resource[]>;
      };
      search: {
        expression: (expression: string) => {
          max_results: (maxResults: number) => {
            execute: () => Promise<SearchResult>;
          };
        };
      };
      image: (publicId: string, options?: Record<string>) => string;
      config: (options: Record<string>) => void;
    };
  
    export const config: (options: Record<string>) => void;
    export const uploader: {
      upload: (file: string | Buffer, options?: Record<string>) => Promise<UploadResponse>;
      destroy: (publicId: string, options?: Record<string>) => Promise<string>;
    };
  }
  