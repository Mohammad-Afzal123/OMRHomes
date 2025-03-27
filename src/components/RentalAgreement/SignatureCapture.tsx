import React, { useRef, useState, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { PenLine, Save, Trash2, Download, CheckCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Dynamically import SignatureCanvas to avoid rendering issues
const SignaturePad = lazy(() => import('react-signature-canvas'));

export default function SignatureCapture() {
  const form = useFormContext();
  const [activeSignature, setActiveSignature] = useState('landlord');
  const [signatureUrls, setSignatureUrls] = useState({
    landlord: '',
    tenant: '',
    witness1: '',
    witness2: ''
  });
  const [finalDocumentUrl, setFinalDocumentUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const sigRefs = {
    landlord: useRef(null),
    tenant: useRef(null),
    witness1: useRef(null),
    witness2: useRef(null)
  };

  const clearSignature = () => {
    if (sigRefs[activeSignature as keyof typeof sigRefs]?.current) {
      sigRefs[activeSignature as keyof typeof sigRefs].current.clear();
      // Clear from state too
      setSignatureUrls(prev => ({
        ...prev,
        [activeSignature]: ''
      }));
    }
  };

  const saveSignature = () => {
    if (sigRefs[activeSignature as keyof typeof sigRefs]?.current && 
        !sigRefs[activeSignature as keyof typeof sigRefs].current.isEmpty()) {
      const dataURL = sigRefs[activeSignature as keyof typeof sigRefs].current
        .getTrimmedCanvas()
        .toDataURL('image/png');
      
      setSignatureUrls(prev => ({
        ...prev,
        [activeSignature]: dataURL
      }));

      // Also update the form context
      form.setValue(`signatures.${activeSignature}`, dataURL);
      
      // Show success feedback
      const element = document.getElementById(`${activeSignature}-success`);
      if (element) {
        element.classList.remove('opacity-0');
        setTimeout(() => {
          element.classList.add('opacity-0');
        }, 2000);
      }
    }
  };

  const processAndDownload = () => {
    setIsProcessing(true);
    
    // Simulate PDF processing with signatures
    setTimeout(() => {
      // For demo, we'll just use a sample PDF
      const samplePdfUrl = "https://www.africau.edu/images/default/sample.pdf";
      setFinalDocumentUrl(samplePdfUrl);
      setIsProcessing(false);
    }, 3000);
  };

  const handleDownload = () => {
    if (finalDocumentUrl) {
      const a = document.createElement('a');
      a.href = finalDocumentUrl;
      a.download = 'signed-rental-agreement.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const SignaturePadWithFallback = () => (
    <Suspense fallback={
      <div className="flex items-center justify-center h-48 bg-gray-100">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading signature pad...</span>
      </div>
    }>
      <SignaturePad
        ref={sigRefs[activeSignature as keyof typeof sigRefs]}
        canvasProps={{
          className: "signature-canvas w-full h-full absolute top-0 left-0",
        }}
        backgroundColor="rgba(0,0,0,0)"
        penColor="black"
      />
    </Suspense>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Digital Signatures</CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <PenLine className="w-3 h-3 mr-1" />
              Electronic Signatures
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeSignature} onValueChange={setActiveSignature}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="landlord">Landlord</TabsTrigger>
              <TabsTrigger value="tenant">Tenant</TabsTrigger>
              <TabsTrigger value="witness1">Witness 1</TabsTrigger>
              <TabsTrigger value="witness2">Witness 2</TabsTrigger>
            </TabsList>
            
            {Object.keys(sigRefs).map((key) => (
              <TabsContent key={key} value={key} className="outline-none">
                <div className="space-y-4">
                  <div className="border rounded-md p-2 bg-white">
                    <div className="h-48 rounded-md bg-gray-50 border border-dashed flex items-center justify-center relative overflow-hidden">
                      {signatureUrls[key as keyof typeof signatureUrls] ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white">
                          <img 
                            src={signatureUrls[key as keyof typeof signatureUrls]} 
                            alt="Signature" 
                            className="max-h-full max-w-full" 
                          />
                        </div>
                      ) : null}
                      {key === activeSignature && <SignaturePadWithFallback />}
                      <div id={`${key}-success`} className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs flex items-center transition-opacity duration-300 opacity-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Saved
                      </div>
                    </div>
                    <div className="flex justify-between mt-2">
                      <Button variant="outline" size="sm" onClick={clearSignature}>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                      <Button size="sm" onClick={saveSignature}>
                        <Save className="w-4 h-4 mr-1" />
                        Save Signature
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Please sign in the box above and save your signature.
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="mt-8 border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Generate Final Document</h3>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="text-sm max-w-md">
                <p>
                  After all parties have signed, you can generate the final document with embedded signatures.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {Object.entries(signatureUrls).map(([key, value]) => (
                    <Badge 
                      key={key} 
                      variant={value ? "default" : "outline"}
                      className={value ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)} {value ? "✓" : "○"}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                {finalDocumentUrl ? (
                  <Button onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                ) : (
                  <Button 
                    onClick={processAndDownload} 
                    disabled={isProcessing || (!signatureUrls.landlord && !signatureUrls.tenant)}
                  >
                    {isProcessing ? (
                      <>
                        <span className="animate-spin mr-1">◌</span>
                        Processing...
                      </>
                    ) : (
                      <>Generate Document</>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 