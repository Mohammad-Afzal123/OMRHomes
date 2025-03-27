import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { jsPDF } from 'jspdf';
import { 
  Download, 
  FileText, 
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export default function AgreementPreview() {
  const form = useFormContext();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [downloadName, setDownloadName] = useState('rental-agreement.pdf');
  const formValues = form.getValues();

  useEffect(() => {
    // Need to delay PDF generation slightly to allow form values to be properly loaded
    const timer = setTimeout(() => {
      generatePdf();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const formatUtilities = () => {
    const utilities = formValues.utilities || [];
    if (utilities.length === 0) return 'No utilities included in rent';
    
    // Format utilities with proper capitalization
    return utilities
      .map(utility => utility.charAt(0).toUpperCase() + utility.slice(1))
      .join(', ');
  };

  const generatePdf = async () => {
    try {
      setIsGenerating(true);

      // In a real application, this would be more sophisticated
      // For now, we'll simulate the generation with a timeout
      setTimeout(() => {
        try {
          // Create a new jsPDF instance
          const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });

          // Set document properties
          doc.setProperties({
            title: `Rental Agreement - ${formValues.property?.address || 'Property'}`,
            subject: 'Rental Agreement',
            author: 'Dreamy Haven Explorer',
            keywords: 'rental, lease, agreement, property'
          });

          // Add title
          doc.setFontSize(18);
          doc.setFont('helvetica', 'bold');
          doc.text('RENTAL AGREEMENT', 105, 20, { align: 'center' });

          // Add content
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');

          // Add date
          doc.text(`This Rental Agreement made on ${format(new Date(), 'do MMMM yyyy')}`, 20, 30);

          // Add parties
          doc.setFont('helvetica', 'bold');
          doc.text('BETWEEN:', 20, 40);
          doc.setFont('helvetica', 'normal');
          doc.text(`${formValues.landlord?.name || 'Landlord'} (hereinafter referred to as the "LANDLORD")`, 20, 45);
          doc.text(`Address: ${formValues.landlord?.address || 'Not specified'}`, 20, 50);

          doc.setFont('helvetica', 'bold');
          doc.text('AND:', 20, 60);
          doc.setFont('helvetica', 'normal');
          doc.text(`${formValues.tenant?.name || 'Tenant'} (hereinafter referred to as the "TENANT")`, 20, 65);
          doc.text(`Address: ${formValues.tenant?.address || 'Not specified'}`, 20, 70);

          // Property details
          doc.setFont('helvetica', 'bold');
          doc.text('1. PROPERTY:', 20, 85);
          doc.setFont('helvetica', 'normal');
          doc.text(`The Landlord agrees to rent to the Tenant the property located at:`, 20, 90);
          doc.text(`${formValues.property?.address || 'Not specified'}`, 20, 95);

          // Term
          doc.setFont('helvetica', 'bold');
          doc.text('2. TERM:', 20, 105);
          doc.setFont('helvetica', 'normal');
          doc.text(`The term of this Lease shall begin on ${formValues.property?.startDate ? format(new Date(formValues.property.startDate), 'do MMMM yyyy') : 'Not specified'}`, 20, 110);
          doc.text(`and end on ${formValues.property?.endDate ? format(new Date(formValues.property.endDate), 'do MMMM yyyy') : 'Not specified'}.`, 20, 115);

          // Rent
          doc.setFont('helvetica', 'bold');
          doc.text('3. RENT:', 20, 125);
          doc.setFont('helvetica', 'normal');
          doc.text(`The Tenant shall pay rent of ₹${formValues.property?.rent || '0'} per month.`, 20, 130);

          // Security Deposit
          doc.setFont('helvetica', 'bold');
          doc.text('4. SECURITY DEPOSIT:', 20, 140);
          doc.setFont('helvetica', 'normal');
          doc.text(`The Tenant shall pay a security deposit of ₹${formValues.property?.deposit || '0'} to be held by the`, 20, 145);
          doc.text(`Landlord as security for the faithful performance by the Tenant of the terms of this Agreement.`, 20, 150);

          // Utilities
          doc.setFont('helvetica', 'bold');
          doc.text('5. UTILITIES:', 20, 160);
          doc.setFont('helvetica', 'normal');
          doc.text(`The following utilities are included in the rent: ${formatUtilities()}`, 20, 165);

          // Amenities
          if (formValues.amenities && formValues.amenities.length > 0) {
            doc.setFont('helvetica', 'bold');
            doc.text('6. AMENITIES:', 20, 175);
            doc.setFont('helvetica', 'normal');
            
            // Split amenities into multiple lines if needed
            const amenitiesText = formValues.amenities.join(', ');
            const amenitiesLines = doc.splitTextToSize(amenitiesText, 170);
            let yPos = 180;
            amenitiesLines.forEach((line: string) => {
              doc.text(line, 20, yPos);
              yPos += 5;
            });
          }

          // Special conditions
          if (formValues.specialConditions) {
            doc.setFont('helvetica', 'bold');
            doc.text('7. SPECIAL CONDITIONS:', 20, 190);
            doc.setFont('helvetica', 'normal');
            
            // Split special conditions into multiple lines if needed
            const specialConditionsLines = doc.splitTextToSize(formValues.specialConditions, 170);
            let yPos = 195;
            specialConditionsLines.forEach((line: string) => {
              doc.text(line, 20, yPos);
              yPos += 5;
            });
          }

          // Add signature sections (to be filled in the SignatureCapture component)
          doc.addPage();
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('SIGNATURES', 105, 20, { align: 'center' });
          
          doc.setFontSize(11);
          doc.text('IN WITNESS WHEREOF, the parties have executed this Agreement on the date first above written.', 20, 30);
          
          // Landlord signature
          doc.setFont('helvetica', 'bold');
          doc.text('LANDLORD:', 20, 50);
          doc.line(20, 60, 90, 60);
          doc.setFont('helvetica', 'normal');
          doc.text(`${formValues.landlord?.name || 'Landlord'}`, 20, 65);
          doc.text('Date: _______________________', 20, 75);
          
          // Tenant signature
          doc.setFont('helvetica', 'bold');
          doc.text('TENANT:', 120, 50);
          doc.line(120, 60, 190, 60);
          doc.setFont('helvetica', 'normal');
          doc.text(`${formValues.tenant?.name || 'Tenant'}`, 120, 65);
          doc.text('Date: _______________________', 120, 75);

          // Add page numbers
          const pageCount = doc.internal.getNumberOfPages();
          for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
          }

          // Generate PDF blob and URL
          const pdfBlob = doc.output('blob');
          const pdfUrl = URL.createObjectURL(pdfBlob);
          setPreviewUrl(pdfUrl);
          
          // Set a more personalized download name
          if (formValues.landlord?.name && formValues.tenant?.name) {
            const landlordName = formValues.landlord.name.split(' ')[0];
            const tenantName = formValues.tenant.name.split(' ')[0];
            setDownloadName(`${landlordName}-${tenantName}-agreement.pdf`);
          }
          
          setIsGenerating(false);
        } catch (error) {
          console.error('Error generating PDF:', error);
          
          // Fallback to a placeholder PDF for demo purposes
          const placeholderPdfUrl = "https://www.africau.edu/images/default/sample.pdf";
          setPreviewUrl(placeholderPdfUrl);
          setIsGenerating(false);
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error in generatePdf:', error);
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (previewUrl) {
      // Create an anchor element and trigger download
      const a = document.createElement('a');
      a.href = previewUrl;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col space-y-4">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Agreement Preview</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <FileText className="w-3 h-3 mr-1" />
                PDF Document
              </Badge>
              <Button 
                onClick={handleDownload} 
                disabled={isGenerating}
                size="sm"
                className="gap-1"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
          
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-96 border rounded-md bg-gray-50">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Generating your agreement...</p>
              <motion.div 
                className="w-64 h-1 mt-6 bg-gray-200 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5 }}
              >
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5 }}
                />
              </motion.div>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden h-96">
              <iframe 
                src={previewUrl || ""} 
                className="w-full h-full" 
                title="Rental Agreement Preview"
              />
            </div>
          )}
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Agreement Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Landlord:</p>
                <p className="font-medium">{formValues.landlord?.name || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tenant:</p>
                <p className="font-medium">{formValues.tenant?.name || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Property Address:</p>
                <p className="font-medium">{formValues.property?.address || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Monthly Rent:</p>
                <p className="font-medium">₹{formValues.property?.rent || '0'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Lease Period:</p>
                <p className="font-medium">
                  {formValues.property?.startDate && formValues.property?.endDate 
                    ? `${formValues.property.startDate} to ${formValues.property.endDate}`
                    : 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
} 