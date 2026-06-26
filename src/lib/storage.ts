'use client';

import { uploadFileAction } from '@/app/actions';
import { toast } from '@/hooks/use-toast';

/**
 * Uploads an image file by sending it to a server action.
 * The server action then uploads the file to Firebase Storage.
 * This is a robust way to handle uploads and bypasses client-side CORS issues.
 * @param file The image file to upload.
 * @param filePath The full path in Firebase Storage where the file should be saved (e.g., 'products/xyz.png').
 * @returns A promise that resolves with the public download URL of the uploaded image.
 */
export async function uploadImage(file: File, filePath: string): Promise<string> {
    if (!file) {
        throw new Error('Nenhum arquivo fornecido para upload.');
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
        throw new Error('Tipo de arquivo inválido. Apenas JPG e PNG são permitidos.');
    }

    try {
        // 1. Create a FormData object to send the file
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filePath', filePath);

        // 2. Call the server action with the form data
        const { success, url, error } = await uploadFileAction(formData);

        if (!success || !url) {
            throw new Error(error || 'Falha ao obter a URL após o upload.');
        }

        return url;

    } catch (error: any) {
        console.error("Erro no processo de upload de imagem (storage.ts):", error);
        toast({
            title: "Erro no Upload",
            description: error.message || "Não foi possível enviar a imagem. Tente novamente.",
            variant: "destructive"
        });
        // Re-throw the error so the calling function knows the upload failed
        throw error;
    }
}
