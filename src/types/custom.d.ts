// src/types/cloudinary.d.ts
declare module 'cloudinary' {
    export namespace v2 {
        type UploadApiResponse = {
            public_id: string;
            secure_url: string;
            format: string;
            bytes: number;
            width: number;
            height: number;
            resource_type: string;
            created_at: string;
        };

        type DestroyApiResponse = {
            result: 'ok' | 'not found' | 'error';
        };

        interface UploadOptions {
            folder?: string;
            format?: string;
            transformation?: Array<{ width?: number; height?: number; crop?: string; quality?: string }>;
        }

        interface ConfigOptions {
            cloud_name?: string;
            api_key?: string;
            api_secret?: string;
            secure?: boolean;
        }

        const uploader: {
            upload(file: string, options?: UploadOptions): Promise<UploadApiResponse>;
            destroy(publicId: string): Promise<DestroyApiResponse>;
        };

        const config: (options: ConfigOptions) => void;
    }

    export const v2: typeof v2;
}
