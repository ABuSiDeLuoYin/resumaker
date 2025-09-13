/**
 * 文件处理相关工具类
 */
/**
 * 导出文件工具类
 */
export class FileExporter {
    /**
     * 导出文本文件
     */
    static exportText(
        content: string,
        filename: string,
        options: {
            mimeType?: string;
            bom?: boolean;
            encoding?: BufferEncoding;
        } = {}
    ): void {
        const {
            mimeType = 'text/plain;charset=utf-8',
            bom = false,
            encoding = 'utf-8'
        } = options;

        let blobContent: BlobPart[] = [content];

        if (bom) {
            const bomBytes = encoding === 'utf-8'
                ? new Uint8Array([0xEF, 0xBB, 0xBF])
                : new Uint8Array([0xFF, 0xFE]);
            blobContent = [bomBytes, content];
        }

        const blob = new Blob(blobContent, { type: mimeType });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(url), 100);
    }

    /**
     * 导出JSON文件
     */
    static exportJSON(
        data: any,
        filename: string,
        pretty: boolean = true
    ): void {
        const content = pretty
            ? JSON.stringify(data, null, 2)
            : JSON.stringify(data);

        this.exportText(content, filename, {
            mimeType: 'application/json',
            bom: true
        });
    }

}

/**
 * 文件导入参数
 */
export interface FileImportOptions {
    encoding?: string;
    maxFileSize?: number; // 最大文件大小（字节）
    allowedTypes?: string[]; // 允许的MIME类型
}

/**
 * 文件导入工具类
 */
export class FileImporter {
    /**
     * 读取文本文件内容
     */
    static async readTextFile(
      file: File,
      options: FileImportOptions = {}
    ): Promise<string> {
        const {
            encoding = 'utf-8',
            maxFileSize = 10 * 1024 * 1024, // 10MB
            allowedTypes = ['text/plain', 'application/json']
        } = options;

        // 验证文件类型
        if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
            throw new Error(`不支持的文件类型: ${file.type}`);
        }

        // 验证文件大小
        if (file.size > maxFileSize) {
            throw new Error(`文件过大: ${file.size} 字节，最大允许 ${maxFileSize} 字节`);
        }

        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const content = event.target?.result as string;
                    resolve(content);
                } catch (error) {
                    reject(new Error('文件读取失败'));
                }
            };

            reader.onerror = () => {
                reject(new Error('文件读取错误'));
            };

            reader.readAsText(file, encoding);
        });
    }

    /**
     * 从文件读取JSON数据
     */
    static async readJSONFile<T = any>(
      file: File,
      options: FileImportOptions = {}
    ): Promise<T> {
        const content = await this.readTextFile(file, {
            ...options,
            allowedTypes: ['application/json', ...(options.allowedTypes || [])]
        });

        try {
            return JSON.parse(content) as T;
        } catch (error) {
            throw new Error('JSON解析失败: ' + (error instanceof Error ? error.message : '未知错误'));
        }
    }

    /**
     * 处理文件选择事件
     */
    static handleFileSelect(
      event: Event,
      callback: (content: string, file: File) => void,
      options?: FileImportOptions
    ): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (!file) {
            return;
        }

        this.readTextFile(file, options)
          .then(content => callback(content, file))
          .catch(error => {
              console.error('文件导入失败:', error);
              alert(`导入失败: ${error.message}`);
          });
    }

    /**
     * 创建文件选择器
     */
    static createFileInput(
      accept: string = '.txt,.json',
      multiple: boolean = false
    ): HTMLInputElement {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = accept;
        input.multiple = multiple;
        input.style.display = 'none';
        document.body.appendChild(input);
        return input;
    }
}
