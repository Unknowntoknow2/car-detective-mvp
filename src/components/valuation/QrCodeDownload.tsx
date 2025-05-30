
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent } from '@/components/ui/card';

interface QrCodeDownloadProps {
  url: string;
  title?: string;
  size?: number;
}

export function QrCodeDownload({ 
  url, 
  title = "Scan to view PDF report", 
  size = 120 
}: QrCodeDownloadProps) {
  return (
    <Card className="w-fit">
      <CardContent className="p-4 flex flex-col items-center gap-3">
        <QRCodeSVG 
          value={url} 
          size={size}
          level="M"
          includeMargin={true}
          bgColor="#ffffff"
          fgColor="#000000"
        />
        <p className="text-xs text-muted-foreground text-center max-w-[120px]">
          {title}
        </p>
      </CardContent>
    </Card>
  );
}

export default QrCodeDownload;
