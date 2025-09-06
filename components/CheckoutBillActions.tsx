'use client';

import { Button, Box } from '@mui/material';
import { Home, Printer as Print, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CheckoutBillActionsProps {
  orderId: string;
}

export default function CheckoutBillActions({ orderId }: CheckoutBillActionsProps) {
  const router = useRouter();

  const handleHome = () => {
    router.push('/');
  };

  const handlePrint = () => {
    window.print();
  };

const handleDownload = async () => {
  const element = document.getElementById("checkout-bill");
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      ignoreElements: () => false,
      // Optional: force background color to white
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;

    pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`order-${orderId}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};


  return (
    <Box 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50"
      sx={{ boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)' }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outlined"
            startIcon={<Home size={20} />}
            onClick={handleHome}
            className="w-full py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
            sx={{ 
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500
            }}
          >
            Home
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<Print size={20} />}
            onClick={handlePrint}
            className="w-full py-3 text-blue-700 border-blue-300 hover:bg-blue-50"
            sx={{ 
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500
            }}
          >
            Print
          </Button>
          
          <Button
            variant="contained"
            startIcon={<Download size={20} />}
            onClick={handleDownload}
            className="w-full py-3 bg-green-600 hover:bg-green-700"
            sx={{ 
              borderRadius: '12px',
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 500,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }
            }}
          >
            Download
          </Button>
        </div>
      </div>
    </Box>
  );
}